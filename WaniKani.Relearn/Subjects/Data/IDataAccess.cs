using WaniKani.Relearn.Contracts.Resources;
using WaniKani.Relearn.Contracts.Subjects;

namespace WaniKani.Relearn.Subjects.Data;

public interface IDataAccess
{
    Task<List<SingleResource<T>>> GetAllSubjects<T>(params int[] levels) where T : Subject;
    Task SaveSubjectsForLevel<T>(int level, IEnumerable<SingleResource<T>> subjects) where T : Subject;
    Task SaveSubjects<T>(IEnumerable<T> subjects) where T : Models.Subject;

    Task<List<Models.Kanji>> GetKanji();
    Task<List<Models.Radical>> GetRadicals();
    Task<List<Models.Vocabulary>> GetVocabulary();
}
