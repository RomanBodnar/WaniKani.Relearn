namespace WaniKani.Relearn.DataAccess.Models;

public class Subject
{
    // SingleResource properties
    public int Id { get; init; }
    public required string Object { get; init; }

    // WaniKani API URL
    public string? WaniKaniApiUrl { get; init; }
    public DateTime DataUpdatedAt { get; init; }
   
    // Subject base properties
    public IReadOnlyCollection<AuxiliaryMeaning> AuxiliaryMeanings { get; init; } = [];
    public string? Characters { get; init; }
    public DateTime CreatedAt { get; init; }

    // WaniKani website URL
    public required string WaniKaniDocumentUrl { get; init; }
    public DateTime? HiddenAt { get; init; }
    public int LessonPosition { get; init; }
    public int Level { get; init; }
    public required string MeaningMnemonic { get; init; }
    public IReadOnlyCollection<MeaningObject> Meanings { get; init; } = [];
    public required string Slug { get; init; }
    public int SpacedRepetitionSystemId { get; init; }
}