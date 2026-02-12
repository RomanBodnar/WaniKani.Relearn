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
        if(level is null)
        {
            var allSubjectsForType = await GetAllSubjectsForType(type);
            return allSubjectsForType;
        }
        var subjects = type switch
        {
            SubjectType.Radical => await GetRadicals(level.Value),
            SubjectType.Kanji => await GetKanji(level.Value),
            SubjectType.Vocabulary => await GetVocabulary(level.Value),
            SubjectType.KanaVocabulary => await GetKanaVocabulary(level.Value),
            _ => throw new ArgumentException($"Unsupported subject type: {type}")
        };

        return subjects ?? new List<Subject>();
    }

    private async Task<IReadOnlyList<Subject>> GetAllSubjectsForType(SubjectType type)
    {
        // todo: check for files first
        var levels = Enumerable.Range(1, 61);
        var subjects = await GetSubjectsFromApi(type);
        var subjectsByLevel = subjects.GroupBy(s => s.Level).ToDictionary(g => g.Key, g => g.ToList());
        foreach(var item in subjectsByLevel)
        {
            string json = System.Text.Json.JsonSerializer.Serialize(item.Value);
            await (type switch
            {
                SubjectType.Radical => staticFileDataAccess.SaveRadicalsForLevel(item.Key, json),
                SubjectType.Kanji => staticFileDataAccess.SaveKanjiForLevel(item.Key, json),
                SubjectType.Vocabulary => staticFileDataAccess.SaveVocabularyForLevel(item.Key, json),
                SubjectType.KanaVocabulary => staticFileDataAccess.SaveKanaVocabularyForLevel(item.Key, json),
                _ => throw new ArgumentException($"Unsupported subject type: {type}")
            });
        }
        return subjects;
    }

    
    private async Task<IReadOnlyList<Subject>> GetSubjectsFromApi(SubjectType type, int? level = null)
    {
        var subjectsQuery = new SubjectsQuery
        {
            Types = [type.ToSnakeCaseString()],
            Levels = level is not null ? [level.Value] : null
        };

        var subjects = await subjectsApi.GetSubjects(subjectsQuery);
        List<Subject> allSubjects = subjects.Data.Select(s => s.Data).ToList();

        logger.LogInformation("Fetched {Count} subjects for type {Type}", allSubjects.Count, type);

        var nextUrl = subjects.Pages.NextUrl;
        while(nextUrl is not null)
        {
            var subjectsJson = await wanikaniClient.GetByUrl(nextUrl);
            var nextSubjects = System.Text.Json.JsonSerializer.Deserialize<CollectionResource<Subject>>(subjectsJson);
            logger.LogInformation("Fetched {Count} subjects for type {Type}", nextSubjects.Data.Count, type);
            allSubjects.AddRange(nextSubjects?.Data.Select(s => s.Data) ?? []);
            nextUrl = nextSubjects?.Pages.NextUrl;
        }
        return allSubjects;
    }

    private async Task<IReadOnlyList<Subject>> GetKanji(int level)
    {
        try
        {
            var kanjiJson = await staticFileDataAccess.GetKanjiForLevel(level);
            var kanji = System.Text.Json.JsonSerializer.Deserialize<List<Subject>>(kanjiJson);
            return kanji ?? [];
        }
        catch (FileNotFoundException)
        {
            var kanji = await GetSubjectsFromApi(SubjectType.Kanji, level);
            string json = System.Text.Json.JsonSerializer.Serialize(kanji);
            await staticFileDataAccess.SaveKanjiForLevel(level, json);
            return kanji;
        }
    }

    private async Task<IReadOnlyList<Subject>> GetVocabulary(int level)
    {
        try
        {
            var vocabularyJson = await staticFileDataAccess.GetVocabularyForLevel(level);
            var vocabulary = System.Text.Json.JsonSerializer.Deserialize<List<Subject>>(vocabularyJson);
            return vocabulary ?? [];
        }
        catch (FileNotFoundException)
        {
            var vocabulary = await GetSubjectsFromApi(SubjectType.Vocabulary, level);
            string json = System.Text.Json.JsonSerializer.Serialize(vocabulary);
            await staticFileDataAccess.SaveVocabularyForLevel(level, json);
            return vocabulary;
        }
    }
    private async Task<IReadOnlyList<Subject>> GetRadicals(int level)
    {
        try
        {
            var radicalsJson = await staticFileDataAccess.GetRadicalsForLevel(level);
            var radicals = System.Text.Json.JsonSerializer.Deserialize<List<Subject>>(radicalsJson);
            return radicals ?? [];
        }
        catch (FileNotFoundException)
        {
            var radicals = await GetSubjectsFromApi(SubjectType.Radical, level);
            string json = System.Text.Json.JsonSerializer.Serialize(radicals);
            await staticFileDataAccess.SaveRadicalsForLevel(level, json);
            return radicals;
        }
    }
    private async Task<IReadOnlyList<Subject>> GetKanaVocabulary(int level)
    {
        try
        {
            var kanaVocabularyJson = await staticFileDataAccess.GetKanaVocabularyForLevel(level);
            var kanaVocabulary = System.Text.Json.JsonSerializer.Deserialize<List<Subject>>(kanaVocabularyJson);
            return kanaVocabulary ?? [];
        }
        catch (FileNotFoundException)
        {
            var subjects = await GetSubjectsFromApi(SubjectType.KanaVocabulary, level);
            string json = System.Text.Json.JsonSerializer.Serialize(subjects);
            await staticFileDataAccess.SaveKanaVocabularyForLevel(level, json);
            return subjects;
        }
    }
}
