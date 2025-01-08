namespace WaniKani.Relearn;

public record PronunciationAudioMetadata
{
    /// <summary>
    /// The gender of the voice actor. 'male', 'female'
    /// </summary>
    [JsonPropertyName("gender")]
    public string Gender { get; init; }

    /// <summary>
    /// A unique ID shared between same source pronunciation audio.
    /// </summary>
    [JsonPropertyName("source_id")]
    public int SourceId { get; init; }

    /// <summary>
    /// Vocabulary being pronounced in kana.
    /// </summary>
    [JsonPropertyName("pronunciation")]
    public string Pronunciation { get; init; }

    /// <summary>
    /// A unique ID belonging to the voice actor.
    /// </summary>
    [JsonPropertyName("voice_actor_id")]
    public string VoiceActorId {get;}

    /// <summary>
    /// Humanized name of the voice actor.
    /// </summary>
    [JsonPropertyName("voice_actor_name")]
    public string VoiceActorName {get;}

    /// <summary>
    /// Description of the voice.
    /// </summary>
    [JsonPropertyName("voice_description")]
    public string VoiceDescription {get;}
}
