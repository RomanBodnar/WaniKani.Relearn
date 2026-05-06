using Riok.Mapperly.Abstractions;
using WaniKani.Relearn;

using DataAccessRadical = WaniKani.Relearn.DataAccess.Models.Radical;
namespace WaniKani.Relearn.DataAccess.Mappers;

[Mapper]
public partial class RadicalMapper
{
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Radical>.Id), nameof(DataAccessRadical.Id))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Radical>.Object), nameof(DataAccessRadical.Object))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Radical>.Url), nameof(DataAccessRadical.WaniKaniApiUrl))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Radical>.DataUpdatedAt), nameof(DataAccessRadical.DataUpdatedAt))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Radical>.Data) + "." + nameof(WaniKani.Relearn.Radical.AuxiliaryMeanings), nameof(DataAccessRadical.AuxiliaryMeanings))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Radical>.Data) + "." + nameof(WaniKani.Relearn.Radical.Characters), nameof(DataAccessRadical.Characters))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Radical>.Data) + "." + nameof(WaniKani.Relearn.Radical.CreatedAt), nameof(DataAccessRadical.CreatedAt))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Radical>.Data) + "." + nameof(WaniKani.Relearn.Radical.DocumentUrl), nameof(DataAccessRadical.WaniKaniDocumentUrl))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Radical>.Data) + "." + nameof(WaniKani.Relearn.Radical.HiddenAt), nameof(DataAccessRadical.HiddenAt))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Radical>.Data) + "." + nameof(WaniKani.Relearn.Radical.LessonPosition), nameof(DataAccessRadical.LessonPosition))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Radical>.Data) + "." + nameof(WaniKani.Relearn.Radical.Level), nameof(DataAccessRadical.Level))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Radical>.Data) + "." + nameof(WaniKani.Relearn.Radical.MeaningMnemonic), nameof(DataAccessRadical.MeaningMnemonic))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Radical>.Data) + "." + nameof(WaniKani.Relearn.Radical.Meanings), nameof(DataAccessRadical.Meanings))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Radical>.Data) + "." + nameof(WaniKani.Relearn.Radical.Slug), nameof(DataAccessRadical.Slug))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Radical>.Data) + "." + nameof(WaniKani.Relearn.Radical.SpacedRepetitionSystemId), nameof(DataAccessRadical.SpacedRepetitionSystemId))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Radical>.Data) + "." + nameof(WaniKani.Relearn.Radical.AmalgamationSubjectIds), nameof(DataAccessRadical.AmalgamationSubjectIds))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Radical>.Data) + "." + nameof(WaniKani.Relearn.Radical.CharacterImages), nameof(DataAccessRadical.CharacterImages))]
    public partial DataAccessRadical Map(SingleResource<WaniKani.Relearn.Radical> resource);
}
