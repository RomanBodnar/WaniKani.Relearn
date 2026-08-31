using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using WaniKani.Relearn.Subjects.Data;
using WaniKani.Relearn.Subjects.Services;
using AuthorizeAttribute = Microsoft.AspNetCore.Authorization.AuthorizeAttribute;

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

    [Authorize]
    [HttpPost("sentences/{id:long}/practiced")]
    public async Task<IActionResult> MarkPracticed([FromRoute] long id, CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        await userReadingPracticeService.MarkSentenceAsPracticedAsync(userId, id, cancellationToken);
        return Ok(new { message = "Marked as practiced", sentenceId = id });
    }

    [Authorize]
    [HttpDelete("sentences/{id:long}/practiced")]
    public async Task<IActionResult> UnmarkPracticed([FromRoute] long id, CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        await userReadingPracticeService.UnmarkSentenceAsPracticedAsync(userId, id, cancellationToken);
        return Ok(new { message = "Unmarked as practiced", sentenceId = id });
    }

    [Authorize]
    [HttpGet("bookmark")]
    public async Task<IActionResult> GetBookmark(CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var bookmark = await userReadingPracticeService.GetBookmarkAsync(userId, cancellationToken);
        if (bookmark == null) return NotFound(new { message = "No bookmark found" });

        return Ok(bookmark);
    }

    [Authorize]
    [HttpPut("bookmark")]
    public async Task<IActionResult> SaveBookmark([FromBody] ReadingBookmarkDto request, CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        await userReadingPracticeService.SaveBookmarkAsync(userId, request, cancellationToken);
        return Ok(new { message = "Bookmark saved" });
    }

    [Authorize]
    [HttpDelete("bookmark")]
    public async Task<IActionResult> ClearBookmark(CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        await userReadingPracticeService.ClearBookmarkAsync(userId, cancellationToken);
        return Ok(new { message = "Bookmark cleared" });
    }

    // todo: make it per user, so that users can hide sentences for themselves without affecting others
    [Authorize]
    [HttpPatch("sentences/{id:long}/hide")]
    public async Task<IActionResult> SetSentenceHidden([FromRoute] long id, [FromQuery] bool isHidden = true, CancellationToken cancellationToken = default)
    {
        await userReadingPracticeService.SetSentenceHiddenAsync(id, isHidden, cancellationToken);
        return Ok(new { message = isHidden ? "Sentence hidden" : "Sentence unhidden", sentenceId = id });
    }
}
