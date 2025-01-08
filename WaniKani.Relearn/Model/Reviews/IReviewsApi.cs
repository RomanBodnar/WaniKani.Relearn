namespace WaniKani.Relearn;

public interface IReviewsApi
{
    [Get("/reviews")]
    Task<CollectionResource<Review>> GetReviews(ReviewsQuery queryParams);

    [Get("/reviews/{id}")]
    Task<SingleResource<Review>> GetReview(int id);
}
