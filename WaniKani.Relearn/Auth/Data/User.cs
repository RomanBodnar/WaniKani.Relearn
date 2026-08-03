namespace WaniKani.Relearn.Auth.Data;

public class User
{
    public required string UserId { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
}

public record UserCredentials
{
    public required string UserId { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }

    public required DateTime CreatedAt { get; set; }
    public DateTime? PasswordLastChanged { get; set; }
}