namespace WaniKani.Relearn;

public record CharacterImage
{
    /// <summary>
    /// The location of the image.
    /// </summary>
    [JsonPropertyName("url")]
    public string Url { get; init; }

    /// <summary>
    /// The content type of the image. The API only delivers image/svg+xml.
    /// </summary>
    [JsonPropertyName("content_type")]
    public string ContentType { get; init; }

    /// <summary>
    /// Details about the image. Each content_type returns a uniquely structured object.
    /// </summary>
    [JsonPropertyName("metadata")]
    public Dictionary<string, string> Metadata { get; init; }
}

public class ImageSvgXmlMetadata
{
    public bool InlineStyles { get; init; }
}
