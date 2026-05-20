using Riok.Mapperly.Abstractions;
using WaniKani.Relearn.Contracts.Resources;
using WaniKani.Relearn.Contracts.Subjects;
using DataAccessVocabulary = WaniKani.Relearn.Subjects.Data.Models.Vocabulary;

namespace WaniKani.Relearn.Subjects.Data.Mappers;

[Mapper]
public partial class VocabularyMapper
{
    [MapProperty(nameof(SingleResource<>.Id), nameof(DataAccessVocabulary.Id))]
    [MapProperty(nameof(SingleResource<>.Object), nameof(DataAccessVocabulary.Object))]
    [MapProperty(nameof(SingleResource<>.Url), nameof(DataAccessVocabulary.WaniKaniApiUrl))]
    [MapProperty(nameof(SingleResource<>.DataUpdatedAt), nameof(DataAccessVocabulary.DataUpdatedAt))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.AuxiliaryMeanings), nameof(DataAccessVocabulary.AuxiliaryMeanings))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.Characters), nameof(DataAccessVocabulary.Characters))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.CreatedAt), nameof(DataAccessVocabulary.CreatedAt))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.DocumentUrl), nameof(DataAccessVocabulary.WaniKaniDocumentUrl))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.HiddenAt), nameof(DataAccessVocabulary.HiddenAt))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.Level), nameof(DataAccessVocabulary.WaniKaniLevel))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.MeaningMnemonic), nameof(DataAccessVocabulary.MeaningMnemonic))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.Meanings), nameof(DataAccessVocabulary.Meanings))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.Slug), nameof(DataAccessVocabulary.Slug))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.SpacedRepetitionSystemId), nameof(DataAccessVocabulary.SpacedRepetitionSystemId))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.ComponentSubjectIds), nameof(DataAccessVocabulary.ComponentSubjectIds))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.ContextSentences), nameof(DataAccessVocabulary.ContextSentences))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.ReadingMnemonic), nameof(DataAccessVocabulary.ReadingMnemonic))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.PartsOfSpeech), nameof(DataAccessVocabulary.PartsOfSpeech))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.PronunciationAudios), nameof(DataAccessVocabulary.PronunciationAudios))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.Readings), nameof(DataAccessVocabulary.Readings))]
    public partial DataAccessVocabulary Map(SingleResource<Vocabulary> resource);

}
