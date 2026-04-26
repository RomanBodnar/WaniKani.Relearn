namespace WaniKani.Relearn.Api.Response;

public record DashboardSummaryResponse
{
    public List<StageSummary> SrsDistribution { get; set; } = [];
    public ReviewsReadySummary ReviewsAwaiting { get; set; } = new(0, 0, 0, 0);
    public List<UpcomingReviewsSummary> UpcomingReviews { get; set; } = [];
    public LessonsReadySummary LessonsAwaiting { get; set; } = new(0, 0, 0, 0);
}

public record StageSummary(
    string Stage,
    int Radicals,
    int Kanji,
    int Vocabulary);

public record ReviewsReadySummary(
    int Total,
    int Radicals,
    int Kanji,
    int Vocabulary);

public record UpcomingReviewsSummary(
    string TimeLabel,
    int Radicals,
    int Kanji,
    int Vocabulary);

public record LessonsReadySummary(
    int Total,
    int Radicals,
    int Kanji,
    int Vocabulary);