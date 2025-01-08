namespace WaniKani.Relearn;

public record VocabularyReading
{
    /// <summary>
    /// Indicates if the reading is used to evaluate user input for correctness.
    /// </summary>
    [JsonPropertyName("accepted_answer")]
    public bool AcceptedAnswer { get; init; }

    /// <summary>
    /// Indicates priority in the WaniKani system.
    /// </summary>
    [JsonPropertyName("primary")]
    public bool Primary { get; init; }

    /// <summary>
    /// A singular subject reading.
    /// </summary>
    [JsonPropertyName("reading")]
    public string Reading { get; init; }
}
