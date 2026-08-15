namespace WaniKani.Relearn.Subjects.Services;

public record ReadingBookmarkDto(
    int Page,
    int SentenceIndex,
    int? MinLevel,
    int? MaxLevel,
    DateTime UpdatedAt
);

public interface IUserReadingPracticeService
{
    Task<HashSet<long>> GetPracticedSentenceIdsAsync(string userId, CancellationToken cancellationToken = default);
    Task MarkSentenceAsPracticedAsync(string userId, long sentenceId, CancellationToken cancellationToken = default);
    Task UnmarkSentenceAsPracticedAsync(string userId, long sentenceId, CancellationToken cancellationToken = default);
    Task<ReadingBookmarkDto?> GetBookmarkAsync(string userId, CancellationToken cancellationToken = default);
    Task SaveBookmarkAsync(string userId, ReadingBookmarkDto bookmark, CancellationToken cancellationToken = default);
    Task ClearBookmarkAsync(string userId, CancellationToken cancellationToken = default);
    Task SetSentenceHiddenAsync(long sentenceId, bool isHidden, CancellationToken cancellationToken = default);
}
