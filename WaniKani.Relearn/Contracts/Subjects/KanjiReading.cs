namespace WaniKani.Relearn;

public record KanjiReading
{
    /// <summary>
    /// A singular subject reading.
    /// </summary>
    [JsonPropertyName("reading")]
    public string Reading { get; init; }

    /// <summary>
    /// Indicates priority in the WaniKani system.
    /// </summary>
    [JsonPropertyName("primary")]
    public bool Primary { get; init; }

    /// <summary>
    /// Indicates if the reading is used to evaluate user input for correctness.
    /// </summary>
    [JsonPropertyName("accepted_answer")]
    public bool AcceptedAnswer { get; init; }

    /// <summary>
    /// The kanji reading's classfication: kunyomi, nanori, or onyomi.
    /// </summary>
    [JsonPropertyName("type")]
    public string Type { get; init; }
}
