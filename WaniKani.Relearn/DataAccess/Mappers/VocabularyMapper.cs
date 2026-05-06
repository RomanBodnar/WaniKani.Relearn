using Riok.Mapperly.Abstractions;
using WaniKani.Relearn;
using Vocabulary = WaniKani.Relearn.Vocabulary;
using DataAccessVocabulary = WaniKani.Relearn.DataAccess.Models.Vocabulary;

namespace WaniKani.Relearn.DataAccess.Mappers;

[Mapper]
public partial class VocabularyMapper
{
    [MapProperty(nameof(SingleResource<Vocabulary>.Id), nameof(DataAccessVocabulary.Id))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Object), nameof(DataAccessVocabulary.Object))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Url), nameof(DataAccessVocabulary.WaniKaniApiUrl))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Vocabulary>.DataUpdatedAt), nameof(DataAccessVocabulary.DataUpdatedAt))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Vocabulary>.Data) + "." + nameof(WaniKani.Relearn.Vocabulary.AuxiliaryMeanings), nameof(DataAccessVocabulary.AuxiliaryMeanings))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Vocabulary>.Data) + "." + nameof(WaniKani.Relearn.Vocabulary.Characters), nameof(DataAccessVocabulary.Characters))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Vocabulary>.Data) + "." + nameof(WaniKani.Relearn.Vocabulary.CreatedAt), nameof(DataAccessVocabulary.CreatedAt))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Vocabulary>.Data) + "." + nameof(WaniKani.Relearn.Vocabulary.DocumentUrl), nameof(DataAccessVocabulary.WaniKaniDocumentUrl))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Vocabulary>.Data) + "." + nameof(WaniKani.Relearn.Vocabulary.HiddenAt), nameof(DataAccessVocabulary.HiddenAt))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Vocabulary>.Data) + "." + nameof(WaniKani.Relearn.Vocabulary.LessonPosition), nameof(DataAccessVocabulary.LessonPosition))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Vocabulary>.Data) + "." + nameof(WaniKani.Relearn.Vocabulary.Level), nameof(DataAccessVocabulary.Level))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Vocabulary>.Data) + "." + nameof(WaniKani.Relearn.Vocabulary.MeaningMnemonic), nameof(DataAccessVocabulary.MeaningMnemonic))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Vocabulary>.Data) + "." + nameof(WaniKani.Relearn.Vocabulary.Meanings), nameof(DataAccessVocabulary.Meanings))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Vocabulary>.Data) + "." + nameof(WaniKani.Relearn.Vocabulary.Slug), nameof(DataAccessVocabulary.Slug))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Vocabulary>.Data) + "." + nameof(WaniKani.Relearn.Vocabulary.SpacedRepetitionSystemId), nameof(DataAccessVocabulary.SpacedRepetitionSystemId))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Vocabulary>.Data) + "." + nameof(WaniKani.Relearn.Vocabulary.ComponentSubjectIds), nameof(DataAccessVocabulary.ComponentSubjectIds))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Vocabulary>.Data) + "." + nameof(WaniKani.Relearn.Vocabulary.ContextSentences), nameof(DataAccessVocabulary.ContextSentences))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Vocabulary>.Data) + "." + nameof(WaniKani.Relearn.Vocabulary.ReadingMnemonic), nameof(DataAccessVocabulary.ReadingMnemonic))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Vocabulary>.Data) + "." + nameof(WaniKani.Relearn.Vocabulary.PartsOfSpeech), nameof(DataAccessVocabulary.PartsOfSpeech))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Vocabulary>.Data) + "." + nameof(WaniKani.Relearn.Vocabulary.PronunciationAudios), nameof(DataAccessVocabulary.PronunciationAudios))]
    [MapProperty(nameof(SingleResource<WaniKani.Relearn.Vocabulary>.Data) + "." + nameof(WaniKani.Relearn.Vocabulary.Readings), nameof(DataAccessVocabulary.Readings))]
    public partial DataAccessVocabulary Map(SingleResource<WaniKani.Relearn.Vocabulary> resource);
}
