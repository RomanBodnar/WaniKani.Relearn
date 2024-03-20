using Refit;

namespace WaniKani.Relearn;

public interface IAssignmentApi
{
    [Get("/assignments")]
    Task<CollectionResource> GetAssignments();

    [Get("/assignments/{id}")]
    Task<SingleResource> GetAssignment(int id);
}
