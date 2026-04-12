using Riok.Mapperly.Abstractions;
using WaniKani.Relearn.Api.Response;

namespace WaniKani.Relearn.Api.Mappers;

[Mapper]
public partial class VocabularyMapper
{
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.AuxiliaryMeanings), nameof(VocabularyResponse.AuxiliaryMeanings))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.Characters), nameof(VocabularyResponse.Characters))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.CreatedAt), nameof(VocabularyResponse.CreatedAt))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.DocumentUrl), nameof(VocabularyResponse.DocumentUrl))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.HiddenAt), nameof(VocabularyResponse.HiddenAt))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.LessonPosition), nameof(VocabularyResponse.LessonPosition))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.Level), nameof(VocabularyResponse.Level))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.MeaningMnemonic), nameof(VocabularyResponse.MeaningMnemonic))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.Meanings), nameof(VocabularyResponse.Meanings))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.Slug), nameof(VocabularyResponse.Slug))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.SpacedRepetitionSystemId), nameof(VocabularyResponse.SpacedRepetitionSystemId))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.ComponentSubjectIds), nameof(VocabularyResponse.ComponentSubjectIds))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.ContextSentences), nameof(VocabularyResponse.ContextSentences))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.ReadingMnemonic), nameof(VocabularyResponse.ReadingMnemonic))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.PartsOfSpeech), nameof(VocabularyResponse.PartsOfSpeech))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.PronunciationAudios), nameof(VocabularyResponse.PronunciationAudios))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.Readings), nameof(VocabularyResponse.Readings))]
    public partial VocabularyResponse Map(SingleResource<Vocabulary> resource);
}
