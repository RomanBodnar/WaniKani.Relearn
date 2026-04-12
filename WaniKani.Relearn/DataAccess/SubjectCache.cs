using System.Collections.Concurrent;

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
}
