using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using WaniKani.Relearn.Contracts.Assignments;
using WaniKani.Relearn.Contracts.Resources;
using WaniKani.Relearn.Contracts.Subjects;
using WaniKani.Relearn.Data;
using WaniKani.Relearn.Data.Entities;
using WaniKani.Relearn.Subjects.Data.Models;
using WaniKani.Relearn.Subjects.Data.Models.Reading;
using System.Threading.Tasks;
using System.IO;

namespace WaniKani.Relearn.Subjects.Data;

public class SentenceExtractor(
    SubjectCache subjectCache,
    IConfiguration configuration)
{
    public void ProcessMorphemesInSentence(ReadingSentence sentence)
    {
        var morphemes = sentence.Morphemes;

        int i = 0;
        while (i < morphemes.Count)
        {
            var morpheme = morphemes[i];

            // 0. Look-ahead check for numeric morphemes followed by a counter
            if (IsNumeric(morpheme))
            {
                int k = i + 1;
                while (k < morphemes.Count && IsNumeric(morphemes[k]))
                {
                    k++;
                }
                if (k < morphemes.Count && IsCounter(morphemes[k]))
                {
                    // This number is part of a number-counter phrase.
                    // Do not link it or add to vocabulary.
                    i++;
                    continue;
                }
            }

            // 1. Counter (助数詞) processing
            var isCounter = IsCounter(morpheme);
            if (isCounter && i > 0)
            {
                // Scan backwards to collect all consecutive numeric morphemes
                var numberParts = new List<string>();
                int j = i - 1;
                while (j >= 0)
                {
                    var m = morphemes[j];
                    if (IsNumeric(m))
                    {
                        numberParts.Add(m.Surface);
                        j--;
                    }
                    else
                    {
                        break;
                    }
                }

                if (numberParts.Count > 0)
                {
                    numberParts.Reverse();
                    var combinedPrefix = string.Concat(numberParts);
                    var combinedFormLemma = combinedPrefix + morpheme.Lemma;
                    var combinedFormOrth = combinedPrefix + morpheme.Orth;

                    // Clean up the preceding numbers from vocabulary since they are part of the counter phrase
                    for (int k = i - 1; k > j; k--)
                    {
                        var numMorpheme = morphemes[k];
                        if (numMorpheme.SubjectId.HasValue)
                        {
                            int numId = numMorpheme.SubjectId.Value;
                            sentence.SourceVocabulary.RemoveAll(x => x.SubjectId == numId);
                            numMorpheme.SubjectId = null;
                        }
                    }

                    // Try to link the combined number+counter (e.g. 七つ)
                    if (TryLinkSubject(morpheme, combinedFormLemma) || TryLinkSubject(morpheme, combinedFormOrth))
                    {
                        morpheme.CombinedForm = combinedPrefix + morpheme.Surface;
                        i++;
                        continue;
                    }

                    // If combined form is not found in cache, check if we should link the counter itself.
                    // The counter must not contain Kanji (like 匹, 本) when preceded by a number.
                    bool counterContainsKanji = (morpheme.Lemma ?? "").Any(c => c >= '\u4E00' && c <= '\u9FFF')
                                                || (morpheme.Orth ?? "").Any(c => c >= '\u4E00' && c <= '\u9FFF');
                    
                    if (!counterContainsKanji)
                    {
                        morpheme.SubjectId = null;
                        i++;
                        continue;
                    }
                }
            }

            // 2. Aux verbal prefix verb processing (お, ご, 御 prefix)
            if (i < morphemes.Count - 1)
            {
                var nextMorpheme = morphemes[i + 1];
                if ((morpheme.Surface == "お" || morpheme.Surface == "ご" || morpheme.Surface == "御") &&
                    morpheme.Pos1.Ja == "接頭辞")
                {
                    var combinedFormLemma = morpheme.Surface + nextMorpheme.Lemma;
                    var combinedFormOrth = morpheme.Surface + nextMorpheme.Orth;

                    if (TryLinkSubject(nextMorpheme, combinedFormLemma) || TryLinkSubject(nextMorpheme, combinedFormOrth))
                    {
                        nextMorpheme.CombinedForm = morpheme.Surface + nextMorpheme.Surface;
                        morpheme.SubjectId = null;
                        i += 2;
                        continue;
                    }
                }
            }

            // 3. Multi-morpheme look-ahead (Compound Words / Idioms)
            bool compoundFound = false;
            for (int len = 3; len >= 2; len--)
            {
                if (i + len <= morphemes.Count)
                {
                    var slice = morphemes.GetRange(i, len);
                    var combinedSurface = string.Concat(slice.Select(m => m.Surface));
                    var combinedLemma = string.Concat(slice.Select(m => m.Lemma));
                    var combinedOrth = string.Concat(slice.Select(m => m.Orth));

                    // Try matching the combined string
                    if (TryLinkSubject(morpheme, combinedSurface) ||
                        TryLinkSubject(morpheme, combinedLemma) ||
                        TryLinkSubject(morpheme, combinedOrth))
                    {
                        morpheme.CombinedForm = combinedSurface;

                        // Null out subject IDs of the absorbed morphemes
                        for (int k = 1; k < len; k++)
                        {
                            slice[k].SubjectId = null;
                        }

                        i += len;
                        compoundFound = true;
                        break;
                    }
                }
            }

            if (compoundFound) continue;

            // 4. Single morpheme processing
            // Prioritize noun forms for 名詞
            if (morpheme.Pos1.Ja == "名詞")
            {
                if (TryLinkSubject(morpheme, morpheme.Surface) ||
                    TryLinkSubject(morpheme, morpheme.Orth) ||
                    TryLinkSubject(morpheme, morpheme.Lemma))
                {
                    i++;
                    continue;
                }
            }
            else
            {
                // Prioritize lemma (dictionary form) for verbs, adjectives, etc.
                if (TryLinkSubject(morpheme, morpheme.Lemma) ||
                    TryLinkSubject(morpheme, morpheme.Orth) ||
                    TryLinkSubject(morpheme, morpheme.Surface))
                {
                    i++;
                    continue;
                }
            }

            i++;
        }

        // Post-processing pass: Sync vocabulary tags with matched morphemes
        var matchedSubjectIds = morphemes
            .Where(m => m.SubjectId.HasValue)
            .Select(m => m.SubjectId!.Value)
            .ToHashSet();

        foreach (var subjectId in matchedSubjectIds)
        {
            if (!sentence.SourceVocabulary.Any(v => v.SubjectId == subjectId))
            {
                var subject = subjectCache.TryGet(subjectId, out var sub) ? sub : null;
                var characters = subject?.Characters ?? "";
                if (string.IsNullOrEmpty(characters) && subject is Models.Vocabulary vocab)
                {
                    characters = vocab.Characters ?? "";
                }

                sentence.SourceVocabulary.Add(new SubjectReference
                {
                    SubjectId = subjectId,
                    Characters = subject?.Characters ?? characters
                });
            }
        }
    }

    public async Task ExtractAndSaveToDbAsync(BonpomDbContext dbContext)
    {
        if (await dbContext.SentenceSubjectReferences.AnyAsync())
        {
            return;
        }

        var existingSentencesMap = await dbContext.ContextSentences
            .AsNoTracking()
            .Select(cs => new { cs.Id, cs.Ja })
            .ToListAsync();

        var existingDict = existingSentencesMap
            .GroupBy(cs => cs.Ja)
            .ToDictionary(g => g.Key, g => g.First().Id);

        List<ReadingSentence> sentences = [];

        var processedFilePath = Path.Combine(configuration["StaticFiles:Path"] ?? "", "context-sentences-processed.json");
        if (!File.Exists(processedFilePath))
        {
            processedFilePath = "../context-sentences-processed.json";
        }

        if (File.Exists(processedFilePath))
        {
            using StreamReader file = File.OpenText(processedFilePath);
            await using JsonTextReader reader = new JsonTextReader(file);
            var jArray = (JArray)await JToken.ReadFromAsync(reader);
            sentences = jArray.ToObject<List<ReadingSentence>>() ?? [];
        }
        else
        {
            var raw = new List<(string Ja, string En, int Level, SubjectReference Source)>();
            var vocabulary = subjectCache.GetAllOfType(SubjectType.Vocabulary.ToSnakeCaseString())
                .Concat(subjectCache.GetAllOfType(SubjectType.KanaVocabulary.ToSnakeCaseString()));

            foreach (var resource in vocabulary)
            {
                var sList = GetSentence((Models.Vocabulary)resource);
                raw.AddRange(sList);
            }

            sentences = raw.GroupBy(x => x.Ja).Select(g => new ReadingSentence
            {
                Ja = g.Key,
                En = g.First().En,
                Level = g.Min(x => x.Level),
                SourceVocabulary = g.Select(x => x.Source).DistinctBy(x => x.SubjectId).ToList(),
                KanjiInSentence = ExtractKanji(g.Key)
            }).ToList();
        }

        var referencesToInsert = new List<SentenceSubjectReferenceEntity>();
        var morphemesToInsert = new List<SentenceMorphemeEntity>();

        foreach (var s in sentences)
        {
            long sentenceId;
            if (existingDict.TryGetValue(s.Ja, out var id))
            {
                sentenceId = id;
            }
            else
            {
                var newEntity = new ContextSentenceEntity
                {
                    SubjectId = s.SourceVocabulary.FirstOrDefault()?.SubjectId,
                    Ja = s.Ja,
                    En = s.En,
                    Level = s.Level
                };
                dbContext.ContextSentences.Add(newEntity);
                await dbContext.SaveChangesAsync();
                sentenceId = newEntity.Id;
                existingDict[s.Ja] = sentenceId;
            }

            foreach (var sv in s.SourceVocabulary)
            {
                referencesToInsert.Add(new SentenceSubjectReferenceEntity
                {
                    SentenceId = sentenceId,
                    SubjectId = sv.SubjectId,
                    ReferenceType = "source_vocabulary"
                });
            }

            foreach (var kj in s.KanjiInSentence)
            {
                referencesToInsert.Add(new SentenceSubjectReferenceEntity
                {
                    SentenceId = sentenceId,
                    SubjectId = kj.SubjectId,
                    ReferenceType = "kanji_in_sentence"
                });
            }

            if (s.Morphemes != null)
            {
                int seq = 0;
                foreach (var m in s.Morphemes)
                {
                    morphemesToInsert.Add(new SentenceMorphemeEntity
                    {
                        SentenceId = sentenceId,
                        SequenceOrder = seq++,
                        SubjectId = m.SubjectId,
                        Surface = m.Surface,
                        Lemma = m.Lemma,
                        LemmaReading = m.LemmaReading,
                        Orth = m.Orth,
                        Pron = m.Pron,
                        ConjugationType = m.ConjugationType,
                        ConjugationForm = m.ConjugationForm,
                        Pos1Ja = m.Pos1?.Ja,
                        Pos1En = m.Pos1?.En,
                        Pos2Ja = m.Pos2?.Ja,
                        Pos2En = m.Pos2?.En,
                        Pos3Ja = m.Pos3?.Ja,
                        Pos3En = m.Pos3?.En,
                        Pos4Ja = m.Pos4?.Ja,
                        Pos4En = m.Pos4?.En,
                    });
                }
            }
        }

        var distinctRefs = referencesToInsert
            .DistinctBy(r => new { r.SentenceId, r.SubjectId, r.ReferenceType })
            .ToList();

        const int batchSize = 1000;
        for (int i = 0; i < distinctRefs.Count; i += batchSize)
        {
            var batch = distinctRefs.Skip(i).Take(batchSize);
            dbContext.SentenceSubjectReferences.AddRange(batch);
            await dbContext.SaveChangesAsync();
        }

        for (int i = 0; i < morphemesToInsert.Count; i += batchSize)
        {
            var batch = morphemesToInsert.Skip(i).Take(batchSize);
            dbContext.SentenceMorphemes.AddRange(batch);
            await dbContext.SaveChangesAsync();
        }
    }

    private List<SubjectReference> ExtractKanji(string ja)
    {
        var result = new List<SubjectReference>();
        var seen = new HashSet<char>();
        foreach (var ch in ja)
        {
            if (ch < '\u4E00' || ch > '\u9FFF' || !seen.Add(ch)) continue;
            var kanjiSubject = subjectCache.FindByCharacters(ch.ToString(), SubjectType.Kanji);
            if (kanjiSubject != null)
            {
                result.Add(new SubjectReference
                {
                    SubjectId = kanjiSubject.Id,
                    Characters = ch.ToString()
                });
            }
        }
        return result;
    }

    private List<(string Ja, string En, int Level, SubjectReference Source)> GetSentence(Subjects.Data.Models.Vocabulary vocab)
    {
        var result = new List<(string Ja, string En, int Level, SubjectReference Source)>();
        if (vocab?.ContextSentences == null)
        {
            return [];
        }
        foreach (var sentence in vocab.ContextSentences)
        {
            result.Add((
                 sentence.Ja,
                 sentence.En,
                 vocab.Level,
                 new SubjectReference { SubjectId = vocab.Id, Characters = vocab.Characters! }
             ));
        }
        return result;
    }

    private List<(string Ja, string En, int Level, SubjectReference Source)> GetSentence(SingleResource<KanaVocabulary> vocab)
    {
        var result = new List<(string Ja, string En, int Level, SubjectReference Source)>();
        foreach (var sentence in vocab.Data.ContextSentences)
        {
            result.Add((
                 sentence.Ja,
                 sentence.En,
                 vocab.Data.Level,
                 new SubjectReference { SubjectId = vocab.Id, Characters = vocab.Data.Characters! }
             ));
        }
        return result;
    }

    private bool TryLinkSubject(Morpheme morpheme, string query)
    {
        if (string.IsNullOrEmpty(query)) return false;

        var subject = subjectCache.FindByCharacters(query, SubjectType.Vocabulary) ??
                      subjectCache.FindByCharacters(query, SubjectType.KanaVocabulary);

        if (subject != null)
        {
            morpheme.SubjectId = subject.Id;
            return true;
        }

        return false;
    }

    private static bool IsNumeric(Morpheme morpheme)
    {
        return morpheme.Pos1.Ja == "名詞" && morpheme.Pos2.Ja == "数";
    }

    private static bool IsCounter(Morpheme morpheme)
    {
        return (morpheme.Pos1.Ja == "名詞" && morpheme.Pos2.Ja == "接尾" && morpheme.Pos3.Ja == "助数詞") ||
               (morpheme.Pos1.Ja == "接尾辞" && morpheme.Pos2.Ja == "名詞的" && morpheme.Pos3.Ja == "助数詞");
    }
}
