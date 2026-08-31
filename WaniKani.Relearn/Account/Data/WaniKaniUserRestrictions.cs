namespace WaniKani.Relearn.Account.Data;

public record WaniKaniUserRestrictions(
    int MaxAllowedLevel,
    DateTime? PeriodEndsAt);