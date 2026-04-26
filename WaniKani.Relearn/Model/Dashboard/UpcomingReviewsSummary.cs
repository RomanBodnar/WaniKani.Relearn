namespace WaniKani.Relearn.Model.Dashboard;

public record UpcomingReviewsSummary(
    string TimeLabel,
    int Radicals,
    int Kanji,
    int Vocabulary);
