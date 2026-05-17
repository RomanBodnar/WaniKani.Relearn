namespace WaniKani.Relearn.Auth;

public record class LoginRequest(
    string Email,
    string Password
);
