using WaniKani.Relearn.Contracts.Subjects;

namespace WaniKani.Relearn.Subjects.Data.Models;

public record Kanji : Subject
{
    public IReadOnlyCollection<int> AmalgamationSubjectIds { get; init; } = [];
    public IReadOnlyCollection<int> ComponentSubjectIds { get; init; } = [];
    public string? MeaningHint { get; init; }
    public string? ReadingHint { get; init; }
    public required string ReadingMnemonic { get; init; }
    public IReadOnlyCollection<KanjiReading> Readings { get; init; } = [];
    public IReadOnlyCollection<int> VisuallySimilarSubjectIds { get; init; } = [];

    public string? JlptLevel { get; init; }
    public string? JoyoGrade { get; init; }
}
