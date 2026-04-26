namespace WaniKani.Relearn.Model.Dashboard;

public class DashboardSummary
{
    public List<SrsDistributionItem> SrsDistribution { get; init; }
    public LessonsReadySummary LessonsReady { get; init; }
    public ReviewsReadySummary ReviewsAwaiting { get; init; }
}
