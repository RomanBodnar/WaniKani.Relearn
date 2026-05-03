using System.Collections.Concurrent;
using WaniKani.Relearn.Model.Assignments;

namespace WaniKani.Relearn.DataAccess;

// todo: add fallback to API if not found in cache
public class SubjectCache
{
    private readonly ConcurrentDictionary<int, SingleResource<Subject>> _subjects = new();

    public void AddOrUpdate(SingleResource<Subject> subject)
    {
        _subjects.AddOrUpdate(subject.Id, subject, (key, existing) => subject);
    }

    public bool TryGet(int id, out SingleResource<Subject>? subject)
    {
        return _subjects.TryGetValue(id, out subject);
    }

    public PageResult<SingleResource<Subject>> GetSubjects(SubjectType[] types, int? page, int? perPage, int? minLevel = null, int? maxLevel = null)
    {
        var query = _subjects.Values
            .Where(x => types
                .Select(t => t.ToString())
                .Contains(x.Data.GetType().Name)
            );

        if (minLevel.HasValue)
            query = query.Where(x => x.Data.Level >= minLevel.Value);

        if (maxLevel.HasValue)
            query = query.Where(x => x.Data.Level <= maxLevel.Value);

        var count = query.Count();

        var subjects = query
            .OrderBy(x => x.Data.Level)
            .ThenBy(x => x.Id)
            .Skip(((page ?? 1) - 1) * (perPage ?? 100))
            .Take(perPage ?? 100);

        return new PageResult<SingleResource<Subject>>(subjects, page ?? 1, perPage ?? 100, count);
    }

    public IEnumerable<SingleResource<Subject>> GetAllOfType(string typeName)
    {
        return _subjects.Values.Where(x => x.Data.GetType().Name == typeName);
    }
    public SingleResource<Subject>? FindByCharacters(string characters, string typeName)
    {
        return _subjects.Values.FirstOrDefault(x =>
            x.Data.GetType().Name == typeName && x.Data.Characters == characters);
    }
}
