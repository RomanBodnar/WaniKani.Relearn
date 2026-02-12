using WaniKani.Relearn.Model.Assignments;
using WaniKani.Relearn.Model.Subjects;

namespace WaniKani.Relearn.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SubjectsController(
    SubjectsService subjectsService) : ControllerBase
{
    [HttpGet("{type}")]
    public async Task<IActionResult> GetSubjects(
        [FromRoute] SubjectType type,
        [FromQuery] int? level = null
    )
    {
        var subjects = await subjectsService.GetSubjects(type, level);
        return Ok(subjects);
    }
}
