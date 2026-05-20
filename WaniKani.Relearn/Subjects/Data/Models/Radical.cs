using WaniKani.Relearn.Contracts.Subjects;

namespace WaniKani.Relearn.Subjects.Data.Models;

public record Radical : Subject
{
    public IReadOnlyCollection<int> AmalgamationSubjectIds { get; init; } = [];
    public IReadOnlyCollection<CharacterImage> CharacterImages { get; init; } = [];
}
