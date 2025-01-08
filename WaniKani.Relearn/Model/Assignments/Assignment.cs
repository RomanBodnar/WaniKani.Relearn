namespace WaniKani.Relearn;

public record Assignment
{
    /// <summary>
    /// Timestamp when the related subject will be available in the user's review queue.
    /// </summary>
    [JsonPropertyName("available_at")]
    public DateTime? AvailableAt { get; init; }

    /// <summary>
    /// Timestamp when the user reaches SRS stage 9 the first time.
    /// </summary>
    [JsonPropertyName("burned_at")]
    public DateTime? BurnedAt { get; init; }

    /// <summary>
    /// Timestamp when the assignment was created.
    /// </summary>
    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; init; }
    
    /// <summary>
    /// Indicates if the associated subject has been hidden, preventing it from appearing in lessons or reviews.
    /// </summary>
    [JsonPropertyName("hidden")]
    public bool Hidden { get; init; }

    /// <summary>
    /// Timestamp when the user reaches SRS stage 5 for the first time.
    /// </summary>
    [JsonPropertyName("passed_at")]
    public DateTime? PassedAt { get; init; }

    /// <summary>
    /// Timestamp when the subject is resurrected and placed back in the user's review queue.
    /// </summary>
    [JsonPropertyName("ressurected_at")]
    public DateTime? RessurectedAt {get;}

    /// <summary>
    /// The current SRS stage interval. The interval range is determined by the related subject's spaced repetition system.
    /// </summary>
    [JsonPropertyName("src_stage")]
    public int SrsStage {get;}

    /// <summary>
    /// Timestamp when the user completes the lesson for the related subject.
    /// </summary>
    [JsonPropertyName("started_at")]
    public DateTime? StartedAt { get; init; }

    /// <summary>
    /// Unique identifier of the associated subject.
    /// </summary>
    [JsonPropertyName("subject_id")]
    public int SubjectId { get; init; }

    /// <summary>
    /// The type of the associated subject, one of: kana_vocabulary, kanji, radical, or vocabulary.
    /// </summary>
    [JsonPropertyName("subject_type")]
    public string SubjectType { get; init; }

    /// <summary>
    /// The timestamp when the related subject has its prerequisites satisfied and is made available in lessons.
    /// Prerequisites are:
    /// - The subject components have reached SRS stage 5 once (they have been “passed”).
    /// - The user's level is equal to or greater than the level of the assignment’s subject.
    /// </summary>
    [JsonPropertyName("unlocked_at")]
    public DateTime? UnlockedAt { get; init; }
}
