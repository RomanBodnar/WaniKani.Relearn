using Newtonsoft.Json;
using WaniKani.Relearn.Contracts.Assignments;
using WaniKani.Relearn.Contracts.Resources;
using WaniKani.Relearn.Contracts.Subjects;
using WaniKani.Relearn.Subjects.Data.Models.Reading;

namespace WaniKani.Relearn.Subjects.Data;

public class SentenceExtractor(
    SubjectCache subjectCache,
    IConfiguration configuration)
{
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
                 vocab.WaniKaniLevel,
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
