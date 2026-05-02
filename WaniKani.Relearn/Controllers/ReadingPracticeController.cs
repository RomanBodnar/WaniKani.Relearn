using WaniKani.Relearn.DataAccess;

namespace WaniKani.Relearn.Controllers;

[Route("api/reading-practice")]
[ApiController]
public class ReadingPracticeController(SentenceCache sentenceCache) : ControllerBase
{
    [HttpGet("sentences")]
    public IActionResult GetSentences(
        [FromQuery] int? minLevel = null,
        [FromQuery] int? maxLevel = null,
        [FromQuery] int? page = null,
        [FromQuery] int? perPage = null)
    {
        return Ok(sentenceCache.GetSentences(page, perPage, minLevel, maxLevel));
    }
}
