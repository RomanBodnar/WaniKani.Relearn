namespace WaniKani.Relearn.Contracts.Reading;

public record ReadingSentence
{
    public required string Ja { get; init; }
    public required string En { get; init; }
    public int Level { get; init; }
    public required List<SubjectReference> SourceVocabulary { get; init; }
    public required List<SubjectReference> KanjiInSentence { get; init; }
}
