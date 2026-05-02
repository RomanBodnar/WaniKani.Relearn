namespace WaniKani.Relearn.Api.Response;

public record DashboardSummaryResponse
{
    public List<StageSummary> SrsDistribution { get; set; } = [];
    public ReviewsReadySummary ReviewsAwaiting { get; set; } = new(0, 0, 0, 0);
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

public record LessonsReadySummary(
    int Total,
    int Radicals,
    int Kanji,
    int Vocabulary);