namespace WaniKani.Relearn.Data.Entities;

/// <summary>
/// "My Box" - Bookmarking subjects for users.
/// </summary>
public class UserMyBoxEntity
{
    public required string UserId { get; set; }
    public int SubjectId { get; set; }
    public DateTime BookmarkedAt { get; set; } = DateTime.UtcNow;
    public string? Notes { get; set; }

    public UserEntity? User { get; set; }
    public SubjectEntity? Subject { get; set; }
}

/// <summary>
/// Mark sentences as practiced so users can filter them out.
/// </summary>
public class UserPracticedSentenceEntity
{
    public required string UserId { get; set; }
    public long SentenceId { get; set; }
    public DateTime MarkedAt { get; set; } = DateTime.UtcNow;
    public int PracticeCount { get; set; } = 1;
    public DateTime LastPracticedAt { get; set; } = DateTime.UtcNow;

    public UserEntity? User { get; set; }
    public ContextSentenceEntity? Sentence { get; set; }
}

/// <summary>
/// Audit & practice history of user's attempted translations.
/// </summary>
public class UserTranslationAttemptEntity
{
    public long Id { get; set; }
    public required string UserId { get; set; }
    public long SentenceId { get; set; }
    public required string UserTranslation { get; set; }
    public string? ReferenceTranslation { get; set; }
    public bool? IsCorrect { get; set; }
    public decimal? SimilarityScore { get; set; }
    public string? Feedback { get; set; }
    public DateTime AttemptedAt { get; set; } = DateTime.UtcNow;

    public UserEntity? User { get; set; }
    public ContextSentenceEntity? Sentence { get; set; }
}
