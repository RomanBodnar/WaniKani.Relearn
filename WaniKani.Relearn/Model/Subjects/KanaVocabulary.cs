using System;

namespace WaniKani.Relearn.Model.Subjects;

public record KanaVocabulary : Subject
{
    /// <summary>
    /// A collection of context sentences. See table below for the object structure.
    /// </summary>
    [JsonPropertyName("context_sentences")]
    public IReadOnlyCollection<ContextSentence> ContextSentences { get; init; }

    /// <summary>
    /// The subject's meaning mnemonic.
    /// </summary>
    [JsonPropertyName("meaning_mnemonic")]
    public string MeaningMnemonic { get; init; }

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
}
