namespace WaniKani.Relearn.Data.Entities;

public class ContextSentenceEntity
{
    public long Id { get; set; }
    public int? SubjectId { get; set; }
    public required string Ja { get; set; }
    public required string En { get; set; }
    public int Level { get; set; } = 1;
    public string? DataJson { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public SubjectEntity? Subject { get; set; }
    public ICollection<UserPracticedSentenceEntity> PracticedByUsers { get; set; } = [];
    public ICollection<UserTranslationAttemptEntity> TranslationAttempts { get; set; } = [];
}

