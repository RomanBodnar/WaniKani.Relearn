using System.Collections.Concurrent;
using Microsoft.EntityFrameworkCore;
using WaniKani.Relearn.Data;
using WaniKani.Relearn.Data.Entities;
using WaniKani.Relearn.Subjects.Data.Models.Reading;
using System.Threading;
using System.Threading.Tasks;
using System.IO;

namespace WaniKani.Relearn.Subjects.Data;

public class SentenceCache(SubjectCache subjectCache)
{
    private readonly ConcurrentDictionary<long, ReadingSentence> _sentences = new();

    public int Count => _sentences.Count;

    public void LoadFromDb(BonpomDbContext dbContext)
    {
        _sentences.Clear();

        var entities = dbContext.ContextSentences
            .AsNoTracking()
            .AsSplitQuery()
            .Include(cs => cs.SubjectReferences)
                .ThenInclude(sr => sr.Subject)
            .Include(cs => cs.Morphemes)
            .ToList();

        foreach (var entity in entities)
        {
            var sentence = MapEntityToReadingSentence(entity);
            _sentences[sentence.Id] = sentence;
        }
    }

    public ReadingSentence MapEntityToReadingSentence(ContextSentenceEntity entity)
    {
        var sourceVocab = entity.SubjectReferences
            .Where(r => r.ReferenceType == "source_vocabulary")
            .Select(r => new SubjectReference
            {
                SubjectId = r.SubjectId,
                Characters = !string.IsNullOrEmpty(r.Subject?.Characters)
                    ? r.Subject.Characters
                    : (subjectCache.TryGet(r.SubjectId, out var sub) ? (sub.Characters ?? string.Empty) : string.Empty)
            })
            .DistinctBy(r => r.SubjectId)
            .ToList();

        var kanjiInSentence = entity.SubjectReferences
            .Where(r => r.ReferenceType == "kanji_in_sentence")
            .Select(r => new SubjectReference
            {
                SubjectId = r.SubjectId,
                Characters = !string.IsNullOrEmpty(r.Subject?.Characters)
                    ? r.Subject.Characters
                    : (subjectCache.TryGet(r.SubjectId, out var sub) ? (sub.Characters ?? string.Empty) : string.Empty)
            })
            .DistinctBy(r => r.SubjectId)
            .ToList();

        var morphemes = entity.Morphemes
            .OrderBy(m => m.SequenceOrder)
            .Select(m => new Morpheme
            {
                SubjectId = m.SubjectId,
                Surface = m.Surface,
                Lemma = m.Lemma ?? string.Empty,
                LemmaReading = m.LemmaReading ?? string.Empty,
                Orth = m.Orth ?? string.Empty,
                Pron = m.Pron ?? string.Empty,
                ConjugationType = m.ConjugationType ?? string.Empty,
                ConjugationForm = m.ConjugationForm ?? string.Empty,
                Pos1 = new PosPart { Ja = m.Pos1Ja ?? string.Empty, En = m.Pos1En ?? string.Empty },
                Pos2 = new PosPart { Ja = m.Pos2Ja ?? string.Empty, En = m.Pos2En ?? string.Empty },
                Pos3 = new PosPart { Ja = m.Pos3Ja ?? string.Empty, En = m.Pos3En ?? string.Empty },
                Pos4 = new PosPart { Ja = m.Pos4Ja ?? string.Empty, En = m.Pos4En ?? string.Empty },
            })
            .ToList();

        return new ReadingSentence
        {
            Id = entity.Id,
            Ja = entity.Ja,
            En = entity.En,
            Level = entity.Level,
            SourceVocabulary = sourceVocab,
            KanjiInSentence = kanjiInSentence,
            Morphemes = morphemes,
            IsHidden = entity.HiddenAt.HasValue
        };
    }

    public void AddOrUpdateSentence(ReadingSentence sentence)
    {
        _sentences[sentence.Id] = sentence;
    }

    public void HideSentence(long sentenceId)
    {
        if (_sentences.TryGetValue(sentenceId, out var existing))
        {
            _sentences[sentenceId] = existing with { IsHidden = true };
        }
    }

    public void UnhideSentence(long sentenceId)
    {
        if (_sentences.TryGetValue(sentenceId, out var existing))
        {
            _sentences[sentenceId] = existing with { IsHidden = false };
        }
    }

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
        var query = _sentences.Values.Where(s => !s.IsHidden);

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
