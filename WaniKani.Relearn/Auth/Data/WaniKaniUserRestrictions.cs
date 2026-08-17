namespace WaniKani.Relearn.Auth.Data;

public record WaniKaniUserRestrictions(
    int MaxAllowedLevel,
    DateTime? PeriodEndsAt);