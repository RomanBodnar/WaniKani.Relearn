namespace WaniKani.Relearn;

public class Review
{
    /// <summary>
    /// Unique identifier of the associated assignment.
    /// </summary>
    public int AssignmentId { get; init; }

    /// <summary>
    /// Timestamp when the review was created.
    /// </summary>
    public DateTime CreatedAt { get; init; }

    /// <summary>
    /// The SRS stage interval calculated from the number of correct and incorrect answers,
    /// with valid values ranging from 1 to 9
    /// </summary>
    public int EndSrsStage { get; init; }

    /// <summary>
    /// The number of times the user has answered the meaning incorrectly.
    /// </summary>
    public int IncorrectMeaningAnswers { get; init; }

    /// <summary>
    /// The number of times the user has answered the reading incorrectly.
    /// </summary>
    public int IncorrectReadingAnswers { get; init; }

    /// <summary>
    /// Unique identifier of the associated spaced_repetition_system.
    /// </summary>
    public int SpacedRepetitionSystemId { get; init; }

    /// <summary>
    /// The starting SRS stage interval, with valid values ranging from 1 to 8
    /// </summary>
    public int StartingSrsStage { get; init; }

    /// <summary>
    /// Unique identifier of the associated subject.
    /// </summary>
    public int SubjectId { get; init; }
}
