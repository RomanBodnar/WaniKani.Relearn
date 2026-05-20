using Riok.Mapperly.Abstractions;
using WaniKani.Relearn.Contracts.Resources;
using WaniKani.Relearn.Contracts.Subjects;
using WaniKani.Relearn.Subjects.Api.Response;

namespace WaniKani.Relearn.Subjects.Api.Mappers;

[Mapper]
public partial class KanjiMapper
{
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.AuxiliaryMeanings), nameof(KanjiResponse.AuxiliaryMeanings))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.Characters), nameof(KanjiResponse.Characters))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.CreatedAt), nameof(KanjiResponse.CreatedAt))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.DocumentUrl), nameof(KanjiResponse.DocumentUrl))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.HiddenAt), nameof(KanjiResponse.HiddenAt))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.LessonPosition), nameof(KanjiResponse.LessonPosition))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.Level), nameof(KanjiResponse.Level))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.MeaningMnemonic), nameof(KanjiResponse.MeaningMnemonic))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.Meanings), nameof(KanjiResponse.Meanings))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.Slug), nameof(KanjiResponse.Slug))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.SpacedRepetitionSystemId), nameof(KanjiResponse.SpacedRepetitionSystemId))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.AmalgamationSubjectIds), nameof(KanjiResponse.AmalgamationSubjectIds))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.ComponentSubjectIds), nameof(KanjiResponse.ComponentSubjectIds))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.MeaningHint), nameof(KanjiResponse.MeaningHint))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.ReadingHint), nameof(KanjiResponse.ReadingHint))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.ReadingMnemonic), nameof(KanjiResponse.ReadingMnemonic))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.Readings), nameof(KanjiResponse.Readings))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.VisuallySimilarSubjectIds), nameof(KanjiResponse.VisuallySimilarSubjectIds))]
    [MapperIgnoreTarget(nameof(KanjiResponse.JlptLevel))] // JlptLevel is a string in the API but an int? in the data model, so we ignore it here and map it manually in the other Map method
    [MapperIgnoreTarget(nameof(KanjiResponse.JoyoGrade))] // JoyoGrade is a
    public partial KanjiResponse Map(SingleResource<Kanji> resource);

    [MapProperty(nameof(Data.Models.Kanji.WaniKaniApiUrl), nameof(KanjiResponse.Url))]
    [MapProperty(nameof(Data.Models.Kanji.WaniKaniDocumentUrl), nameof(KanjiResponse.DocumentUrl))]
    public partial KanjiResponse Map(Data.Models.Kanji kanji);
}
