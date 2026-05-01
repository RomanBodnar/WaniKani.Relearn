namespace WaniKani.Relearn;

public record Vocabulary : Subject
{
    /// <summary>
    /// An array of numeric identifiers for the kanji that make up this vocabulary. 
    /// Note that these are the subjects that must be have passed assignments in order to 
    /// unlock this subject's assignment.
    /// </summary>
    [JsonPropertyName("component_subject_ids")]
    public IReadOnlyCollection<int> ComponentSubjectIds { get; init; }

    /// <summary>
    /// A collection of context sentences. See table below for the object structure.
    /// </summary>
    [JsonPropertyName("context_sentences")]
    public IReadOnlyCollection<ContextSentence> ContextSentences { get; init; }

    /// <summary>
    /// Parts of speech.
    /// </summary>
    [JsonPropertyName("parts_of_speech")]
    public IReadOnlyCollection<string> PartsOfSpeech { get; init; }

    /// <summary>
    /// A collection of pronunciation audio. See table below for the object structure.
    /// </summary>
    [JsonPropertyName("pronunciation_audios")]
    public IReadOnlyCollection<PronunciationAudio> PronunciationAudios { get; init; }

    /// <summary>
    /// Selected readings for the vocabulary. See table below for the object structure.
    /// </summary>
    [JsonPropertyName("readings")]
    public IReadOnlyCollection<VocabularyReading> Readings { get; init; }

    /// <summary>
    /// The subject's reading mnemonic.
    /// </summary>
    [JsonPropertyName("reading_mnemonic")]
    public string ReadingMnemonic { get; init; }
}
