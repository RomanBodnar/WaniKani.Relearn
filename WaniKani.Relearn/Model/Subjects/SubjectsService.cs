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
            var levels = level is not null ? [level.Value] : Enumerable.Range(1, 60).ToArray();
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
}
