using Riok.Mapperly.Abstractions;
using WaniKani.Relearn.Api.Response;

namespace WaniKani.Relearn.Api.Mappers;

[Mapper]
public partial class RadicalMapper
{
    [MapProperty(nameof(SingleResource<Radical>.Data) + "." + nameof(Radical.AuxiliaryMeanings), nameof(RadicalResponse.AuxiliaryMeanings))]
    [MapProperty(nameof(SingleResource<Radical>.Data) + "." + nameof(Radical.Characters), nameof(RadicalResponse.Characters))]
    [MapProperty(nameof(SingleResource<Radical>.Data) + "." + nameof(Radical.CreatedAt), nameof(RadicalResponse.CreatedAt))]
    [MapProperty(nameof(SingleResource<Radical>.Data) + "." + nameof(Radical.DocumentUrl), nameof(RadicalResponse.DocumentUrl))]
    [MapProperty(nameof(SingleResource<Radical>.Data) + "." + nameof(Radical.HiddenAt), nameof(RadicalResponse.HiddenAt))]
    [MapProperty(nameof(SingleResource<Radical>.Data) + "." + nameof(Radical.LessonPosition), nameof(RadicalResponse.LessonPosition))]
    [MapProperty(nameof(SingleResource<Radical>.Data) + "." + nameof(Radical.Level), nameof(RadicalResponse.Level))]
    [MapProperty(nameof(SingleResource<Radical>.Data) + "." + nameof(Radical.MeaningMnemonic), nameof(RadicalResponse.MeaningMnemonic))]
    [MapProperty(nameof(SingleResource<Radical>.Data) + "." + nameof(Radical.Meanings), nameof(RadicalResponse.Meanings))]
    [MapProperty(nameof(SingleResource<Radical>.Data) + "." + nameof(Radical.Slug), nameof(RadicalResponse.Slug))]
    [MapProperty(nameof(SingleResource<Radical>.Data) + "." + nameof(Radical.SpacedRepetitionSystemId), nameof(RadicalResponse.SpacedRepetitionSystemId))]
    [MapProperty(nameof(SingleResource<Radical>.Data) + "." + nameof(Radical.AmalgationSubjectIds), nameof(RadicalResponse.AmalgationSubjectIds))]
    [MapProperty(nameof(SingleResource<Radical>.Data) + "." + nameof(Radical.CharacterImages), nameof(RadicalResponse.CharacterImages))]
    public partial RadicalResponse Map(SingleResource<Radical> resource);
}
