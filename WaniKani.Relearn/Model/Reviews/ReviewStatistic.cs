namespace WaniKani.Relearn;

public class ReviewStatistic
{
    /// <summary>
    /// Timestamp when the review statistic was created.
    /// </summary>
    public DateTime CreatedAt { get; }

    /// <summary>
    /// Indicates if the associated subject has been hidden, preventing it from appearing in lessons or reviews.
    /// </summary>
    public bool Hidden { get; }

    /// <summary>
    /// Total number of correct answers submitted for the meaning of the associated subject.
    /// </summary>
    public int MeaningCorrect { get; }

    /// <summary>
    /// The current, uninterrupted series of correct answers given for the meaning of the associated subject.
    /// </summary>
    public int MeaningCurrentStreak { get; }

    /// <summary>
    /// Total number of incorrect answers submitted for the meaning of the associated subject
    /// </summary>
    public int MeaningIncorrect { get; }

    /// <summary>
    /// The longest, uninterrupted series of correct answers ever given for the meaning of the associated subject.
    /// </summary>
    public int MeaningMaxStreak { get; }

    /// <summary>
    /// The overall correct answer rate by the user for the subject, including both meaning and reading.
    /// </summary>
    public int PercentageCorrect { get; }

    /// <summary>
    /// Total number of correct answers submitted for the reading of the associated subject.
    /// </summary>
    public int ReadingCorrect { get; }

    /// <summary>
    /// The current, uninterrupted series of correct answers given for the reading of the associated subject.
    /// </summary>
    public int ReadingCurrentStreak { get; }

    /// <summary>
    /// Total number of incorrect answers submitted for the reading of the associated subject.
    /// </summary>
    public int ReadingIncorrect { get; }

    /// <summary>
    /// The longest, uninterrupted series of correct answers ever given for the reading of the associated subject.
    /// </summary>
    public int ReadingMaxStreak { get; }
    
    /// <summary>
    /// Unique identifier of the associated subject.
    /// </summary>
    public int SubjectId { get; }

    /// <summary>
    /// The type of the associated subject, one of: 'kana_vocabulary', 'kanji', 'radical', or 'vocabulary'.
    /// </summary>
    public string SubjectType { get; }
}
