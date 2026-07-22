using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using WaniKani.Relearn.Contracts.Assignments;
using WaniKani.Relearn.Contracts.Resources;
using WaniKani.Relearn.Contracts.Subjects;
using WaniKani.Relearn.Subjects.Data.Models;
using WaniKani.Relearn.Subjects.Data.Models.Reading;

namespace WaniKani.Relearn.Subjects.Data;

// todo:しなく - suru + nai
// todo: fix ない processing
// をするんだ -- する after を

// してしまった
// 二ですç
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
                        TryLinkSubject(morpheme, morpheme.Lemma);
                    }

                    // Set CombinedForm so they are visually unified
                    morpheme.CombinedForm = combinedPrefix + morpheme.Surface;
                    i++;
                    continue;
                }
            }

            // 2. Auxiliary Verb (助動詞) processing (e.g. ます, ない, たい, た)
            var isAuxiliary = (morpheme.Pos1.En == "auxiliary verb" 
                              || morpheme.Pos1.Ja == "助動詞"
                              || morpheme.Lemma == "ます" 
                              || morpheme.Lemma == "たい" 
                              || morpheme.Lemma == "ない" 
                              || morpheme.Lemma == "た" 
                              || morpheme.LemmaReading == "マス" 
                              || morpheme.LemmaReading == "ナイ" 
                              || morpheme.LemmaReading == "タイ" 
                              || morpheme.LemmaReading == "タ")
                              && morpheme.Lemma != "です"
                              && morpheme.LemmaReading != "デス";
            if (isAuxiliary && i > 0)
            {
                var prevMorpheme = morphemes[i - 1];
                if (prevMorpheme.SubjectId != null && prevMorpheme.SubjectId != 0)
                {
                    morpheme.SubjectId = prevMorpheme.SubjectId;
                    morpheme.CombinedForm = prevMorpheme.CombinedForm ?? prevMorpheme.Lemma;
                }
                else if (prevMorpheme.CombinedForm != null)
                {
                    morpheme.CombinedForm = prevMorpheme.CombinedForm;
                }
                else
                {
                    // Fallback to look up previous morpheme's Lemma directly in the cache
                    var parentLemma = prevMorpheme.Lemma;
                    if (TryLinkSubject(morpheme, parentLemma))
                    {
                        morpheme.CombinedForm = parentLemma;
                    }
                }
                i++;
                continue;
            }

            // 3. Suru Verb (サ変助動詞 / サ行変格) processing
            if (morpheme.LemmaReading == "スル" && i > 0)
            {
                var prevMorpheme = morphemes[i - 1];

                // Check "noun + を + する" -> combined to noun + "する"
                if (i > 1 && (prevMorpheme.Lemma == "を" || prevMorpheme.Surface == "を") && (prevMorpheme.Pos1.En == "particle" || prevMorpheme.Pos1.Ja == "助詞"))
                {
                    var nounMorpheme = morphemes[i - 2];
                    var combinedCharacters = nounMorpheme.Lemma + "する";
                    if (TryLinkSubject(morpheme, combinedCharacters))
                    {
                        morpheme.CombinedForm = combinedCharacters;
                        i++;
                        continue;
                    }
                }

                // Check if Noun + する exists in cache (dictionary check takes precedence)
                var combinedSuruCharacters = prevMorpheme.Lemma + "する";
                if (TryLinkSubject(morpheme, combinedSuruCharacters))
                {
                    morpheme.CombinedForm = combinedSuruCharacters;
                    i++;
                    continue;
                }

                // If not in cache, check if this is a standalone "する" based on POS tags
                var isPrevStandaloneTrigger = prevMorpheme.Pos1.En == "particle" 
                                              || prevMorpheme.Pos1.Ja == "助詞"
                                              || prevMorpheme.Pos1.En == "suffix" 
                                              || prevMorpheme.Pos1.Ja == "接尾辞"
                                              || prevMorpheme.Pos1.En == "auxiliary verb" 
                                              || prevMorpheme.Pos1.Ja == "助動詞"
                                              || prevMorpheme.Pos1.En == "助数詞" 
                                              || prevMorpheme.Pos1.Ja == "助数詞"
                                              || (prevMorpheme.Pos1.En == "noun" && prevMorpheme.Pos2.En == "number")
                                              || (prevMorpheme.Pos1.Ja == "名詞" && prevMorpheme.Pos2.Ja == "数");

                var isPrevVerbalNoun = prevMorpheme.Pos2.Ja == "サ変接続" 
                                       || prevMorpheme.Pos2.En == "verbal"
                                       || prevMorpheme.Pos1.En == "verbal noun"
                                       || prevMorpheme.Pos1.Ja == "サ変名詞";

                if (isPrevStandaloneTrigger || !isPrevVerbalNoun)
                {
                    TryLinkSubject(morpheme, "する");
                    i++;
                    continue;
                }

                // Fallback for suru verbs not in WaniKani: link to the base noun
                if (TryLinkSubject(morpheme, prevMorpheme.Lemma))
                {
                    morpheme.CombinedForm = prevMorpheme.Lemma;
                }
                else
                {
                    // Final fallback: link to "する" itself
                    TryLinkSubject(morpheme, "する");
                }
                i++;
                continue;
            }

            // 4. Suffix (接尾辞) processing
            var isSuffix = morpheme.Pos1.En == "suffix" || morpheme.Pos1.Ja == "接尾辞";
            if (isSuffix && i > 0)
            {
                var prevMorpheme = morphemes[i - 1];
                var isPrevParticle = prevMorpheme.Pos1.En == "particle" || prevMorpheme.Pos1.Ja == "助詞";
                if (isPrevParticle)
                {
                    i++;
                    continue;
                }
                
                var combinedCharacters = prevMorpheme.Lemma + morpheme.Lemma;
                if (TryLinkSubject(morpheme, combinedCharacters))
                {
                    morpheme.CombinedForm = combinedCharacters;
                }
                else
                {
                    // Fallback for suffix not in WaniKani: link to the base noun
                    if (TryLinkSubject(morpheme, prevMorpheme.Lemma))
                    {
                        morpheme.CombinedForm = prevMorpheme.Lemma;
                    }
                }
                i++;
                continue;
            }

            // 5. Standard dictionary/cache lookup
            if (!TryLinkSubject(morpheme, morpheme.Lemma))
            {
                TryLinkSubject(morpheme, morpheme.Orth);
            }

            i++;
        }

        // --- Helper local functions ---

        bool IsNumeric(Morpheme m)
        {
            return m.Pos2.En == "数" 
                   || m.Pos2.Ja == "数" 
                   || m.Pos1.En == "number" 
                   || m.Pos1.Ja == "数" 
                   || m.Surface.All(IsDigitOrNumeral);
        }

        bool IsCounter(Morpheme m)
        {
            return m.Pos1.Ja == "助数詞" 
                   || m.Pos2.Ja == "助数詞" 
                   || m.Pos2.Ja == "助数詞可能" 
                   || m.Pos1.En == "助数詞"
                   || m.Pos1.En == "counter"
                   || m.Pos2.En == "counter";
        }

        bool TryLinkSubject(Morpheme m, string? characters)
        {
            if (string.IsNullOrEmpty(characters)) return false;
            var subjectId = subjectCache.GetIdByCharacters(characters);
            if (subjectId != 0)
            {
                m.SubjectId = subjectId;
                subjectCache.TryGet(subjectId, out var subject);
                AddSubjectToSourceVocabulary(subjectId, characters, subject);
                return true;
            }
            return false;
        }

        bool IsDigitOrNumeral(char c)
        {
            return (c >= '0' && c <= '9') 
                   || (c >= '０' && c <= '９')
                   || c == '一' || c == '二' || c == '三' || c == '四' || c == '五' 
                   || c == '六' || c == '七' || c == '八' || c == '九' || c == '十' 
                   || c == '百' || c == '千' || c == '万' || c == '億';
        }

        void AddSubjectToSourceVocabulary(int subjectId, string characters, Models.Subject? subject = null)
        {
            if (sentence.SourceVocabulary.All(s => s.SubjectId != subjectId))
            {
                sentence.SourceVocabulary.Add(new SubjectReference
                {
                    SubjectId = subjectId,
                    Characters = subject?.Characters ?? characters
                });
            }
        }
    }

    public async Task ExtractSentencesAsync()
    {
        using StreamReader file = File.OpenText("../context-sentences-processed.json");
        await using JsonTextReader reader = new JsonTextReader(file);
        var jArray = (JArray)await JToken.ReadFromAsync(reader);
        var sentences = jArray.ToObject<List<ReadingSentence>>() ?? [];
        var byLevel = sentences.GroupBy(s => s.Level);
        foreach (var levelGroup in byLevel)
        {
            foreach (var sentence in levelGroup)
            {
                ProcessMorphemesInSentence(sentence);
            }
            var path = Path.Combine($"context-sentences-{levelGroup.Key}.json");
            var json = JsonConvert.SerializeObject(levelGroup.ToList(), Formatting.Indented);
            await File.WriteAllTextAsync(path, json);
        }
    }

    public void ExtractSentences()
    {
        var raw = new List<(string Ja, string En, int Level, SubjectReference Source)>();
        var vocabulary = subjectCache.GetAllOfType(SubjectType.Vocabulary.ToSnakeCaseString())
            .Concat(subjectCache.GetAllOfType(SubjectType.KanaVocabulary.ToSnakeCaseString()));

        foreach (var resource in vocabulary)
        {
            var sentences = GetSentence((Models.Vocabulary)resource);
            raw.AddRange(sentences);
        }
        var grouped = raw.GroupBy(x => x.Ja).Select(g => new ReadingSentence
        {
            Ja = g.Key,
            En = g.First().En,
            Level = g.Min(x => x.Level),
            SourceVocabulary = g.Select(x => x.Source).DistinctBy(x => x.SubjectId).ToList(),
            KanjiInSentence = ExtractKanji(g.Key)
        }).ToList();

        var byLevel = grouped.GroupBy(s => s.Level);
        foreach (var levelGroup in byLevel)
        {
            var path = Path.Combine(configuration["StaticFiles:Path"]!,
                $"context-sentences-{levelGroup.Key}.json");
            var json = JsonConvert.SerializeObject(levelGroup.ToList(), Formatting.Indented);
            File.WriteAllText(path, json);
        }
    }

    private List<SubjectReference> ExtractKanji(string ja)
    {
        var result = new List<SubjectReference>();
        var seen = new HashSet<char>();
        foreach (var ch in ja)
        {
            if (ch < '\u4E00' || ch > '\u9FFF' || !seen.Add(ch)) continue;
            // Look up kanji subject by characters match
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
}
