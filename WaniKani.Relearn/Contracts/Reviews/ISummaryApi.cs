using WaniKani.Relearn.Contracts.Resources;

namespace WaniKani.Relearn.Contracts.Reviews;

public interface ISummaryApi
{
    [Get("/summary")]
    Task<SingleResource<Summary>> GetSummary();
}
