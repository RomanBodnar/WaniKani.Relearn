namespace WaniKani.Relearn;

public class PronunciationAudio
{
    /// <summary>
    /// The location of the audio.
    /// </summary>
    public string Url { get; init; }

    /// <summary>
    /// The content type of the audio. Currently the API delivers 'audio/mpeg' and 'audio/ogg'.
    /// </summary>
    public string ContentType { get; init; }

    /// <summary>
    /// Details about the pronunciation audio. See table below for details.
    /// </summary>
    public PronunciationAudioMetadata Metadata { get; init; }
}
