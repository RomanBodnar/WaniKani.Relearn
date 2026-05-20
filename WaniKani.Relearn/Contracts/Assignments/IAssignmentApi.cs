using WaniKani.Relearn.Contracts.Resources;

namespace WaniKani.Relearn.Contracts.Assignments;

public interface IAssignmentApi
{
    [Get("/assignments")]
    Task<CollectionResource<Assignment>> GetAssignments(AssignmentsQuery queryParams);

    [Get("/assignments/{id}")]
    Task<SingleResource<Assignment>> GetAssignment(int id);
}
