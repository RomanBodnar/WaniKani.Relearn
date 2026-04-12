using Riok.Mapperly.Abstractions;
using WaniKani.Relearn.Api.Response;

namespace WaniKani.Relearn.Api.Mappers;

[Mapper]
public partial class KanjiMapper
{
    [MapProperty(nameof(SingleResource<Kanji>.Data) + "." + nameof(Kanji.AuxiliaryMeanings), nameof(KanjiResponse.AuxiliaryMeanings))]
    [MapProperty(nameof(SingleResource<Kanji>.Data) + "." + nameof(Kanji.Characters), nameof(KanjiResponse.Characters))]
    [MapProperty(nameof(SingleResource<Kanji>.Data) + "." + nameof(Kanji.CreatedAt), nameof(KanjiResponse.CreatedAt))]
    [MapProperty(nameof(SingleResource<Kanji>.Data) + "." + nameof(Kanji.DocumentUrl), nameof(KanjiResponse.DocumentUrl))]
    [MapProperty(nameof(SingleResource<Kanji>.Data) + "." + nameof(Kanji.HiddenAt), nameof(KanjiResponse.HiddenAt))]
    [MapProperty(nameof(SingleResource<Kanji>.Data) + "." + nameof(Kanji.LessonPosition), nameof(KanjiResponse.LessonPosition))]
    [MapProperty(nameof(SingleResource<Kanji>.Data) + "." + nameof(Kanji.Level), nameof(KanjiResponse.Level))]
    [MapProperty(nameof(SingleResource<Kanji>.Data) + "." + nameof(Kanji.MeaningMnemonic), nameof(KanjiResponse.MeaningMnemonic))]
    [MapProperty(nameof(SingleResource<Kanji>.Data) + "." + nameof(Kanji.Meanings), nameof(KanjiResponse.Meanings))]
    [MapProperty(nameof(SingleResource<Kanji>.Data) + "." + nameof(Kanji.Slug), nameof(KanjiResponse.Slug))]
    [MapProperty(nameof(SingleResource<Kanji>.Data) + "." + nameof(Kanji.SpacedRepetitionSystemId), nameof(KanjiResponse.SpacedRepetitionSystemId))]
    [MapProperty(nameof(SingleResource<Kanji>.Data) + "." + nameof(Kanji.AmalgationSubjectIds), nameof(KanjiResponse.AmalgationSubjectIds))]
    [MapProperty(nameof(SingleResource<Kanji>.Data) + "." + nameof(Kanji.ComponentSubjectIds), nameof(KanjiResponse.ComponentSubjectIds))]
    [MapProperty(nameof(SingleResource<Kanji>.Data) + "." + nameof(Kanji.MeaningHint), nameof(KanjiResponse.MeaningHint))]
    [MapProperty(nameof(SingleResource<Kanji>.Data) + "." + nameof(Kanji.ReadingHint), nameof(KanjiResponse.ReadingHint))]
    [MapProperty(nameof(SingleResource<Kanji>.Data) + "." + nameof(Kanji.ReadingMnemonic), nameof(KanjiResponse.ReadingMnemonic))]
    [MapProperty(nameof(SingleResource<Kanji>.Data) + "." + nameof(Kanji.Readings), nameof(KanjiResponse.Readings))]
    [MapProperty(nameof(SingleResource<Kanji>.Data) + "." + nameof(Kanji.VisuallySimilarSubjectIds), nameof(KanjiResponse.VisuallySimilarSubjectIds))]
    public partial KanjiResponse Map(SingleResource<Kanji> resource);
}
