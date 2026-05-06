using Riok.Mapperly.Abstractions;
using WaniKani.Relearn;

using DataAccessKanji = WaniKani.Relearn.DataAccess.Models.Kanji;
namespace WaniKani.Relearn.DataAccess.Mappers;

[Mapper]
public partial class KanjiMapper
{
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Kanji>.Id), nameof(DataAccessKanji.Id))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Kanji>.Object), nameof(DataAccessKanji.Object))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Kanji>.Url), nameof(DataAccessKanji.WaniKaniApiUrl))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Kanji>.DataUpdatedAt), nameof(DataAccessKanji.DataUpdatedAt))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Kanji>.Data) + "." + nameof(WaniKani.Relearn.Kanji.AuxiliaryMeanings), nameof(DataAccessKanji.AuxiliaryMeanings))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Kanji>.Data) + "." + nameof(WaniKani.Relearn.Kanji.Characters), nameof(DataAccessKanji.Characters))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Kanji>.Data) + "." + nameof(WaniKani.Relearn.Kanji.CreatedAt), nameof(DataAccessKanji.CreatedAt))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Kanji>.Data) + "." + nameof(WaniKani.Relearn.Kanji.DocumentUrl), nameof(DataAccessKanji.WaniKaniDocumentUrl))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Kanji>.Data) + "." + nameof(WaniKani.Relearn.Kanji.HiddenAt), nameof(DataAccessKanji.HiddenAt))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Kanji>.Data) + "." + nameof(WaniKani.Relearn.Kanji.LessonPosition), nameof(DataAccessKanji.LessonPosition))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Kanji>.Data) + "." + nameof(WaniKani.Relearn.Kanji.Level), nameof(DataAccessKanji.Level))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Kanji>.Data) + "." + nameof(WaniKani.Relearn.Kanji.MeaningMnemonic), nameof(DataAccessKanji.MeaningMnemonic))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Kanji>.Data) + "." + nameof(WaniKani.Relearn.Kanji.Meanings), nameof(DataAccessKanji.Meanings))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Kanji>.Data) + "." + nameof(WaniKani.Relearn.Kanji.Slug), nameof(DataAccessKanji.Slug))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Kanji>.Data) + "." + nameof(WaniKani.Relearn.Kanji.SpacedRepetitionSystemId), nameof(DataAccessKanji.SpacedRepetitionSystemId))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Kanji>.Data) + "." + nameof(WaniKani.Relearn.Kanji.AmalgamationSubjectIds), nameof(DataAccessKanji.AmalgamationSubjectIds))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Kanji>.Data) + "." + nameof(WaniKani.Relearn.Kanji.ComponentSubjectIds), nameof(DataAccessKanji.ComponentSubjectIds))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Kanji>.Data) + "." + nameof(WaniKani.Relearn.Kanji.MeaningHint), nameof(DataAccessKanji.MeaningHint))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Kanji>.Data) + "." + nameof(WaniKani.Relearn.Kanji.ReadingHint), nameof(DataAccessKanji.ReadingHint))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Kanji>.Data) + "." + nameof(WaniKani.Relearn.Kanji.ReadingMnemonic), nameof(DataAccessKanji.ReadingMnemonic))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Kanji>.Data) + "." + nameof(WaniKani.Relearn.Kanji.Readings), nameof(DataAccessKanji.Readings))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Kanji>.Data) + "." + nameof(WaniKani.Relearn.Kanji.VisuallySimilarSubjectIds), nameof(DataAccessKanji.VisuallySimilarSubjectIds))]
    public partial DataAccessKanji Map(SingleResource<WaniKani.Relearn.Kanji> resource);
}
