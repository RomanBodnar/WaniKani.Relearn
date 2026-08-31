using System.Collections.Concurrent;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using WaniKani.Relearn.Data;
using WaniKani.Relearn.Data.Entities;
using WaniKani.Relearn.Subjects.Data.Models.Reading;
using System.Threading;
using System.Threading.Tasks;
using System.IO;

namespace WaniKani.Relearn.Subjects.Data;

public class SentenceCache(SubjectCache subjectCache, SentenceExtractor sentenceExtractor)
{
    private readonly ConcurrentDictionary<long, ReadingSentence> _sentences = new();

    public int Count => _sentences.Count;

    public void LoadFromDb(BonpomDbContext dbContext)
    {
        _sentences.Clear();

        var entities = dbContext.ContextSentences
            .AsNoTracking()
            .ToList();

        foreach (var entity in entities)
        {
            var sentence = MapEntityToReadingSentence(entity);
            if (sentence.Morphemes.Count > 0)
            {
                sentenceExtractor.ProcessMorphemesInSentence(sentence);
            }
            _sentences[sentence.Id] = sentence;
        }
    }

    public ReadingSentence MapEntityToReadingSentence(ContextSentenceEntity entity)
    {
        ReadingSentence? parsed = null;
        if (!string.IsNullOrWhiteSpace(entity.DataJson))
        {
            try
            {
                parsed = JsonConvert.DeserializeObject<ReadingSentence>(entity.DataJson);
            }
            catch
            {
                // Fallback if deserialization fails
            }
        }

        var sourceVocab = (parsed?.SourceVocabulary ?? [])
            .Select(sv => new SubjectReference
            {
                SubjectId = sv.SubjectId,
                Characters = !string.IsNullOrEmpty(sv.Characters)
                    ? sv.Characters
                    : (subjectCache.TryGet(sv.SubjectId, out var sub) ? (sub.Characters ?? string.Empty) : string.Empty)
            })
            .DistinctBy(sv => sv.SubjectId)
            .ToList();

        var kanjiInSentence = (parsed?.KanjiInSentence ?? [])
            .Select(kj => new SubjectReference
            {
                SubjectId = kj.SubjectId,
                Characters = !string.IsNullOrEmpty(kj.Characters)
                    ? kj.Characters
                    : (subjectCache.TryGet(kj.SubjectId, out var sub) ? (sub.Characters ?? string.Empty) : string.Empty)
            })
            .DistinctBy(kj => kj.SubjectId)
            .ToList();

        return new ReadingSentence
        {
            Id = entity.Id,
            Ja = entity.Ja,
            En = entity.En,
            Level = entity.Level,
            SourceVocabulary = sourceVocab,
            KanjiInSentence = kanjiInSentence,
            Morphemes = parsed?.Morphemes ?? []
        };
    }

    public void AddOrUpdateSentence(ReadingSentence sentence)
    {
        _sentences[sentence.Id] = sentence;
    }

    //public void HideSentence(long sentenceId)
    //{
    //    if (_sentences.TryGetValue(sentenceId, out var existing))
    //    {
    //        _sentences[sentenceId] = existing with { IsHidden = true };
    //    }
    //}

    //public void UnhideSentence(long sentenceId)
    //{
    //    if (_sentences.TryGetValue(sentenceId, out var existing))
    //    {
    //        _sentences[sentenceId] = existing with { IsHidden = false };
    //    }
    //}

    public void RemoveSentence(long sentenceId)
    {
        _sentences.TryRemove(sentenceId, out _);
    }

    public bool TryGet(long sentenceId, out ReadingSentence? sentence)
    {
        return _sentences.TryGetValue(sentenceId, out sentence);
    }

    public PageResult<ReadingSentence> GetSentences(
        int? page,
        int? perPage,
        int? minLevel = null,
        int? maxLevel = null,
        string status = "all",
        ISet<long>? practicedSentenceIds = null)
    {
        IEnumerable<ReadingSentence> query = _sentences.Values;

        if (minLevel.HasValue) query = query.Where(s => s.Level >= minLevel.Value);
        if (maxLevel.HasValue) query = query.Where(s => s.Level <= maxLevel.Value);

        var practicedSet = practicedSentenceIds ?? new HashSet<long>();

        if (string.Equals(status, "unpracticed", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(s => !practicedSet.Contains(s.Id));
        }
        else if (string.Equals(status, "practiced", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(s => practicedSet.Contains(s.Id));
        }

        query = query.OrderBy(s => s.Level).ThenBy(s => s.Id);

        var count = query.Count();
        var data = query
            .Skip(((page ?? 1) - 1) * (perPage ?? 10))
            .Take(perPage ?? 10)
            .Select(s => s with { IsPracticed = practicedSet.Contains(s.Id) })
            .ToList();

        return new PageResult<ReadingSentence>(data, page ?? 1, perPage ?? 10, count);
    }
}
