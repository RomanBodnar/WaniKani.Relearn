namespace WaniKani.Relearn.DataAccess.Models;

public record Vocabulary : Subject
{
    public IReadOnlyCollection<int> ComponentSubjectIds { get; init; } = [];
    public IReadOnlyCollection<ContextSentence> ContextSentences { get; init; } = [];
    public string? ReadingMnemonic { get; init; }
    public IReadOnlyCollection<string> PartsOfSpeech { get; init; } = [];
    public IReadOnlyCollection<PronunciationAudio> PronunciationAudios { get; init; } = [];
    public IReadOnlyCollection<VocabularyReading> Readings { get; init; } = [];
}
