using Newtonsoft.Json;
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
    public async Task<IReadOnlyList<SingleResource<T>>> GetSubjects<T>(SubjectType type, int? level) where T : Subject
    {
        var subjects = await GetSubjectsForType<T>(type, level);
        return subjects?.ToList() ?? [];
    }

    private async Task<IReadOnlyList<SingleResource<T>>> GetSubjectsForType<T>(SubjectType type, int? level = null)
        where T : Subject
    {
        try
        {
            var levels = level is not null ? [level.Value] : Enumerable.Range(1, 61).ToArray();
            return await staticFileDataAccess.GetAllSubjects<T>(levels);
        }
        catch (FileNotFoundException)
        {
            logger.LogInformation("{Type} files not found. Fetching from API...", type);

            var subjects = await GetSubjectsFromApi<T>(type);
            var subjectsByLevel = subjects.GroupBy(s => s.Data.Level).ToDictionary(g => g.Key, g => g.ToList());
            foreach (var item in subjectsByLevel)
            {
                await staticFileDataAccess.SaveSubjectsForLevel(item.Key, item.Value);
            }
            return subjects.ToList();
        }
    }

    private async Task<IEnumerable<SingleResource<T>>> GetSubjectsFromApi<T>(SubjectType type, int? level = null) where T : Subject
    {
        var subjectsQuery = new SubjectsQuery
        {
            Types = [type.ToSnakeCaseString()],
            Levels = level is not null ? [level.Value] : null
        };

        return await GetTypedSubjects<T>(subjectsQuery);
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
            var nextCollection = System.Text.Json.JsonSerializer.Deserialize<CollectionResource<T>>(subjectsJson);

            if (nextCollection?.Data != null)
            {
                logger.LogInformation("Fetched {Count} subjects for type {Type}", nextCollection.Data.Count, typeof(T));
                allSubjects.AddRange(nextCollection.Data ?? []);
            }
            nextUrl = nextCollection?.Pages.NextUrl;
        }

        return allSubjects;
    }

    // private async Task<IEnumerable<SingleResource<Subject>>> GetKanji(int level)
    // {
    //     try
    //     {
    //         var kanjiJson = await staticFileDataAccess.GetKanjiForLevel(level);
    //         var kanji = JsonConvert.DeserializeObject<List<SingleResource<Kanji>>>(kanjiJson);
    //         return ConvertToSingleResourceList(kanji ?? []);
    //     }
    //     catch (FileNotFoundException)
    //     {
    //         var kanji = await GetSubjectsFromApi<Kanji>(SubjectType.Kanji, level);
    //         await staticFileDataAccess.SaveKanjiForLevel(level, kanji.Select(x => x));
    //         return kanji;
    //     }
    // }

    // private async Task<IEnumerable<SingleResource<Subject>>> GetVocabulary(int level)
    // {
    //     try
    //     {
    //         var vocabularyJson = await staticFileDataAccess.GetVocabularyForLevel(level);
    //         var vocabulary = JsonConvert.DeserializeObject<List<SingleResource<Vocabulary>>>(vocabularyJson);
    //         return ConvertToSingleResourceList(vocabulary ?? []);
    //     }
    //     catch (FileNotFoundException)
    //     {
    //         var vocabulary = await GetSubjectsFromApi(SubjectType.Vocabulary, level);
    //         await staticFileDataAccess.SaveVocabularyForLevel(level, vocabulary.Select(x => x));
    //         return vocabulary;
    //     }
    // }

    // private async Task<IEnumerable<SingleResource<Subject>>> GetRadicals(int level)
    // {
    //     try
    //     {
    //         var radicalsJson = await staticFileDataAccess.GetRadicalsForLevel(level);
    //         var radicals = JsonConvert.DeserializeObject<List<SingleResource<Radical>>>(radicalsJson);
    //         return ConvertToSingleResourceList(radicals ?? []);
    //     }
    //     catch (FileNotFoundException)
    //     {
    //         var radicals = await GetSubjectsFromApi(SubjectType.Radical, level);
    //         await staticFileDataAccess.SaveRadicalsForLevel(level, radicals.Select(x => x));
    //         return radicals;
    //     }
    // }

    // private async Task<IEnumerable<SingleResource<Subject>>> GetKanaVocabulary(int level)
    // {
    //     try
    //     {
    //         var kanaVocabularyJson = await staticFileDataAccess.GetKanaVocabularyForLevel(level);
    //         var kanaVocabulary = JsonConvert.DeserializeObject<List<SingleResource<KanaVocabulary>>>(kanaVocabularyJson);
    //         return ConvertToSingleResourceList(kanaVocabulary ?? []);
    //     }
    //     catch (FileNotFoundException)
    //     {
    //         var subjects = await GetSubjectsFromApi(SubjectType.KanaVocabulary, level);
    //         await staticFileDataAccess.SaveKanaVocabularyForLevel(level, subjects.Select(x => x));
    //         return subjects;
    //     }
    // }

    private static IEnumerable<SingleResource<Subject>> ConvertToSingleResourceList<T>(IEnumerable<SingleResource<T>> subjects) where T : Subject
    {
        return subjects.Select(s => new SingleResource<Subject>
        {
            Id = s.Id,
            Object = s.Object,
            Url = s.Url,
            DataUpdatedAt = s.DataUpdatedAt,
            Data = s.Data
        });
    }
}
