using System.Collections.Concurrent;
using WaniKani.Relearn.Contracts.Assignments;
using WaniKani.Relearn.Subjects.Data.Models;

namespace WaniKani.Relearn.Subjects.Data;

// todo: add fallback to API if not found in cache
public class SubjectCache
{
    private readonly ConcurrentDictionary<int, Subject> _subjects = new();

    public void AddOrUpdate(Subject subject)
    {
        _subjects.AddOrUpdate(subject.Id, subject, (_, _) => subject);
    }

    public bool TryGet(int id, out Subject? subject)
    {
        return _subjects.TryGetValue(id, out subject);
    }

    public PageResult<Subject> GetSubjects(SubjectType[] types, int? page, int? perPage, int? minLevel = null, int? maxLevel = null)
    {
        var query = _subjects.Values
            .Where(x => types
                .Select(t => t.ToSnakeCaseString())
                .Contains(x.Object)
            );

        if (minLevel.HasValue)
            query = query.Where(x => x.WaniKaniLevel >= minLevel.Value);

        if (maxLevel.HasValue)
            query = query.Where(x => x.WaniKaniLevel <= maxLevel.Value);

        var count = query.Count();

        var subjects = query
            .OrderBy(x => x.WaniKaniLevel)
            .ThenBy(x => x.Id)
            .Skip(((page ?? 1) - 1) * (perPage ?? 100))
            .Take(perPage ?? 100);

        return new PageResult<Subject>(subjects, page ?? 1, perPage ?? 100, count);
    }

    // todo: accept SubjectType and map to snake case string here
    public IEnumerable<Subject> GetAllOfType(string typeName)
    {
        return _subjects.Values.Where(x => x.Object == typeName);
    }
    public Subject? FindByCharacters(string characters, SubjectType typeName)
    {
        return _subjects.Values.FirstOrDefault(x =>
            x.Object == typeName.ToSnakeCaseString() && x.Characters == characters);
    }
}
