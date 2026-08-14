using WaniKani.Relearn.Subjects.Data;

namespace WaniKani.Relearn.Subjects.Api;

[Route("api/reading-practice")]
[ApiController]
public class ReadingPracticeController(SentenceCache sentenceCache) : ControllerBase
{
    [HttpGet("sentences")]
    public async Task<IActionResult> GetSentences(
        [FromQuery] int? minLevel = null,
        [FromQuery] int? maxLevel = null,
        [FromQuery] int? page = null,
        [FromQuery] int? perPage = null)
    {
        return Ok(await sentenceCache.GetSentencesAsync(page, perPage, minLevel, maxLevel));
    }
}
