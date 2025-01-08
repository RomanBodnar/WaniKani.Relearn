using Microsoft.AspNetCore.Mvc;

namespace WaniKani.Relearn.Controllers;

[Route("assignments")]
public class AssignmentsController(
    IAssignmentApi assignmentApi
) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var queryParams = new AssignmentsQuery();
        queryParams.Levels = [23];
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