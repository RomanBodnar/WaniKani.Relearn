using Riok.Mapperly.Abstractions;
using WaniKani.Relearn.Contracts.Resources;
using WaniKani.Relearn.Contracts.Subjects;
using WaniKani.Relearn.Subjects.Api.Response;

namespace WaniKani.Relearn.Subjects.Api.Mappers;

[Mapper]
public partial class VocabularyMapper
{
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.AuxiliaryMeanings), nameof(VocabularyResponse.AuxiliaryMeanings))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.Characters), nameof(VocabularyResponse.Characters))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.CreatedAt), nameof(VocabularyResponse.CreatedAt))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.DocumentUrl), nameof(VocabularyResponse.DocumentUrl))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.HiddenAt), nameof(VocabularyResponse.HiddenAt))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.LessonPosition), nameof(VocabularyResponse.LessonPosition))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.Level), nameof(VocabularyResponse.Level))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.MeaningMnemonic), nameof(VocabularyResponse.MeaningMnemonic))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.Meanings), nameof(VocabularyResponse.Meanings))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.Slug), nameof(VocabularyResponse.Slug))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.SpacedRepetitionSystemId), nameof(VocabularyResponse.SpacedRepetitionSystemId))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.ComponentSubjectIds), nameof(VocabularyResponse.ComponentSubjectIds))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.ContextSentences), nameof(VocabularyResponse.ContextSentences))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.ReadingMnemonic), nameof(VocabularyResponse.ReadingMnemonic))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.PartsOfSpeech), nameof(VocabularyResponse.PartsOfSpeech))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.PronunciationAudios), nameof(VocabularyResponse.PronunciationAudios))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(Vocabulary.Readings), nameof(VocabularyResponse.Readings))]
    public partial VocabularyResponse Map(SingleResource<Vocabulary> resource);

    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.AuxiliaryMeanings), nameof(VocabularyResponse.AuxiliaryMeanings))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.Characters), nameof(VocabularyResponse.Characters))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.CreatedAt), nameof(VocabularyResponse.CreatedAt))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.DocumentUrl), nameof(VocabularyResponse.DocumentUrl))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.HiddenAt), nameof(VocabularyResponse.HiddenAt))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.LessonPosition), nameof(VocabularyResponse.LessonPosition))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.Level), nameof(VocabularyResponse.Level))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.MeaningMnemonic), nameof(VocabularyResponse.MeaningMnemonic))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.Meanings), nameof(VocabularyResponse.Meanings))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.Slug), nameof(VocabularyResponse.Slug))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.SpacedRepetitionSystemId), nameof(VocabularyResponse.SpacedRepetitionSystemId))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.ContextSentences), nameof(VocabularyResponse.ContextSentences))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.PartsOfSpeech), nameof(VocabularyResponse.PartsOfSpeech))]
    [MapProperty(nameof(SingleResource<>.Data) + "." + nameof(KanaVocabulary.PronunciationAudios), nameof(VocabularyResponse.PronunciationAudios))]
    [MapperIgnoreTarget(nameof(VocabularyResponse.ComponentSubjectIds))] // KanaVocabulary doesn't have ComponentSubjectIds, so we ignore it here and map it manually in the other Map method
    [MapperIgnoreTarget(nameof(VocabularyResponse.ReadingMnemonic))] 
    [MapperIgnoreTarget(nameof(VocabularyResponse.Readings))] 
    public partial VocabularyResponse Map(SingleResource<KanaVocabulary> resource);


    [MapProperty(nameof(Data.Models.Vocabulary.WaniKaniApiUrl), nameof(VocabularyResponse.Url))]
    [MapProperty(nameof(Data.Models.Vocabulary.WaniKaniDocumentUrl), nameof(VocabularyResponse.DocumentUrl))]
    public partial VocabularyResponse Map(Data.Models.Vocabulary vocabulary);
}
