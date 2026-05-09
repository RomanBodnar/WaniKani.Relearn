namespace WaniKani.Relearn.Model.Reading;

public record SubjectReference
{
    public int SubjectId { get; init; }
    public required string Characters { get; init; }
}
