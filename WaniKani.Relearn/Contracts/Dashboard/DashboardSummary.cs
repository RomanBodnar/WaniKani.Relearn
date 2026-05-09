namespace WaniKani.Relearn.Model.Dashboard;

public class DashboardSummary
{
    public required List<SrsDistributionItem> SrsDistribution { get; init; }
    public required LessonsReadySummary LessonsReady { get; init; }
    public required ReviewsReadySummary ReviewsAwaiting { get; init; }
}
