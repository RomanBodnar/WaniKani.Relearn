namespace WaniKani.Relearn.Auth.Data;

public record WaniKaniTokenStatus(
    string UserId,
    bool IsSet,
    int? MaxAllowedLevel,
    string? Token);
