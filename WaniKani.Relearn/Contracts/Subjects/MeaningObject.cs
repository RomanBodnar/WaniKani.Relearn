namespace WaniKani.Relearn;

public record MeaningObject
{
    /// <summary>
    /// A singular subject meaning.
    /// </summary>
    [JsonPropertyName("meaning")]
    public string Meaning { get; init; }

    /// <summary>
    /// Indicates priority in the WaniKani system.
    /// </summary>
    [JsonPropertyName("primary")]
    public bool Primary { get; init; }

    /// <summary>
    /// Indicates if the meaning is used to evaluate user input for correctness.
    /// </summary>
    [JsonPropertyName("accepted_answer")]
    public bool AcceptedAnswer { get; init; }
}
