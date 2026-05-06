namespace WaniKani.Relearn.DataAccess.Models;

public class Kanji : Subject
{
    public IReadOnlyCollection<int> AmalgamationSubjectIds { get; init; } = [];
    public IReadOnlyCollection<int> ComponentSubjectIds { get; init; } = [];
    public string? MeaningHint { get; init; }
    public string? ReadingHint { get; init; }
    public required string ReadingMnemonic { get; init; }
    public IReadOnlyCollection<KanjiReading> Readings { get; init; } = [];
    public IReadOnlyCollection<int> VisuallySimilarSubjectIds { get; init; } = [];
}
