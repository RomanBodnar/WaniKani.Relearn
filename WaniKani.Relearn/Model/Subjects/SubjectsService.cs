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

    // todo: integrate IDataAccess methods
    private async Task<IReadOnlyList<Subject>> GetAllSubjectsForType(SubjectType type)
    {
        // todo: check for files first
        var levels = Enumerable.Range(1, 61);
        var subjects = await GetSubjectsFromApi(type);
        var subjectsByLevel = subjects.GroupBy(s => s.Level).ToDictionary(g => g.Key, g => g.ToList());
        foreach(var item in subjectsByLevel)
        {
            await (type switch
            {
                SubjectType.Kanji => staticFileDataAccess.SaveKanjiForLevel(item.Key, item.Value.Select(x => (Kanji)x)),
                SubjectType.Radical => staticFileDataAccess.SaveRadicalsForLevel(item.Key, item.Value.Select(x => (Radical)x)),
                SubjectType.Vocabulary => staticFileDataAccess.SaveVocabularyForLevel(item.Key, item.Value.Select(x => (Vocabulary)x)),
                SubjectType.KanaVocabulary => staticFileDataAccess.SaveKanaVocabularyForLevel(item.Key, item.Value.Select(x => (KanaVocabulary)x)),
                _ => throw new ArgumentException($"Unsupported subject type: {type}")
            });
        }
        return subjects.ToList();
    }

    
    private async Task<IEnumerable<Subject>> GetSubjectsFromApi(SubjectType type, int? level = null)
    {
        var subjectsQuery = new SubjectsQuery
        {
            Types = [type.ToSnakeCaseString()],
            Levels = level is not null ? [level.Value] : null
        };

        //if(type is SubjectType.Kanji)
        //{
        //    return await GetTypedSubjects<Kanji>(subjectsQuery);
 
        //}
        var subjects = type switch
        {
            SubjectType.Kanji => await GetTypedSubjects<Kanji>(subjectsQuery),
            SubjectType.Radical => await GetTypedSubjects<Radical>(subjectsQuery),
            SubjectType.Vocabulary => await GetTypedSubjects<Vocabulary>(subjectsQuery),
            SubjectType.KanaVocabulary => (await GetTypedSubjects<KanaVocabulary>(subjectsQuery)) as IEnumerable<Subject>,
            _ => throw new ArgumentException($"Unsupported subject type: {type}")
        };
        return subjects?.ToList() ?? [];
    }

    private async Task<IEnumerable<T>> GetTypedSubjects<T>(SubjectsQuery subjectsQuery) where T : Subject
    {
        var collection = await subjectsApi.GetSubjects<T>(subjectsQuery);

        List<T> allSubjects = collection.Data.Select(s => s.Data).ToList();

        logger.LogInformation("Fetched {Count} subjects for type {Type}", allSubjects.Count, typeof(T));

        var nextUrl = collection.Pages.NextUrl;
        while (nextUrl is not null)
        {
            var subjectsJson = await wanikaniClient.GetByUrl(nextUrl);
            var nextCollection = JsonSerializer.Deserialize<CollectionResource<T>>(subjectsJson);

            logger.LogInformation("Fetched {Count} subjects for type {Type}", nextCollection.Data.Count, typeof(T));
            allSubjects.AddRange(nextCollection.Data.Select(s => s.Data) ?? []);
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
            await staticFileDataAccess.SaveKanjiForLevel(level, kanji.Select(x => (Kanji)x));
            return kanji;
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
            await staticFileDataAccess.SaveVocabularyForLevel(level, vocabulary.Select(x => (Vocabulary)x));
            return vocabulary;
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
            await staticFileDataAccess.SaveRadicalsForLevel(level, radicals.Select(x => (Radical)x));
            return radicals;
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
            await staticFileDataAccess.SaveKanaVocabularyForLevel(level, subjects.Select(x => (KanaVocabulary)x));
            return subjects;
        }
    }
}
