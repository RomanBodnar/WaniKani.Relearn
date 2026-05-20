using Riok.Mapperly.Abstractions;
using WaniKani.Relearn.Contracts.Resources;
using WaniKani.Relearn.Contracts.Subjects;
using DataAccessVocabulary = WaniKani.Relearn.Subjects.Data.Models.Vocabulary;

namespace WaniKani.Relearn.Subjects.Data.Mappers;

[Mapper]
public partial class VocabularyMapper
{
    [MapProperty(nameof(SingleResource<Vocabulary>.Id), nameof(DataAccessVocabulary.Id))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Object), nameof(DataAccessVocabulary.Object))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Url), nameof(DataAccessVocabulary.WaniKaniApiUrl))]
    [MapProperty(nameof(SingleResource<Vocabulary>.DataUpdatedAt), nameof(DataAccessVocabulary.DataUpdatedAt))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.AuxiliaryMeanings), nameof(DataAccessVocabulary.AuxiliaryMeanings))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.Characters), nameof(DataAccessVocabulary.Characters))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.CreatedAt), nameof(DataAccessVocabulary.CreatedAt))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.DocumentUrl), nameof(DataAccessVocabulary.WaniKaniDocumentUrl))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.HiddenAt), nameof(DataAccessVocabulary.HiddenAt))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.LessonPosition), nameof(DataAccessVocabulary.LessonPosition))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.Level), nameof(DataAccessVocabulary.Level))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.MeaningMnemonic), nameof(DataAccessVocabulary.MeaningMnemonic))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.Meanings), nameof(DataAccessVocabulary.Meanings))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.Slug), nameof(DataAccessVocabulary.Slug))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.SpacedRepetitionSystemId), nameof(DataAccessVocabulary.SpacedRepetitionSystemId))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.ComponentSubjectIds), nameof(DataAccessVocabulary.ComponentSubjectIds))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.ContextSentences), nameof(DataAccessVocabulary.ContextSentences))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.ReadingMnemonic), nameof(DataAccessVocabulary.ReadingMnemonic))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.PartsOfSpeech), nameof(DataAccessVocabulary.PartsOfSpeech))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.PronunciationAudios), nameof(DataAccessVocabulary.PronunciationAudios))]
    [MapProperty(nameof(SingleResource<Vocabulary>.Data) + "." + nameof(Vocabulary.Readings), nameof(DataAccessVocabulary.Readings))]
    public partial DataAccessVocabulary Map(SingleResource<Vocabulary> resource);
    
}
