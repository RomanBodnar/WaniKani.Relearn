namespace WaniKani.Relearn.Auth;

public record class RegisterUserRequest(
    string Username,
    string Password,
    string Email
);
