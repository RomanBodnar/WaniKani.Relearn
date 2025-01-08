namespace WaniKani.Relearn.Controllers;

[ApiController]
[Route("/reviews")]
public class ReviewStatisticsController(
    IReviewStatisticApi reviewStatisticApi
) : ControllerBase
{
    [HttpGet("statistics")]
    public async Task<IActionResult> GetReviewStatistics()
    {
        var reviewStatisticsQuery = new ReviewStatisticsQuery();
        reviewStatisticsQuery.SubjectTypes = [Resources.Kanji];
        var statistics = await reviewStatisticApi.GetReviewStatistics(reviewStatisticsQuery);
        return Ok(statistics);
    }
}
