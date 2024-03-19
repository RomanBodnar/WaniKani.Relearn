namespace WaniKani.Relearn;

public class Vocabulary : Subject
{
    /// <summary>
    /// An array of numeric identifiers for the kanji that make up this vocabulary. 
    /// Note that these are the subjects that must be have passed assignments in order to 
    /// unlock this subject's assignment.
    /// </summary>
    public IReadOnlyCollection<int> ComponentSubjectIds { get; }

    /// <summary>
    /// A collection of context sentences. See table below for the object structure.
    /// </summary>
    public IReadOnlyCollection<ContextSentence> ContextSentences { get; }

    /// <summary>
    /// The subject's meaning mnemonic.
    /// </summary>
    public string MeaningMnemonic { get; }

    /// <summary>
    /// Parts of speech.
    /// </summary>
    public IReadOnlyCollection<string> PartsOfSpeech { get; }

    /// <summary>
    /// A collection of pronunciation audio. See table below for the object structure.
    /// </summary>
    public IReadOnlyCollection<PronunciationAudio> PronunciationAudios { get; }

    /// <summary>
    /// Selected readings for the vocabulary. See table below for the object structure.
    /// </summary>
    public IReadOnlyCollection<VocabularyReading> Readings { get; }

    /// <summary>
    /// The subject's reading mnemonic.
    /// </summary>
    public string ReadingMnemonic { get; }
}
