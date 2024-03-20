namespace WaniKani.Relearn;

public class Assignment
{
    /// <summary>
    /// Timestamp when the related subject will be available in the user's review queue.
    /// </summary>
    public DateTime? AvailableAt { get; }

    /// <summary>
    /// Timestamp when the user reaches SRS stage 9 the first time.
    /// </summary>
    public DateTime? BurnedAt { get; }

    /// <summary>
    /// Timestamp when the assignment was created.
    /// </summary>
    public DateTime CreatedAt { get; }
    
    /// <summary>
    /// Indicates if the associated subject has been hidden, preventing it from appearing in lessons or reviews.
    /// </summary>
    public bool Hidden { get; }

    /// <summary>
    /// Timestamp when the user reaches SRS stage 5 for the first time.
    /// </summary>
    public DateTime? PassedAt { get; }

    /// <summary>
    /// Timestamp when the subject is resurrected and placed back in the user's review queue.
    /// </summary>
    public DateTime? RessurectedAt {get;}

    /// <summary>
    /// The current SRS stage interval. The interval range is determined by the related subject's spaced repetition system.
    /// </summary>
    public int SrsStage {get;}

    /// <summary>
    /// Timestamp when the user completes the lesson for the related subject.
    /// </summary>
    public DateTime? StartedAt { get; }

    /// <summary>
    /// Unique identifier of the associated subject.
    /// </summary>
    public int SubjectId { get; }

    /// <summary>
    /// The type of the associated subject, one of: kana_vocabulary, kanji, radical, or vocabulary.
    /// </summary>
    public string SubjectType { get; }

    /// <summary>
    /// The timestamp when the related subject has its prerequisites satisfied and is made available in lessons.
    /// Prerequisites are:
    /// - The subject components have reached SRS stage 5 once (they have been “passed”).
    /// - The user's level is equal to or greater than the level of the assignment’s subject.
    /// </summary>
    public DateTime? UnlockedAt { get; }
}
