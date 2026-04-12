using WaniKani.Relearn.DataAccess;
using WaniKani.Relearn.Model.Assignments;

namespace WaniKani.Relearn.Controllers;

[ApiController]
[Route("assignments")]
public class AssignmentsController(
    IAssignmentApi assignmentApi,
    SubjectCache subjectCache
) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] SubjectType[]? subjectTypes = null,
        [FromQuery] bool? burned = null,
        [FromQuery] int[]? levels = null)
    {
        var queryParams = new AssignmentsQuery();
        queryParams.Levels = levels;
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

    [HttpGet("subjects/{subjectId}")]
    public async Task<IActionResult> GetBySubjectId(int subjectId)
    {
        var assignments = await assignmentApi.GetAssignments(new AssignmentsQuery
        {
            SubjectIds = [subjectId]
        });
        return Ok(assignments);
    }
}