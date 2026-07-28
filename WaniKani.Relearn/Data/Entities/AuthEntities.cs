namespace WaniKani.Relearn.Data.Entities;

public class UserEntity
{
    public required string Id { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public UserCredentialsEntity? Credentials { get; set; }
    public ICollection<UserMyBoxEntity> MyBoxItems { get; set; } = [];
    public ICollection<UserPracticedSentenceEntity> PracticedSentences { get; set; } = [];
    public ICollection<UserTranslationAttemptEntity> TranslationAttempts { get; set; } = [];
}

public class UserCredentialsEntity
{
    public required string UserId { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? PasswordLastChanged { get; set; }

    // Navigation property
    public UserEntity? User { get; set; }
}
