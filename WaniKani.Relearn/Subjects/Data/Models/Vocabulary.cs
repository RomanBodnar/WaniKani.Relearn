
namespace WaniKani.Relearn.Subjects.Data.Models;

public record Vocabulary : Subject
{
    public IReadOnlyCollection<int> ComponentSubjectIds { get; init; } = [];
    public IReadOnlyCollection<ContextSentence> ContextSentences { get; init; } = [];
    public string? ReadingMnemonic { get; init; }
    public IReadOnlyCollection<string> PartsOfSpeech { get; init; } = [];
    public IReadOnlyCollection<PronunciationAudio> PronunciationAudios { get; init; } = [];
    public IReadOnlyCollection<VocabularyReading> Readings { get; init; } = [];
}

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

public record VocabularyReading
{
    /// <summary>
    /// Indicates if the reading is used to evaluate user input for correctness.
    /// </summary>
    [JsonPropertyName("accepted_answer")]
    public bool AcceptedAnswer { get; init; }

    /// <summary>
    /// Indicates priority in the WaniKani system.
    /// </summary>
    [JsonPropertyName("primary")]
    public bool Primary { get; init; }

    /// <summary>
    /// A singular subject reading.
    /// </summary>
    [JsonPropertyName("reading")]
    public string Reading { get; init; }
}