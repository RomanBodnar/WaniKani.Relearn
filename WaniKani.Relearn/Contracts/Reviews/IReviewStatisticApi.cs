namespace WaniKani.Relearn;

public interface IReviewStatisticApi
{
    [Get("/review_statistics")]
    Task<CollectionResource<ReviewStatistic>> GetReviewStatistics(ReviewStatisticsQuery queryParams);

    [Get("/review_statistics/{id}")]
    Task<SingleResource<ReviewStatistic>> GetReviewStatistic(int id);
}
