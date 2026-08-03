using Microsoft.EntityFrameworkCore;
using WaniKani.Relearn.Contracts.Resources;
using WaniKani.Relearn.Contracts.Subjects;
using WaniKani.Relearn.Data;
using WaniKani.Relearn.Data.Entities;
using WaniKani.Relearn.Subjects.Data.Mappers;

namespace WaniKani.Relearn.Subjects.Data;

public class SubjectDataAccess(BonpomDbContext dbContext) : IDataAccess
{
    private IQueryable<SubjectEntity> KanjiQuery()
    {
        return dbContext.Subjects
            .AsNoTracking()
            .AsSplitQuery()
            .Include(s => s.Meanings)
            .Include(s => s.AuxiliaryMeanings)
            .Include(s => s.KanjiDetails)
            .Include(s => s.KanjiReadings)
            .Include(s => s.ParentRelationships);
    }

    private IQueryable<SubjectEntity> RadicalQuery()
    {
        return dbContext.Subjects
            .AsNoTracking()
            .AsSplitQuery()
            .Include(s => s.Meanings)
            .Include(s => s.AuxiliaryMeanings)
            .Include(s => s.RadicalCharacterImages)
            .Include(s => s.ParentRelationships);
    }

    private IQueryable<SubjectEntity> VocabularyQuery()
    {
        return dbContext.Subjects
            .AsNoTracking()
            .AsSplitQuery()
            .Include(s => s.Meanings)
            .Include(s => s.AuxiliaryMeanings)
            .Include(s => s.VocabularyDetails)
            .Include(s => s.VocabularyReadings)
            .Include(s => s.PartsOfSpeech)
            .Include(s => s.PronunciationAudios)
            .Include(s => s.ContextSentences)
            .Include(s => s.ParentRelationships);
    }

    public async Task<List<SingleResource<T>>> GetAllSubjects<T>(params int[] levels) where T : Subject
    {
        if (typeof(T) == typeof(Kanji))
        {
            var query = KanjiQuery().Where(s => s.ObjectType == "kanji");
            if (levels is { Length: > 0 }) query = query.Where(s => levels.Contains(s.Level));
            var entities = await query.ToListAsync();
            return entities.Select(SubjectEntityMapper.ToSingleResource<T>).ToList();
        }
        if (typeof(T) == typeof(Radical))
        {
            var query = RadicalQuery().Where(s => s.ObjectType == "radical");
            if (levels is { Length: > 0 }) query = query.Where(s => levels.Contains(s.Level));
            var entities = await query.ToListAsync();
            return entities.Select(SubjectEntityMapper.ToSingleResource<T>).ToList();
        }
        if (typeof(T) == typeof(Vocabulary))
        {
            var query = VocabularyQuery().Where(s => s.ObjectType == "vocabulary");
            if (levels is { Length: > 0 }) query = query.Where(s => levels.Contains(s.Level));
            var entities = await query.ToListAsync();
            return entities.Select(SubjectEntityMapper.ToSingleResource<T>).ToList();
        }
        if (typeof(T) == typeof(KanaVocabulary))
        {
            var query = VocabularyQuery().Where(s => s.ObjectType == "kana_vocabulary");
            if (levels is { Length: > 0 }) query = query.Where(s => levels.Contains(s.Level));
            var entities = await query.ToListAsync();
            return entities.Select(SubjectEntityMapper.ToSingleResource<T>).ToList();
        }

        throw new ArgumentException($"Unsupported subject type: {typeof(T)}");
    }

    public async Task<List<Models.Kanji>> GetKanji()
    {
        var entities = await KanjiQuery()
            .Where(s => s.ObjectType == "kanji")
            .ToListAsync();

        return entities.Select(SubjectEntityMapper.ToKanjiModel).ToList();
    }

    public async Task<List<Models.Radical>> GetRadicals()
    {
        var entities = await RadicalQuery()
            .Where(s => s.ObjectType == "radical")
            .ToListAsync();

        return entities.Select(SubjectEntityMapper.ToRadicalModel).ToList();
    }

    public async Task<List<Models.Vocabulary>> GetVocabulary()
    {
        var entities = await VocabularyQuery()
            .Where(s => s.ObjectType == "vocabulary" || s.ObjectType == "kana_vocabulary")
            .ToListAsync();

        return entities.Select(SubjectEntityMapper.ToVocabularyModel).ToList();
    }

    public async Task SaveSubjectsForLevel<T>(int level, IEnumerable<SingleResource<T>> subjects) where T : Subject
    {
        foreach (var resource in subjects)
        {
            var entity = SubjectEntityMapper.ToEntity(resource);
            var existing = await dbContext.Subjects.FindAsync(entity.Id);
            if (existing != null)
            {
                dbContext.Entry(existing).CurrentValues.SetValues(entity);
            }
            else
            {
                dbContext.Subjects.Add(entity);
            }
        }

        await dbContext.SaveChangesAsync();
    }

    public async Task SaveSubjects<T>(IEnumerable<T> subjects) where T : Models.Subject
    {
        foreach (var model in subjects)
        {
            var entity = SubjectEntityMapper.ToEntity(model);
            var existing = await dbContext.Subjects.FindAsync(entity.Id);
            if (existing != null)
            {
                dbContext.Entry(existing).CurrentValues.SetValues(entity);
            }
            else
            {
                dbContext.Subjects.Add(entity);
            }
        }

        await dbContext.SaveChangesAsync();
    }
}
