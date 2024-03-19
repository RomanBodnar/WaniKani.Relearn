namespace WaniKani.Relearn;

public class Kanji : Subject
{
    /// <summary>
    /// An array of numeric identifiers for the vocabulary that have the kanji as a component.
    /// </summary>
    public IReadOnlyCollection<int> AmalgationSubjectIds { get; }

    /// <summary>
    /// An array of numeric identifiers for the radicals that make up this kanji. 
    /// Note that these are the subjects that must have passed assignments in order to 
    /// unlock this subject's assignment.
    /// </summary>
    public IReadOnlyCollection<int> ComponentSubjectIds { get; }

    /// <summary>
    /// Meaning hint for the kanji.
    /// </summary>
    public string? MeaningHint { get; }

    /// <summary>
    /// Reading hint for the kanji.
    /// </summary>
    public string? ReadingHint { get; }

    /// <summary>
    /// The kanji's reading mnemonic.
    /// </summary>
    public string ReadingMnemonic { get; }

    /// <summary>
    /// Selected readings for the kanji. See table below for the object structure.
    /// </summary>
    public IReadOnlyCollection<KanjiReading> Readings { get; }

    /// <summary>
    /// An array of numeric identifiers for kanji which are visually similar to the kanji in question.
    /// </summary>
    public IReadOnlyCollection<int> VisuallySimilarSubjectIds { get; }
}
