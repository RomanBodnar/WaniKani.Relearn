using System;
using WaniKani.Relearn.DataAccess;
using WaniKani.Relearn.Model.Assignments;

namespace WaniKani.Relearn.Model.Subjects;

public class SubjectsService(
    ISubjectsApi subjectsApi,
    StaticFileDataAccess staticFileDataAccess,
    IWaniKaniClient wanikaniClient,
    ILogger<SubjectsService> logger
)
{
    public async Task<IReadOnlyList<Subject>> GetSubjects(SubjectType type, int? level)
    {
        var subjects = type switch
        {
            SubjectType.Kanji => level is null ? await GetAllSubjectsForType(type) : await GetKanji(level.Value),
            SubjectType.Radical => level is null ? await GetAllSubjectsForType(type) : await GetRadicals(level.Value),
            SubjectType.Vocabulary => level is null ? await GetAllSubjectsForType(type) : await GetVocabulary(level.Value),
            SubjectType.KanaVocabulary => level is null ? await GetAllSubjectsForType(type) : await GetKanaVocabulary(level.Value),
            _ => throw new ArgumentException($"Unsupported subject type: {type}")
        };

        return subjects?.ToList() ?? new List<Subject>();
    }

    private async Task<IReadOnlyList<Subject>> GetAllSubjectsForType(SubjectType type)
    {
        // todo: check for files first
        var levels = Enumerable.Range(1, 61);
        var subjects = await GetSubjectsFromApi(type);
        var subjectsByLevel = subjects.GroupBy(s => s.Data.Level).ToDictionary(g => g.Key, g => g.ToList());
        foreach(var item in subjectsByLevel)
        {
            await (type switch
            {
                SubjectType.Kanji => staticFileDataAccess.SaveKanjiForLevel(item.Key, item.Value.Select(x => x)),
                SubjectType.Radical => staticFileDataAccess.SaveRadicalsForLevel(item.Key, item.Value.Select(x => x)),
                SubjectType.Vocabulary => staticFileDataAccess.SaveVocabularyForLevel(item.Key, item.Value.Select(x => x)),
                SubjectType.KanaVocabulary => staticFileDataAccess.SaveKanaVocabularyForLevel(item.Key, item.Value.Select(x => x)),
                _ => throw new ArgumentException($"Unsupported subject type: {type}")
            });
        }
        return subjects.Select(x => x.Data).ToList();
    }
    
    private async Task<IEnumerable<SingleResource<Subject>>> GetSubjectsFromApi(SubjectType type, int? level = null)
    {
        var subjectsQuery = new SubjectsQuery
        {
            Types = [type.ToSnakeCaseString()],
            Levels = level is not null ? [level.Value] : null
        };

        IEnumerable<SingleResource<Subject>> subjects = type switch
        {
            SubjectType.Kanji => (await GetTypedSubjects<Kanji>(subjectsQuery)).Select(x => new SingleResource<Subject>
            {
                Id = x.Id,
                Object = x.Object,
                Url = x.Url,
                DataUpdatedAt = x.DataUpdatedAt,
                Data = x.Data
            }),
            SubjectType.Radical => (await GetTypedSubjects<Radical>(subjectsQuery)).Select(x => new SingleResource<Subject>
            {
                Id = x.Id,
                Object = x.Object,
                Url = x.Url,
                DataUpdatedAt = x.DataUpdatedAt,
                Data = x.Data
            }),
            SubjectType.Vocabulary => (await GetTypedSubjects<Vocabulary>(subjectsQuery)).Select(x => new SingleResource<Subject>
            {
                Id = x.Id,
                Object = x.Object,
                Url = x.Url,
                DataUpdatedAt = x.DataUpdatedAt,
                Data = x.Data
            }),
            SubjectType.KanaVocabulary => (await GetTypedSubjects<KanaVocabulary>(subjectsQuery)).Select(x => new SingleResource<Subject>
            {
                Id = x.Id,
                Object = x.Object,
                Url = x.Url,
                DataUpdatedAt = x.DataUpdatedAt,
                Data = x.Data
            }),
            _ => throw new ArgumentException($"Unsupported subject type: {type}")
        };
        return subjects?.ToList() ?? [];
    }

    private async Task<IEnumerable<SingleResource<T>>> GetTypedSubjects<T>(SubjectsQuery subjectsQuery) where T : Subject
    {
        var collection = await subjectsApi.GetSubjects<T>(subjectsQuery);

        List<SingleResource<T>> allSubjects = collection.Data.ToList();

        logger.LogInformation("Fetched {Count} subjects for type {Type}", allSubjects.Count, typeof(T));

        var nextUrl = collection.Pages.NextUrl;
        while (nextUrl is not null)
        {
            var subjectsJson = await wanikaniClient.GetByUrl(nextUrl);
            var nextCollection = JsonSerializer.Deserialize<CollectionResource<T>>(subjectsJson);

            logger.LogInformation("Fetched {Count} subjects for type {Type}", nextCollection.Data.Count, typeof(T));
            allSubjects.AddRange(nextCollection.Data ?? []);
            nextUrl = nextCollection?.Pages.NextUrl;
        }

        return allSubjects;
    }

    private async Task<IEnumerable<Subject>> GetKanji(int level)
    {
        try
        {
            var kanjiJson = await staticFileDataAccess.GetKanjiForLevel(level);
            var kanji = JsonSerializer.Deserialize<List<Kanji>>(kanjiJson);
            return kanji ?? [];
        }
        catch (FileNotFoundException)
        {
            var kanji = await GetSubjectsFromApi(SubjectType.Kanji, level);
            await staticFileDataAccess.SaveKanjiForLevel(level, kanji.Select(x => x));
            return kanji.Select(x => x.Data);
        }
    }

    private async Task<IEnumerable<Subject>> GetVocabulary(int level)
    {
        try
        {
            var vocabularyJson = await staticFileDataAccess.GetVocabularyForLevel(level);
            var vocabulary = JsonSerializer.Deserialize<List<Subject>>(vocabularyJson);
            return vocabulary ?? [];
        }
        catch (FileNotFoundException)
        {
            var vocabulary = await GetSubjectsFromApi(SubjectType.Vocabulary, level);
            await staticFileDataAccess.SaveVocabularyForLevel(level, vocabulary.Select(x => x));
            return vocabulary.Select(x => x.Data);
        }
    }

    private async Task<IEnumerable<Subject>> GetRadicals(int level)
    {
        try
        {
            var radicalsJson = await staticFileDataAccess.GetRadicalsForLevel(level);
            var radicals = JsonSerializer.Deserialize<List<Subject>>(radicalsJson);
            return radicals ?? [];
        }
        catch (FileNotFoundException)
        {
            var radicals = await GetSubjectsFromApi(SubjectType.Radical, level);
            await staticFileDataAccess.SaveRadicalsForLevel(level, radicals.Select(x => x));
            return radicals.Select(x => x.Data);
        }
    }

    private async Task<IEnumerable<Subject>> GetKanaVocabulary(int level)
    {
        try
        {
            var kanaVocabularyJson = await staticFileDataAccess.GetKanaVocabularyForLevel(level);
            var kanaVocabulary = JsonSerializer.Deserialize<List<KanaVocabulary>>(kanaVocabularyJson);
            return kanaVocabulary ?? [];
        }
        catch (FileNotFoundException)
        {
            var subjects = await GetSubjectsFromApi(SubjectType.KanaVocabulary, level);
            await staticFileDataAccess.SaveKanaVocabularyForLevel(level, subjects.Select(x => x));
            return subjects.Select(x => x.Data);
        }
    }
}
