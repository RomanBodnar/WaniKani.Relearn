namespace WaniKani.Relearn.DataAccess.Models;

public record Radical : Subject
{
    public IReadOnlyCollection<int> AmalgamationSubjectIds { get; init; } = [];
    public IReadOnlyCollection<CharacterImage> CharacterImages { get; init; } = [];
}
