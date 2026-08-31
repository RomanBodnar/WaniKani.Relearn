namespace WaniKani.Relearn.Account.Data;

public record WaniKaniTokenStatus(
    bool HasToken,
    string StorageType,
    int? MaxAllowedLevel);
