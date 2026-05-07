namespace WaniKani.Relearn;

public record ContextSentence
{
    /// <summary>
    /// English translation of the sentence
    /// </summary>
    [JsonPropertyName("en")]
    public string En { get; init; }

    /// <summary>
    /// Japanese context sentence
    /// </summary>
    [JsonPropertyName("ja")]
    public string Ja { get; init; }
}
