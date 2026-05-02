using System;
using Newtonsoft.Json;
using WaniKani.Relearn.Model.Assignments;
using WaniKani.Relearn.Model.Reading;

namespace WaniKani.Relearn.DataAccess;

public class SentenceExtractor(
    SubjectCache subjectCache,
    IConfiguration configuration)
{
    public void ExtractSentences()
    {
        var raw = new List<(string Ja, string En, int Level, SubjectReference Source)>();
        var vocabulary = subjectCache.GetAllOfType(SubjectType.Vocabulary.ToString())
            .Concat(subjectCache.GetAllOfType(SubjectType.KanaVocabulary.ToString()));

        foreach (var resource in vocabulary)
        {
            var sentences = resource.Object == SubjectType.Vocabulary.ToSnakeCaseString()
                ? GetSentence(resource.CopyAs<Vocabulary>())
                : GetSentence(resource.CopyAs<KanaVocabulary>());
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
            var kanjiSubject = subjectCache.FindByCharacters(ch.ToString(), "Kanji");
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

    private List<(string Ja, string En, int Level, SubjectReference Source)> GetSentence(SingleResource<Vocabulary> vocab)
    {
        var result = new List<(string Ja, string En, int Level, SubjectReference Source)>();
        if (vocab.Data.ContextSentences == null)
        {
            return [];
        }
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

    private List<(string Ja, string En, int Level, SubjectReference Source)> GetSentence(SingleResource<KanaVocabulary> vocab)
    {
        var result = new List<(string Ja, string En, int Level, SubjectReference Source)>();
        if (vocab.Data.ContextSentences == null)
        {
            return [];
        }
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
