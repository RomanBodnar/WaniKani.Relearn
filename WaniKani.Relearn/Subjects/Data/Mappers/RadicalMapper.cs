using Riok.Mapperly.Abstractions;
using WaniKani.Relearn.Contracts.Resources;
using WaniKani.Relearn.Contracts.Subjects;
namespace WaniKani.Relearn.Subjects.Data.Mappers;

[Mapper]
public partial class RadicalMapper
{
    [MapProperty(nameof(SingleResource<>.Id), nameof(Models.Radical.Id))]
    [MapProperty(nameof(SingleResource<>.Object), nameof(Models.Radical.Object))]
    [MapProperty(nameof(SingleResource<>.Url), nameof(Models.Radical.WaniKaniApiUrl))]
    [MapProperty(nameof(SingleResource<>.DataUpdatedAt), nameof(Models.Radical.DataUpdatedAt))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Radical.AuxiliaryMeanings), nameof(Models.Radical.AuxiliaryMeanings))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Radical.Characters), nameof(Models.Radical.Characters))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Radical.CreatedAt), nameof(Models.Radical.CreatedAt))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Radical.DocumentUrl), nameof(Models.Radical.WaniKaniDocumentUrl))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Radical.HiddenAt), nameof(Models.Radical.HiddenAt))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Radical.Level), nameof(Models.Radical.WaniKaniLevel))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Radical.MeaningMnemonic), nameof(Models.Radical.MeaningMnemonic))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Radical.Meanings), nameof(Models.Radical.Meanings))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Radical.Slug), nameof(Models.Radical.Slug))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Radical.SpacedRepetitionSystemId), nameof(Models.Radical.SpacedRepetitionSystemId))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Radical.AmalgamationSubjectIds), nameof(Models.Radical.AmalgamationSubjectIds))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Radical.CharacterImages), nameof(Models.Radical.CharacterImages))]
    public partial Models.Radical Map(SingleResource<Radical> resource);
}
