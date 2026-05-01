using WaniKani.Relearn.Model.Subjects;

namespace WaniKani.Relearn.DataAccess;

public interface IDataAccess
{
    Task<List<SingleResource<T>>> GetAllSubjects<T>(params int[] levels) where T : Subject;
    Task SaveSubjectsForLevel<T>(int level, IEnumerable<SingleResource<T>> subjects) where T : Subject;
}
