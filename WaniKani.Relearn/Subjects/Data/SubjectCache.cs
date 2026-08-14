using System.Collections.Concurrent;
using System.Globalization;
using System.Text;
using WaniKani.Relearn.Contracts.Assignments;
using WaniKani.Relearn.Subjects.Data.Models;

namespace WaniKani.Relearn.Subjects.Data;

// todo: add fallback to API if not found in cache
public class SubjectCache(IServiceScopeFactory scopeFactory)
{
    private readonly ConcurrentDictionary<int, Subject> _subjects = new();
    private readonly SemaphoreSlim _semaphore = new(1, 1);
    private bool _isLoaded;

    private async ValueTask EnsureLoadedAsync()
    {
        if (_isLoaded) return;
        await _semaphore.WaitAsync();
        try
        {
            if (_isLoaded) return;

            using var scope = scopeFactory.CreateScope();
            var dataAccess = scope.ServiceProvider.GetRequiredService<IDataAccess>();

            var kanji = await dataAccess.GetKanji();
            var vocabulary = await dataAccess.GetVocabulary();
            var radicals = await dataAccess.GetRadicals();

            foreach (var kanjiSubject in kanji)
            {
                AddOrUpdate(kanjiSubject);
            }
            foreach (var vocab in vocabulary)
            {
                AddOrUpdate(vocab);
            }
            foreach (var radical in radicals)
            {
                AddOrUpdate(radical);
            }

            _isLoaded = true;
        }
        finally
        {
            _semaphore.Release();
        }
    }

    public void AddOrUpdate(Subject subject)
    {
        _subjects.AddOrUpdate(subject.Id, subject, (_, _) => subject);
        _isLoaded = true;
    }

    public async ValueTask<Subject?> TryGetAsync(int id)
    {
        await EnsureLoadedAsync();
        return _subjects.TryGetValue(id, out var subject) ? subject : null;
    }

    public async ValueTask<IEnumerable<Subject>> GetAllAsync()
    {
        await EnsureLoadedAsync();
        return _subjects.Values;
    }

    public async ValueTask<int> GetIdByCharactersAsync(string characters)
    {
        await EnsureLoadedAsync();
        var subject = _subjects.Values.FirstOrDefault(
            x => 
            x.Object is "vocabulary" or "kana_vocabulary" 
            &&
            string.Compare(
                x.Characters?.Normalize(NormalizationForm.FormKD) ?? "", 
                characters.Normalize(NormalizationForm.FormKD), 
                CultureInfo.InvariantCulture, 
                CompareOptions.IgnoreNonSpace) == 0 
             );
        return subject?.Id ?? 0;        
    }

    public async ValueTask<PageResult<Subject>> GetSubjectsAsync(SubjectType[] types, int? page, int? perPage, int? minLevel = null, int? maxLevel = null)
    {
        await EnsureLoadedAsync();
        var query = _subjects.Values
            .Where(x => types
                .Select(t => t.ToSnakeCaseString())
                .Contains(x.Object)
            );

        if (minLevel.HasValue)
            query = query.Where(x => x.Level >= minLevel.Value);

        if (maxLevel.HasValue)
            query = query.Where(x => x.Level <= maxLevel.Value);

        var count = query.Count();

        var subjects = query
            .OrderBy(x => x.Level)
            .ThenBy(x => x.Id)
            .Skip(((page ?? 1) - 1) * (perPage ?? 100))
            .Take(perPage ?? 100);

        return new PageResult<Subject>(subjects, page ?? 1, perPage ?? 100, count);
    }

    // todo: accept SubjectType and map to snake case string here
    public async ValueTask<IEnumerable<Subject>> GetAllOfTypeAsync(string typeName)
    {
        await EnsureLoadedAsync();
        return _subjects.Values.Where(x => x.Object == typeName);
    }

    public async ValueTask<Subject?> FindByCharactersAsync(string characters, SubjectType typeName)
    {
        await EnsureLoadedAsync();
        return _subjects.Values.FirstOrDefault(x =>
            x.Object == typeName.ToSnakeCaseString() && x.Characters == characters);
    }
}
