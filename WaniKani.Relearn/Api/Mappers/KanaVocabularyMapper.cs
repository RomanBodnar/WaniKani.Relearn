using Riok.Mapperly.Abstractions;
using WaniKani.Relearn.Api.Response;
using WaniKani.Relearn.Model.Subjects;

namespace WaniKani.Relearn.Api.Mappers;

[Mapper]
public partial class KanaVocabularyMapper
{
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.AuxiliaryMeanings), nameof(KanaVocabularyResponse.AuxiliaryMeanings))]
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.Characters), nameof(KanaVocabularyResponse.Characters))]
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.CreatedAt), nameof(KanaVocabularyResponse.CreatedAt))]
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.DocumentUrl), nameof(KanaVocabularyResponse.DocumentUrl))]
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.HiddenAt), nameof(KanaVocabularyResponse.HiddenAt))]
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.LessonPosition), nameof(KanaVocabularyResponse.LessonPosition))]
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.Level), nameof(KanaVocabularyResponse.Level))]
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.MeaningMnemonic), nameof(KanaVocabularyResponse.MeaningMnemonic))]
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.Meanings), nameof(KanaVocabularyResponse.Meanings))]
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.Slug), nameof(KanaVocabularyResponse.Slug))]
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.SpacedRepetitionSystemId), nameof(KanaVocabularyResponse.SpacedRepetitionSystemId))]
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.ContextSentences), nameof(KanaVocabularyResponse.ContextSentences))]
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.PartsOfSpeech), nameof(KanaVocabularyResponse.PartsOfSpeech))]
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.PronunciationAudios), nameof(KanaVocabularyResponse.PronunciationAudios))]
    public partial KanaVocabularyResponse Map(SingleResource<KanaVocabulary> resource);
}
