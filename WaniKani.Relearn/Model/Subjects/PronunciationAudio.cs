namespace WaniKani.Relearn;

public record PronunciationAudio
{
    /// <summary>
    /// The location of the audio.
    /// </summary>
    [JsonPropertyName("url")]
    public string Url { get; init; }

    /// <summary>
    /// The content type of the audio. Currently the API delivers 'audio/mpeg' and 'audio/ogg'.
    /// </summary>
    [JsonPropertyName("content_type")]
    public string ContentType { get; init; }

    /// <summary>
    /// Details about the pronunciation audio. See table below for details.
    /// </summary>
    [JsonPropertyName("metadata")]
    public PronunciationAudioMetadata Metadata { get; init; }
}
