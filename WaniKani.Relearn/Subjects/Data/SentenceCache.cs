using System.Collections.Concurrent;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using WaniKani.Relearn.Data;
using WaniKani.Relearn.Data.Entities;
using WaniKani.Relearn.Subjects.Data.Models.Reading;

namespace WaniKani.Relearn.Subjects.Data;

public class SentenceCache(SubjectCache subjectCache, SentenceExtractor sentenceExtractor)
{
    private readonly ConcurrentDictionary<long, ReadingSentenceSummary> _sentences = new();

    public int Count => _sentences.Count;

    public void LoadFromDb(BonpomDbContext dbContext)
    {
        _sentences.Clear();

        // Load in batches to reduce peak memory — entity + DataJson memory is released between batches
        const int batchSize = 2000;
        long lastId = 0;

        while (true)
        {
            var batch = dbContext.ContextSentences
                .AsNoTracking()
                .Where(cs => cs.Id > lastId)
                .OrderBy(cs => cs.Id)
                .Take(batchSize)
                .Select(cs => new
                {
                    cs.Id,
                    cs.Ja,
                    cs.En,
                    cs.Level,
                    cs.DataJson
                })
                .ToList();

            if (batch.Count == 0) break;

            foreach (var entity in batch)
            {
                var summary = MapEntityToSummary(entity.Id, entity.Ja, entity.En, entity.Level, entity.DataJson);
                _sentences[summary.Id] = summary;
            }

            lastId = batch[^1].Id;
        }
    }

    /// <summary>
    /// Extracts only SourceVocabulary and KanjiInSentence from DataJson, skipping morpheme deserialization.
    /// This is the key memory optimization — morphemes (~70-80% of per-sentence memory) are not cached.
    /// </summary>
    private ReadingSentenceSummary MapEntityToSummary(long id, string ja, string en, int level, string? dataJson)
    {
        List<SubjectReference> sourceVocab = [];
        List<SubjectReference> kanjiInSentence = [];

        if (!string.IsNullOrWhiteSpace(dataJson))
        {
            try
            {
                var parsed = JsonConvert.DeserializeObject<ReadingSentence>(dataJson);
                if (parsed != null)
                {
                    sourceVocab = (parsed.SourceVocabulary ?? [])
                        .Select(sv => new SubjectReference
                        {
                            SubjectId = sv.SubjectId,
                            Characters = !string.IsNullOrEmpty(sv.Characters)
                                ? sv.Characters
                                : (subjectCache.TryGet(sv.SubjectId, out var sub) ? (sub.Characters ?? string.Empty) : string.Empty)
                        })
                        .DistinctBy(sv => sv.SubjectId)
                        .ToList();

                    kanjiInSentence = (parsed.KanjiInSentence ?? [])
                        .Select(kj => new SubjectReference
                        {
                            SubjectId = kj.SubjectId,
                            Characters = !string.IsNullOrEmpty(kj.Characters)
                                ? kj.Characters
                                : (subjectCache.TryGet(kj.SubjectId, out var sub) ? (sub.Characters ?? string.Empty) : string.Empty)
                        })
                        .DistinctBy(kj => kj.SubjectId)
                        .ToList();
                }
            }
            catch
            {
                // Fallback if deserialization fails
            }
        }

        return new ReadingSentenceSummary
        {
            Id = id,
            Ja = ja,
            En = en,
            Level = level,
            SourceVocabulary = sourceVocab,
            KanjiInSentence = kanjiInSentence
        };
    }

    public void AddOrUpdateSentence(ReadingSentence sentence)
    {
        _sentences[sentence.Id] = new ReadingSentenceSummary
        {
            Id = sentence.Id,
            Ja = sentence.Ja,
            En = sentence.En,
            Level = sentence.Level,
            SourceVocabulary = sentence.SourceVocabulary,
            KanjiInSentence = sentence.KanjiInSentence,
            IsPracticed = sentence.IsPracticed
        };
    }

    public void RemoveSentence(long sentenceId)
    {
        _sentences.TryRemove(sentenceId, out _);
    }

    public bool TryGet(long sentenceId, out ReadingSentenceSummary? sentence)
    {
        return _sentences.TryGetValue(sentenceId, out sentence);
    }

    public PageResult<ReadingSentenceSummary> GetSentences(
        int? page,
        int? perPage,
        int? minLevel = null,
        int? maxLevel = null,
        string status = "all",
        ISet<long>? practicedSentenceIds = null)
    {
        IEnumerable<ReadingSentenceSummary> query = _sentences.Values;

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

        return new PageResult<ReadingSentenceSummary>(data, page ?? 1, perPage ?? 10, count);
    }

    /// <summary>
    /// Enriches a list of sentence summaries with morphemes loaded from the database on-demand.
    /// Only loads morphemes for the given sentence IDs (typically one page worth = ~10 sentences).
    /// </summary>
    public async Task<List<ReadingSentence>> EnrichWithMorphemesAsync(
        List<ReadingSentenceSummary> summaries,
        BonpomDbContext dbContext)
    {
        if (summaries.Count == 0) return [];

        var ids = summaries.Select(s => s.Id).ToHashSet();

        var morphemeData = await dbContext.ContextSentences
            .AsNoTracking()
            .Where(cs => ids.Contains(cs.Id))
            .Select(cs => new { cs.Id, cs.DataJson })
            .ToListAsync();

        var morphemesByIdDict = new Dictionary<long, List<Morpheme>>();
        foreach (var row in morphemeData)
        {
            List<Morpheme> morphemes = [];
            if (!string.IsNullOrWhiteSpace(row.DataJson))
            {
                try
                {
                    var parsed = JsonConvert.DeserializeObject<ReadingSentence>(row.DataJson);
                    if (parsed?.Morphemes is { Count: > 0 })
                    {
                        morphemes = parsed.Morphemes;

                        // Find the matching summary to get SourceVocabulary for ProcessMorphemesInSentence
                        var summary = summaries.FirstOrDefault(s => s.Id == row.Id);
                        var tempSentence = new ReadingSentence
                        {
                            Id = row.Id,
                            Ja = summary?.Ja ?? "",
                            En = summary?.En ?? "",
                            SourceVocabulary = summary?.SourceVocabulary?.ToList() ?? [],
                            KanjiInSentence = summary?.KanjiInSentence?.ToList() ?? [],
                            Morphemes = morphemes
                        };
                        sentenceExtractor.ProcessMorphemesInSentence(tempSentence);
                    }
                }
                catch
                {
                    // Fallback
                }
            }
            morphemesByIdDict[row.Id] = morphemes;
        }

        return summaries.Select(s => new ReadingSentence
        {
            Id = s.Id,
            Ja = s.Ja,
            En = s.En,
            Level = s.Level,
            SourceVocabulary = s.SourceVocabulary,
            KanjiInSentence = s.KanjiInSentence,
            Morphemes = morphemesByIdDict.GetValueOrDefault(s.Id, []),
            IsPracticed = s.IsPracticed
        }).ToList();
    }
}

