namespace WaniKani.Relearn.Api.Response;

public record KanaVocabularyResponse
{
    // SingleResource properties
    public int Id { get; init; }
    public required string Object { get; init; }
    public required string Url { get; init; }
    public DateTime DataUpdatedAt { get; init; }

    // Subject base properties
    public required IReadOnlyCollection<AuxiliaryMeaning> AuxiliaryMeanings { get; init; }
    public required string Characters { get; init; }
    public DateTime CreatedAt { get; init; }
    public required string DocumentUrl { get; init; }
    public DateTime? HiddenAt { get; init; }
    public int LessonPosition { get; init; }
    public int Level { get; init; }
    public required string MeaningMnemonic { get; init; }
    public required IReadOnlyCollection<MeaningObject> Meanings { get; init; }
    public required string Slug { get; init; }
    public int SpacedRepetitionSystemId { get; init; }

    // KanaVocabulary specific properties
    public required IReadOnlyCollection<ContextSentence> ContextSentences { get; init; }
    public required IReadOnlyCollection<string> PartsOfSpeech { get; init; }
    public required IReadOnlyCollection<PronunciationAudio> PronunciationAudios { get; init; }
}
