using Riok.Mapperly.Abstractions;
using WaniKani.Relearn.Contracts.Resources;
using WaniKani.Relearn.Contracts.Subjects;
using DataAccessVocabulary = WaniKani.Relearn.Subjects.Data.Models.Vocabulary;

namespace WaniKani.Relearn.Subjects.Data.Mappers;

[Mapper]
public partial class KanaVocabularyMapper
{
    [MapProperty(nameof(SingleResource<>.Url), nameof(DataAccessVocabulary.WaniKaniApiUrl))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.DocumentUrl), nameof(DataAccessVocabulary.WaniKaniDocumentUrl))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.Characters), nameof(DataAccessVocabulary.Characters))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.CreatedAt), nameof(DataAccessVocabulary.CreatedAt))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.HiddenAt), nameof(DataAccessVocabulary.HiddenAt))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.Level), nameof(DataAccessVocabulary.WaniKaniLevel))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.MeaningMnemonic), nameof(DataAccessVocabulary.MeaningMnemonic))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.Meanings), nameof(DataAccessVocabulary.Meanings))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.Slug), nameof(DataAccessVocabulary.Slug))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.SpacedRepetitionSystemId), nameof(DataAccessVocabulary.SpacedRepetitionSystemId))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.ContextSentences), nameof(DataAccessVocabulary.ContextSentences))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.PartsOfSpeech), nameof(DataAccessVocabulary.PartsOfSpeech))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.PronunciationAudios), nameof(DataAccessVocabulary.PronunciationAudios))]
    public partial DataAccessVocabulary Map(SingleResource<KanaVocabulary> resource);
}
