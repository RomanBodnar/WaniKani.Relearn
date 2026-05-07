namespace WaniKani.Relearn;

public record AuxiliaryMeaning
{
    /// <summary>
    /// A singular subject meaning.
    /// </summary>
    [JsonPropertyName("meaning")]
    public string Meaning { get; init; }

    /// <summary>
    /// Either 'whitelist' or 'blacklist'. 
    /// When evaluating user input, whitelisted meanings are used to match for correctness. 
    /// Blacklisted meanings are used to match for incorrectness.
    /// </summary>
    [JsonPropertyName("type")]
    public string Type { get; init; }
}
