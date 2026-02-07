using WaniKani.Relearn.Model.Assignments;

namespace WaniKani.Relearn.Controllers;

[ApiController]
[Route("assignments")]
public class AssignmentsController(
    IAssignmentApi assignmentApi
) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] SubjectType[]? subjectTypes = null,
        [FromQuery] bool? burned = null)
    {
        var queryParams = new AssignmentsQuery();
        queryParams.Levels = [23, 1];
        queryParams.Burned = burned;
        if (subjectTypes is not [])
        {
            queryParams.SubjectTypes = subjectTypes?.Select(st => st.ToSnakeCaseString()).ToArray() ?? null;
        }

        var assignments = await assignmentApi.GetAssignments(queryParams);
        return Ok(assignments);
    }

    [HttpGet("{assignmentId}")]
    public async Task<IActionResult> Get(int assignmentId)
    {
        var assignment = await assignmentApi.GetAssignment(assignmentId);
        return Ok(assignment);
    }
}