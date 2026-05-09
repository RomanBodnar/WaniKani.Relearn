using System.Collections.Concurrent;
using WaniKani.Relearn.Model.Assignments;

namespace WaniKani.Relearn.DataAccess;

// todo: add fallback to API if not found in cache
public class SubjectCache
{
    private readonly ConcurrentDictionary<int, DataAccess.Models.Subject> _subjects = new();

    public void AddOrUpdate(DataAccess.Models.Subject subject)
    {
        _subjects.AddOrUpdate(subject.Id, subject, (key, existing) => subject);
    }

    public bool TryGet(int id, out DataAccess.Models.Subject? subject)
    {
        return _subjects.TryGetValue(id, out subject);
    }

    public PageResult<DataAccess.Models.Subject> GetSubjects(SubjectType[] types, int? page, int? perPage, int? minLevel = null, int? maxLevel = null)
    {
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

        return new PageResult<DataAccess.Models.Subject>(subjects, page ?? 1, perPage ?? 100, count);
    }

    // todo: accept SubjectType and map to snake case string here
    public IEnumerable<DataAccess.Models.Subject> GetAllOfType(string typeName)
    {
        return _subjects.Values.Where(x => x.Object == typeName);
    }
    public DataAccess.Models.Subject? FindByCharacters(string characters, SubjectType typeName)
    {
        return _subjects.Values.FirstOrDefault(x =>
            x.Object == typeName.ToSnakeCaseString() && x.Characters == characters);
    }
}
