using WaniKani.Relearn.Subjects.Data;

namespace WaniKani.Relearn.Subjects.Api;

[ApiController]
[Route("api/user/subjects")]
public class UserSubjectsController(
    SubjectCache subjectCache) : ControllerBase
{
    [HttpPost("{subjectId:int}")]
    public async Task<IActionResult> BookmarkSubjectForUser([FromRoute] int subjectId)
    {
        throw new NotImplementedException("Bookmarking subjects is not implemented yet.");
    }
}