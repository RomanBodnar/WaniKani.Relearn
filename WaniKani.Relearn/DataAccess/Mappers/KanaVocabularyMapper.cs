using Riok.Mapperly.Abstractions;
using WaniKani.Relearn;

using DataAccessVocabulary = WaniKani.Relearn.DataAccess.Models.Vocabulary;

namespace WaniKani.Relearn.DataAccess.Mappers;

[Mapper]
public partial class KanaVocabularyMapper
{
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.KanaVocabulary>.Url), nameof(DataAccessVocabulary.WaniKaniApiUrl))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.KanaVocabulary>.Data) + "." + nameof(WaniKani.Relearn.KanaVocabulary.DocumentUrl), nameof(DataAccessVocabulary.WaniKaniDocumentUrl))]
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.Characters), nameof(DataAccessVocabulary.Characters))]
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.CreatedAt), nameof(DataAccessVocabulary.CreatedAt))]
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.HiddenAt), nameof(DataAccessVocabulary.HiddenAt))]
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.LessonPosition), nameof(DataAccessVocabulary.LessonPosition))]
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.Level), nameof(DataAccessVocabulary.Level))]
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.MeaningMnemonic), nameof(DataAccessVocabulary.MeaningMnemonic))]
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.Meanings), nameof(DataAccessVocabulary.Meanings))]
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.Slug), nameof(DataAccessVocabulary.Slug))]
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.SpacedRepetitionSystemId), nameof(DataAccessVocabulary.SpacedRepetitionSystemId))]
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.ContextSentences), nameof(DataAccessVocabulary.ContextSentences))]
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.PartsOfSpeech), nameof(DataAccessVocabulary.PartsOfSpeech))]
    [MapProperty(nameof(SingleResource<KanaVocabulary>.Data) + "." + nameof(KanaVocabulary.PronunciationAudios), nameof(DataAccessVocabulary.PronunciationAudios))]
    public partial DataAccessVocabulary Map(SingleResource<WaniKani.Relearn.KanaVocabulary> resource);
}
