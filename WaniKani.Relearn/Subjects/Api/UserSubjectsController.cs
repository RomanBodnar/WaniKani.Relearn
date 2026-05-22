using System.Security.Claims;
using WaniKani.Relearn.Subjects.Data;

namespace WaniKani.Relearn.Subjects.Api;

[ApiController]
[Route("api/user/subjects")]
public class UserSubjectsController(
    IUserSubjectsService userSubjectsService) : ControllerBase
{
    [HttpPost("{subjectId:int}")]
    public async Task<IActionResult> BookmarkSubjectForUser([FromRoute] int subjectId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        var studyItem = await userSubjectsService.BookmarkSubjectForUser(userId, subjectId);
        return Ok(studyItem);
    }

    [HttpGet]
    public async Task<IActionResult> GetBookmarkedSubjectsForUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        var studyItems = await userSubjectsService.GetBookmarkedSubjectsForUser(userId);
        return Ok(studyItems);
    }

    [HttpDelete("{subjectId:int}")]
    public async Task<IActionResult> RemoveBookmarkForSubject([FromRoute] int subjectId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        await userSubjectsService.RemoveBookmarkedSubjectForUser(userId, subjectId);
        return Ok();
    }
}