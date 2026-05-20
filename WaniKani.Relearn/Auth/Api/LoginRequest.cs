namespace WaniKani.Relearn.Auth.Api;

public record class LoginRequest(
    string Email,
    string Password
);
