namespace WaniKani.Relearn;

public record ReviewStatistic
{
    /// <summary>
    /// Timestamp when the review statistic was created.
    /// </summary>
    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; init; }

    /// <summary>
    /// Indicates if the associated subject has been hidden, preventing it from appearing in lessons or reviews.
    /// </summary>
    [JsonPropertyName("hidden")]
    public bool Hidden { get; init; }

    /// <summary>
    /// Total number of correct answers submitted for the meaning of the associated subject.
    /// </summary>
    [JsonPropertyName("meaning_correct")]
    public int MeaningCorrect { get; init; }

    /// <summary>
    /// The current, uninterrupted series of correct answers given for the meaning of the associated subject.
    /// </summary>
    [JsonPropertyName("meaning_current_streak")]
    public int MeaningCurrentStreak { get; init; }

    /// <summary>
    /// Total number of incorrect answers submitted for the meaning of the associated subject
    /// </summary>
    [JsonPropertyName("meaning_incorrect")]
    public int MeaningIncorrect { get; init; }

    /// <summary>
    /// The longest, uninterrupted series of correct answers ever given for the meaning of the associated subject.
    /// </summary>
    [JsonPropertyName("meaning_max_streak")]
    public int MeaningMaxStreak { get; init; }

    /// <summary>
    /// The overall correct answer rate by the user for the subject, including both meaning and reading.
    /// </summary>
    [JsonPropertyName("percentage_correct")]
    public int PercentageCorrect { get; init; }

    /// <summary>
    /// Total number of correct answers submitted for the reading of the associated subject.
    /// </summary>
    [JsonPropertyName("reading_correct")]
    public int ReadingCorrect { get; init; }

    /// <summary>
    /// The current, uninterrupted series of correct answers given for the reading of the associated subject.
    /// </summary>
    [JsonPropertyName("reading_current_streak")]
    public int ReadingCurrentStreak { get; init; }

    /// <summary>
    /// Total number of incorrect answers submitted for the reading of the associated subject.
    /// </summary>
    [JsonPropertyName("reading_incorrect")]
    public int ReadingIncorrect { get; init; }

    /// <summary>
    /// The longest, uninterrupted series of correct answers ever given for the reading of the associated subject.
    /// </summary>
    [JsonPropertyName("reading_max_streak")]
    public int ReadingMaxStreak { get; init; }
    
    /// <summary>
    /// Unique identifier of the associated subject.
    /// </summary>
    [JsonPropertyName("subject_id")]
    public int SubjectId { get; init; }

    /// <summary>
    /// The type of the associated subject, one of: 'kana_vocabulary', 'kanji', 'radical', or 'vocabulary'.
    /// </summary>
    [JsonPropertyName("subject_type")]
    public string SubjectType { get; init; }
}
