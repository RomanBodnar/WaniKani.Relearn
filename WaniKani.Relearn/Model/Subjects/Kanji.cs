namespace WaniKani.Relearn;

public record Kanji : Subject
{
    /// <summary>
    /// An array of numeric identifiers for the vocabulary that have the kanji as a component.
    /// </summary>
    [JsonPropertyName("amalgamation_subject_ids")] 
    public IReadOnlyCollection<int> AmalgationSubjectIds { get; init; }

    /// <summary>
    /// An array of numeric identifiers for the radicals that make up this kanji. 
    /// Note that these are the subjects that must have passed assignments in order to 
    /// unlock this subject's assignment.
    /// </summary>
    [JsonPropertyName("component_subject_ids")] 
    public IReadOnlyCollection<int> ComponentSubjectIds { get; init; }

    /// <summary>
    /// Meaning hint for the kanji.
    /// </summary>
    [JsonPropertyName("meaning_hint")] 
    public string? MeaningHint { get; init; }

    /// <summary>
    /// Reading hint for the kanji.
    /// </summary>
    [JsonPropertyName("reading_hint")] 
    public string? ReadingHint { get; init; }

    /// <summary>
    /// The kanji's reading mnemonic.
    /// </summary>
    [JsonPropertyName("reading_mnemonic")] 
    public string ReadingMnemonic { get; init; }

    /// <summary>
    /// Selected readings for the kanji. See table below for the object structure.
    /// </summary>
    [JsonPropertyName("readings")] 
    public IReadOnlyCollection<KanjiReading> Readings { get; init; }

    /// <summary>
    /// An array of numeric identifiers for kanji which are visually similar to the kanji in question.
    /// </summary>
    [JsonPropertyName("visually_similar_subject_ids")] 
    public IReadOnlyCollection<int> VisuallySimilarSubjectIds { get; init; }
}
