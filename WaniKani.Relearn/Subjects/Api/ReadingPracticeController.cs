using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using WaniKani.Relearn.Subjects.Data;
using WaniKani.Relearn.Subjects.Services;

namespace WaniKani.Relearn.Subjects.Api;

[Route("api/reading-practice")]
[ApiController]
public class ReadingPracticeController(
    SentenceCache sentenceCache,
    IUserReadingPracticeService userReadingPracticeService
) : ControllerBase
{
    [HttpGet("sentences")]
    public async Task<IActionResult> GetSentences(
        [FromQuery] int? minLevel = null,
        [FromQuery] int? maxLevel = null,
        [FromQuery] int? page = null,
        [FromQuery] int? perPage = null,
        [FromQuery] string status = "all",
        CancellationToken cancellationToken = default)
    {
        ISet<long>? practicedSentenceIds = null;
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!string.IsNullOrEmpty(userId))
        {
            practicedSentenceIds = await userReadingPracticeService.GetPracticedSentenceIdsAsync(userId, cancellationToken);
        }

        var result = sentenceCache.GetSentences(page, perPage, minLevel, maxLevel, status, practicedSentenceIds);
        return Ok(result);
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [HttpPost("sentences/{id:long}/practiced")]
    public async Task<IActionResult> MarkPracticed([FromRoute] long id, CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        await userReadingPracticeService.MarkSentenceAsPracticedAsync(userId, id, cancellationToken);
        return Ok(new { message = "Marked as practiced", sentenceId = id });
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [HttpDelete("sentences/{id:long}/practiced")]
    public async Task<IActionResult> UnmarkPracticed([FromRoute] long id, CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        await userReadingPracticeService.UnmarkSentenceAsPracticedAsync(userId, id, cancellationToken);
        return Ok(new { message = "Unmarked as practiced", sentenceId = id });
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [HttpGet("bookmark")]
    public async Task<IActionResult> GetBookmark(CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var bookmark = await userReadingPracticeService.GetBookmarkAsync(userId, cancellationToken);
        if (bookmark == null) return NotFound(new { message = "No bookmark found" });

        return Ok(bookmark);
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [HttpPut("bookmark")]
    public async Task<IActionResult> SaveBookmark([FromBody] ReadingBookmarkDto request, CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        await userReadingPracticeService.SaveBookmarkAsync(userId, request, cancellationToken);
        return Ok(new { message = "Bookmark saved" });
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [HttpDelete("bookmark")]
    public async Task<IActionResult> ClearBookmark(CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        await userReadingPracticeService.ClearBookmarkAsync(userId, cancellationToken);
        return Ok(new { message = "Bookmark cleared" });
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [HttpPatch("sentences/{id:long}/hide")]
    public async Task<IActionResult> SetSentenceHidden([FromRoute] long id, [FromQuery] bool isHidden = true, CancellationToken cancellationToken = default)
    {
        await userReadingPracticeService.SetSentenceHiddenAsync(id, isHidden, cancellationToken);
        return Ok(new { message = isHidden ? "Sentence hidden" : "Sentence unhidden", sentenceId = id });
    }
}
