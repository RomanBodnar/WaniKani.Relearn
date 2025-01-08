namespace WaniKani.Relearn;

public class CharacterImage
{
    /// <summary>
    /// The location of the image.
    /// </summary>
    public string Url { get; init; }

    /// <summary>
    /// The content type of the image. The API only delivers image/svg+xml.
    /// </summary>
    public string ContentType { get; init; }

    /// <summary>
    /// Details about the image. Each content_type returns a uniquely structured object.
    /// </summary>
    public ImageSvgXmlMetadata Metadata { get; init; }
}

public class ImageSvgXmlMetadata
{
    public bool InlineStyles { get; init; }
}
