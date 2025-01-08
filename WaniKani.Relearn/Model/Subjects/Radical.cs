namespace WaniKani.Relearn;

public record Radical : Subject
{
    /// <summary>
    /// An array of numeric identifiers for the kanji that have the radical as a component.
    /// </summary>
    [JsonPropertyName("amalgamation_subject_ids")]
    public IReadOnlyCollection<string> AmalgationSubjectIds { get; init; }

    /// <summary>
    /// Unlike kanji and vocabulary, radicals can have a null value for characters. 
    /// Not all radicals have a UTF entry, so the radical must be visually represented with an image instead.
    /// </summary>
    [JsonPropertyName("characters")]
    public string? Characters { get; init; }

    /// <summary>
    /// A collection of images of the radical. 
    /// </summary>
    [JsonPropertyName("character_images")]
    public IReadOnlyCollection<CharacterImage> CharacterImages { get; init; }
}
