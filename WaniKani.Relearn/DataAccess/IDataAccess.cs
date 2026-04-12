using WaniKani.Relearn.Model.Subjects;

namespace WaniKani.Relearn.DataAccess;

public interface IDataAccess
{
    Task<List<SingleResource<Radical>>> GetAllRadicals(params int[] levels);
    Task<List<SingleResource<Kanji>>> GetAllKanji(params int[] levels);
    Task<List<SingleResource<Vocabulary>>> GetAllVocabulary(params int[] levels);
    Task<List<SingleResource<KanaVocabulary>>> GetAllKanaVocabulary(params int[] levels);
}
