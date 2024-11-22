using Refit;

namespace WaniKani.Relearn;

public class AssignmentsQuery
{
    /// <summary>
    /// Only assignments available at or after this time are returned.
    /// </summary>
    [AliasAs("available_after")]
    public DateTime? AvailableAfter { get; set; }

    /// <summary>
    /// Only assignments available at or before this time are returned.
    /// </summary>
    [AliasAs("available_before")]
    public DateTime? AvailableBefore { get; set; }

    /// <summary>
    /// When set to true, returns assignments that have a value in data.burned_at. 
    /// Returns assignments with a null data.burned_at if false.
    /// </summary>
    [AliasAs("burned")]
    public bool? Burned { get; set; }

    /// <summary>
    /// Return assignments with a matching value in the hidden attribute
    /// </summary>
    [AliasAs("hidden")]
    public bool? Hidden { get; set; }

    /// <summary>
    /// Only assignments where data.id matches one of the array values are returned.
    /// </summary>
    [AliasAs("ids")]
    public int[]? Ids { get; set; }

    /// <summary>
    /// Returns assignments which are immediately available for lessons
    /// </summary>
    [AliasAs("immediately_available_for_lessons")]
    public bool? ImmediatelyAvailableForLessons { get; set; } // value is not required

    /// <summary>
    /// Returns assignments which are immediately available for review
    /// </summary>
    [AliasAs("immediately_available_for_review")]
    public bool? ImmediatelyAvailableForReview { get; set; } // value is not required

    /// <summary>
    /// Returns assignments which are in the review state
    /// </summary>
    [AliasAs("in_review")]
    public bool? InReview { get; set; } // value is not required

    /// <summary>
    /// Only assignments where the associated subject level matches one of the array values are returned. 
    /// Valid values range from 1 to 60.
    /// </summary>
    [AliasAs("levels")]
    public int[] Levels { get; set; }

    /// <summary>
    /// Only assignments where data.srs_stage matches one of the array values are returned. 
    /// Valid values range from 0 to 9
    /// </summary>
    [AliasAs("srs_stages")]
    public int[]? SrsStages { get; set; }

    /// <summary>
    /// When set to true, returns assignments that have a value in data.started_at. 
    /// Returns assignments with a null data.started_at if false.
    /// </summary>
    [AliasAs("started")]
    public bool? Started { get; set; }

    /// <summary>
    /// Only assignments where data.subject_id matches one of the array values are returned.
    /// </summary>
    [AliasAs("subject_ids")]
    public int[]? SubjectIds { get; set; }

    /// <summary>
    /// Only assignments where data.subject_type matches one of the array values are returned. 
    /// Valid values are: 'kana_vocabulary', 'kanji', 'radical', or 'vocabulary'.
    /// </summary>
    [AliasAs("subject_types")]
    public string[]? SubjectTypes { get; set; }

    /// <summary>
    /// When set to true, returns assignments that have a value in 'data.unlocked_at'. 
    /// Returns assignments with a null 'data.unlocked_at' if 'false'.
    /// </summary>
    [AliasAs("unlocked")]
    public bool? Unlocked { get; set; }

    /// <summary>
    /// Only assignments updated after this time are returned
    /// </summary>
    [AliasAs("updated_after")]
    public DateTime? UpdatedAfter { get; set; }
}
