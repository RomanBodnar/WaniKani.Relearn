namespace WaniKani.Relearn.DataAccess;

public interface IDataAccess
{
    Task<List<SingleResource<T>>> GetAllSubjects<T>(params int[] levels) where T : Subject;
    Task SaveSubjectsForLevel<T>(int level, IEnumerable<SingleResource<T>> subjects) where T : Subject;
    Task SaveSubjects<T>(IEnumerable<T> subjects) where T : DataAccess.Models.Subject;


    Task<List<DataAccess.Models.Kanji>> GetKanji();
    Task<List<DataAccess.Models.Radical>> GetRadicals();
    Task<List<DataAccess.Models.Vocabulary>> GetVocabulary();

}
