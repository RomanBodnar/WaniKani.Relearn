namespace WaniKani.Relearn.Api.Response;

public record RadicalResponse
{
    // SingleResource properties
    public int Id { get; init; }
    public string Object { get; init; }
    public string Url { get; init; }
    public DateTime DataUpdatedAt { get; init; }

    // Subject base properties
    public IReadOnlyCollection<AuxiliaryMeaning> AuxiliaryMeanings { get; init; }
    public string? Characters { get; init; }
    public DateTime CreatedAt { get; init; }
    public string DocumentUrl { get; init; }
    public DateTime? HiddenAt { get; init; }
    public int LessonPosition { get; init; }
    public int Level { get; init; }
    public string MeaningMnemonic { get; init; }
    public IReadOnlyCollection<MeaningObject> Meanings { get; init; }
    public string Slug { get; init; }
    public int SpacedRepetitionSystemId { get; init; }

    // Radical specific properties
    public IReadOnlyCollection<int> AmalgamationSubjectIds { get; init; }
    public IReadOnlyCollection<CharacterImage> CharacterImages { get; init; }
}
