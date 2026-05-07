namespace WaniKani.Relearn.Model.Reviews;

public interface ISummaryApi
{
    [Get("/summary")]
    Task<SingleResource<Summary>> GetSummary();
}
