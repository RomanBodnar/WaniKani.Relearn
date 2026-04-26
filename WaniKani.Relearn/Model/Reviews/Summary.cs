namespace WaniKani.Relearn.Model.Reviews;

public record Summary
{
    /// <summary>
    /// Details about subjects available for lessons. See table below for object structure.
    /// </summary>
    [JsonPropertyName("lessons")]
    public IReadOnlyCollection<LessonSummary> Lessons { get; init; } = [];

    /// <summary>
    /// Details about subjects available for reviews now and in the next 24 hours by the hour (total of 25 objects). See table below for object structure.
    /// </summary>
    [JsonPropertyName("reviews")]
    public IReadOnlyCollection<ReviewSummary> Reviews { get; init; } = [];

    /// <summary>
    /// Earliest date when the reviews are available. Is null when the user has no reviews scheduled.
    /// </summary>
    [JsonPropertyName("next_reviews_at")]
    public DateTime? NextReviewsAt { get; init; }
}

public record LessonSummary
{
    /// <summary>
    /// Collection of unique identifiers for subjects.
    /// </summary>
    [JsonPropertyName("subject_ids")]
    public IReadOnlyCollection<int> SubjectIds { get; init; }

    /// <summary>
    /// When the paired subject_ids are available for lessons. Always beginning of the current hour when the API endpoint is accessed.
    /// </summary>
    [JsonPropertyName("available_at")]
    public DateTime AvailableAt { get; init; }
}

public record ReviewSummary
{
    /// <summary>
    /// Collection of unique identifiers for subjects.
    /// </summary>
    [JsonPropertyName("subject_ids")]
    public IReadOnlyCollection<int> SubjectIds { get; init; }

    /// <summary>
    /// When the paired subject_ids are available for reviews. All timestamps are the top of an hour.
    /// </summary>
    [JsonPropertyName("available_at")]
    public DateTime AvailableAt { get; init; }
}
