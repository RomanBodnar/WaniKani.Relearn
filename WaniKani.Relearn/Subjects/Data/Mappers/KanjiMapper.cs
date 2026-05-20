using Riok.Mapperly.Abstractions;
using WaniKani.Relearn.Contracts.Resources;
using WaniKani.Relearn.Contracts.Subjects;
using DataAccessKanji = WaniKani.Relearn.Subjects.Data.Models.Kanji;

namespace WaniKani.Relearn.Subjects.Data.Mappers;

[Mapper]
public partial class KanjiMapper
{
    [MapProperty(nameof(SingleResource<>.Id), nameof(DataAccessKanji.Id))]
    [MapProperty(nameof(SingleResource<>.Object), nameof(DataAccessKanji.Object))]
    [MapProperty(nameof(SingleResource<>.Url), nameof(DataAccessKanji.WaniKaniApiUrl))]
    [MapProperty(nameof(SingleResource<>.DataUpdatedAt), nameof(DataAccessKanji.DataUpdatedAt))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.AuxiliaryMeanings), nameof(DataAccessKanji.AuxiliaryMeanings))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.Characters), nameof(DataAccessKanji.Characters))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.CreatedAt), nameof(DataAccessKanji.CreatedAt))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.DocumentUrl), nameof(DataAccessKanji.WaniKaniDocumentUrl))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.HiddenAt), nameof(DataAccessKanji.HiddenAt))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.LessonPosition), nameof(DataAccessKanji.LessonPosition))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.Level), nameof(DataAccessKanji.Level))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.MeaningMnemonic), nameof(DataAccessKanji.MeaningMnemonic))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.Meanings), nameof(DataAccessKanji.Meanings))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.Slug), nameof(DataAccessKanji.Slug))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.SpacedRepetitionSystemId), nameof(DataAccessKanji.SpacedRepetitionSystemId))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.AmalgamationSubjectIds), nameof(DataAccessKanji.AmalgamationSubjectIds))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.ComponentSubjectIds), nameof(DataAccessKanji.ComponentSubjectIds))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.MeaningHint), nameof(DataAccessKanji.MeaningHint))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.ReadingHint), nameof(DataAccessKanji.ReadingHint))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.ReadingMnemonic), nameof(DataAccessKanji.ReadingMnemonic))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.Readings), nameof(DataAccessKanji.Readings))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Kanji.VisuallySimilarSubjectIds), nameof(DataAccessKanji.VisuallySimilarSubjectIds))]
    [MapperIgnoreTarget(nameof(DataAccessKanji.JlptLevel))]
    [MapperIgnoreTarget(nameof(DataAccessKanji.JoyoGrade))]
    public partial DataAccessKanji Map(SingleResource<Kanji> resource);
}
