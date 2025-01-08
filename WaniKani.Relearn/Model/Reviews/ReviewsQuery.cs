namespace WaniKani.Relearn;

public class ReviewsQuery
{
    /// <summary>
    /// Only reviews where data.assignment_id matches one of the array values are returned.
    /// </summary>
    [AliasAs("")]
    public int[]? AssignmentIds { get; set; }

    /// <summary>
    /// Only reviews where data.id matches one of the array values are returned.
    /// </summary>
    [AliasAs("")]
    public int[]? Ids { get; set; }

    /// <summary>
    /// Only reviews where data.subject_id matches one of the array values are returned.
    /// </summary>
    [AliasAs("")]
    public int[]? SubjectIds { get; set; }

    /// <summary>
    /// Only reviews updated after this time are returned.
    /// </summary>
    [AliasAs("")]
    public DateTime? UpdatedAfter { get; set; }
}
