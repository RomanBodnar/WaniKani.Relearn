using Riok.Mapperly.Abstractions;
using WaniKani.Relearn.Contracts.Resources;
using WaniKani.Relearn.Contracts.Subjects;
using WaniKani.Relearn.Subjects.Api.Response;
namespace WaniKani.Relearn.Subjects.Api.Mappers;

[Mapper]
public partial class RadicalMapper
{
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Radical.AuxiliaryMeanings), nameof(RadicalResponse.AuxiliaryMeanings))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Radical.Characters), nameof(RadicalResponse.Characters))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Radical.CreatedAt), nameof(RadicalResponse.CreatedAt))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Radical.DocumentUrl), nameof(RadicalResponse.DocumentUrl))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Radical.HiddenAt), nameof(RadicalResponse.HiddenAt))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Radical.LessonPosition), nameof(RadicalResponse.LessonPosition))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Radical.Level), nameof(RadicalResponse.Level))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Radical.MeaningMnemonic), nameof(RadicalResponse.MeaningMnemonic))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Radical.Meanings), nameof(RadicalResponse.Meanings))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Radical.Slug), nameof(RadicalResponse.Slug))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Radical.SpacedRepetitionSystemId), nameof(RadicalResponse.SpacedRepetitionSystemId))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Radical.AmalgamationSubjectIds), nameof(RadicalResponse.AmalgamationSubjectIds))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Radical.CharacterImages), nameof(RadicalResponse.CharacterImages))]
    public partial RadicalResponse Map(SingleResource<Radical> resource);

    [MapProperty(nameof(Data.Models.Radical.WaniKaniApiUrl), nameof(RadicalResponse.Url))]
    [MapProperty(nameof(Data.Models.Radical.WaniKaniDocumentUrl), nameof(RadicalResponse.DocumentUrl))]
    public partial RadicalResponse Map(Data.Models.Radical radical);
}
