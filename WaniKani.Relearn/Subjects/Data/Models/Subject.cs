using WaniKani.Relearn.Contracts.Subjects;

namespace WaniKani.Relearn.Subjects.Data.Models;

public record Subject
{
    // SingleResource properties
    public int Id { get; init; }
    public required string Object { get; init; }
    public string? Characters { get; init; }
    public required string MeaningMnemonic { get; init; }
    public IReadOnlyCollection<MeaningObject> Meanings { get; init; } = [];
    public IReadOnlyCollection<AuxiliaryMeaning> AuxiliaryMeanings { get; init; } = [];
    public required string Slug { get; init; }
    
    // WaniKani API URL
    public string? WaniKaniApiUrl { get; init; }
    // WaniKani website URL
    public required string WaniKaniDocumentUrl { get; init; }
    public DateTime DataUpdatedAt { get; init; }
   
    // Subject base properties
    public DateTime CreatedAt { get; init; }
    public DateTime? HiddenAt { get; init; }
    public int WaniKaniLevel { get; init; }   
    public int SpacedRepetitionSystemId { get; init; }
}