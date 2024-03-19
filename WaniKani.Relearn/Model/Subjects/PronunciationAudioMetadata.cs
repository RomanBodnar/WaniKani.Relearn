namespace WaniKani.Relearn;

public class PronunciationAudioMetadata
{
    /// <summary>
    /// The gender of the voice actor. 'male', 'female'
    /// </summary>
    public string Gender { get; }

    /// <summary>
    /// A unique ID shared between same source pronunciation audio.
    /// </summary>
    public int SourceId { get; }

    /// <summary>
    /// Vocabulary being pronounced in kana.
    /// </summary>
    public string Pronunciation { get; }

    /// <summary>
    /// A unique ID belonging to the voice actor.
    /// </summary>
    public string VoiceActorId {get;}

    /// <summary>
    /// Humanized name of the voice actor.
    /// </summary>
    public string VoiceActorName {get;}

    /// <summary>
    /// Description of the voice.
    /// </summary>
    public string VoiceDescription {get;}
}
