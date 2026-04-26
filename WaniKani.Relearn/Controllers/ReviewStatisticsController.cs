namespace WaniKani.Relearn.Controllers;

[ApiController]
[Route("/reviews")]
public class ReviewStatisticsController(
    IReviewStatisticApi reviewStatisticApi
) : ControllerBase
{
    [HttpGet("statistics")]
    public async Task<IActionResult> GetReviewStatistics(string[]? resources = null)
    {
        var reviewStatisticsQuery = new ReviewStatisticsQuery
        {
            SubjectTypes = resources ?? [Resources.Kanji]
        };
        var statistics = await reviewStatisticApi.GetReviewStatistics(reviewStatisticsQuery);
        return Ok(statistics);
    }
}
