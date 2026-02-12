namespace WaniKani.Relearn.DataAccess;

public interface IDataAccess
{
    Task<List<Subject>> GetAllRadicals(params int[] levels);
    Task<List<Subject>> GetAllKanji(params int[] levels);
    Task<List<Subject>> GetAllVocabulary(params int[] levels);
    Task<List<Subject>> GetAllKanaVocabulary(params int[] levels);
}
