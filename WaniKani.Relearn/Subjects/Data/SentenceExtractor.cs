using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using WaniKani.Relearn.Contracts.Assignments;
using WaniKani.Relearn.Contracts.Resources;
using WaniKani.Relearn.Contracts.Subjects;
using WaniKani.Relearn.Subjects.Data.Models.Reading;

namespace WaniKani.Relearn.Subjects.Data;

public class SentenceExtractor(
    SubjectCache subjectCache,
    IConfiguration configuration)
{
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
                // todo: handle 助数詞可能(counter) where a lemma is not in katakana an there is numeral in front, and other non-translated POS
                var morphemes = sentence.Morphemes;

                int i = 0;
                while(i < morphemes.Count)
                {
                    var morpheme = morphemes[i];
                    // handle masu verbs
                    if(morpheme.LemmaReading == "スル" && i > 0)
                    {
                        // Handle suru verb in katakana by looking at previous morpheme
                        // todo: handle suru verbs that are not in the dictionary
                        var prevMorpheme = morphemes[i - 1];
                        var combinedCharacters = prevMorpheme.Lemma + "する";
                        morpheme.CombinedForm = combinedCharacters;

                        var suruVerbSubjectId = subjectCache.GetIdByCharacters(combinedCharacters);
                        if (suruVerbSubjectId != 0 && sentence.SourceVocabulary.All(s => s.SubjectId != suruVerbSubjectId))
                        {
                            morpheme.SubjectId = suruVerbSubjectId;
                            subjectCache.TryGet(suruVerbSubjectId, out var subject);
                            sentence.SourceVocabulary.Add(new SubjectReference
                            {
                                SubjectId = suruVerbSubjectId,
                                Characters = combinedCharacters
                            });
                            // Remove the previous morpheme since it's now part of the combined verb
                            // morphemes.RemoveAt(i - 1);
                            // i--; // Move back index to account for removed morpheme
                        }
                        i++;
                        continue; // Skip further processing for this morpheme since it's already matched as suru verb
                    }
                    if(morpheme.Pos1.En == "suffix")
                    {
                        // todo: handle special case suffixes like ちゃん, くん, etc by looking at previous morpheme
                        // todo: handle subjects with suffix not in dictionaries
                        // Handle suffixes by looking at previous morpheme
                        if (i > 0)
                        {
                            var prevMorpheme = morphemes[i - 1];
                            if (prevMorpheme.Pos1.En == "particle")
                            {
                                continue;
                            }
                            var combinedCharacters = prevMorpheme.Lemma + morpheme.Lemma;

                            morpheme.CombinedForm = combinedCharacters;

                            var nounWithSuffixSubjectId = subjectCache.GetIdByCharacters(combinedCharacters);
                            if (nounWithSuffixSubjectId != 0 && sentence.SourceVocabulary.All(s => s.SubjectId != nounWithSuffixSubjectId))
                            {
                                morpheme.SubjectId = nounWithSuffixSubjectId;
                                subjectCache.TryGet(nounWithSuffixSubjectId, out var subject);
                                sentence.SourceVocabulary.Add(new SubjectReference
                                {
                                    SubjectId = nounWithSuffixSubjectId,
                                    Characters = combinedCharacters
                                });
                                // Remove the previous morpheme since it's now part of the combined particle
                                // morphemes.RemoveAt(i - 1);
                                // i--; // Move back index to account for removed morpheme
                            }
                        }
                        i++;
                        continue; // Skip further processing for this morpheme since it's already matched as noun with suffix
                    }
                    
                    var subjectId = subjectCache.GetIdByCharacters(morpheme.Lemma);
                    if(subjectId == 0)
                    {
                        // Try orth as fallback
                        subjectId = subjectCache.GetIdByCharacters(morpheme.Orth);
                    }
                    
                    if (subjectId != 0 && sentence.SourceVocabulary.All(s => s.SubjectId != subjectId))
                    {
                        morpheme.SubjectId = subjectId;
                        subjectCache.TryGet(subjectId, out var subject);
                        sentence.SourceVocabulary.Add(new SubjectReference
                        {
                            SubjectId = subjectId,
                            Characters = subject?.Characters ?? morpheme.Lemma 
                        });
                    }

                    i++;
                }
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
