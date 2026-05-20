namespace WaniKani.Relearn.Contracts.Reading;

public record SubjectReference
{
    public int SubjectId { get; init; }
    public required string Characters { get; init; }
}
