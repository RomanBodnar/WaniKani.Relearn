namespace WaniKani.Relearn;

public record Review
{
    /// <summary>
    /// Unique identifier of the associated assignment.
    /// </summary>
    [JsonPropertyName("assignment_id")]
    public int AssignmentId { get; init; }

    /// <summary>
    /// Timestamp when the review was created.
    /// </summary>
    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; init; }

    /// <summary>
    /// The SRS stage interval calculated from the number of correct and incorrect answers,
    /// with valid values ranging from 1 to 9
    /// </summary>
    [JsonPropertyName("ending_srs_stage")]
    public int EndSrsStage { get; init; }

    /// <summary>
    /// The number of times the user has answered the meaning incorrectly.
    /// </summary>
    [JsonPropertyName("incorrect_meaning_answers")]
    public int IncorrectMeaningAnswers { get; init; }

    /// <summary>
    /// The number of times the user has answered the reading incorrectly.
    /// </summary>
    [JsonPropertyName("incorrect_reading_answers")]
    public int IncorrectReadingAnswers { get; init; }

    /// <summary>
    /// Unique identifier of the associated spaced_repetition_system.
    /// </summary>
    [JsonPropertyName("spaced_repetition_system_id")]
    public int SpacedRepetitionSystemId { get; init; }

    /// <summary>
    /// The starting SRS stage interval, with valid values ranging from 1 to 8
    /// </summary>
    [JsonPropertyName("starting_srs_stage")]
    public int StartingSrsStage { get; init; }

    /// <summary>
    /// Unique identifier of the associated subject.
    /// </summary>
    [JsonPropertyName("starting_srs_stage")]
    public int SubjectId { get; init; }
}
