namespace WaniKani.Relearn;

public class ReviewStatisticsQuery
{
    /// <summary>
    /// Return review statistics with a matching value in the hidden attribute
    /// </summary>
    [AliasAs("hidden")]
    public bool? Hidden { get; set; }

    /// <summary>
    /// Only review statistics where data.id matches one of the array values are returned.
    /// </summary>
    [AliasAs("ids")]
    public int[]? Ids { get; set; }

    /// <summary>
    /// Return review statistics where the percentage_correct is greater than the value.
    /// </summary>
    [AliasAs("percentages_greater_than")]
    public int? PercentagesGreaterThan { get; set; }

    /// <summary>
    /// Return review statistics where the percentage_correct is less than the value.
    /// </summary>
    [AliasAs("percentages_less_than")]
    public int? PercentagesLessThan { get; set; }

    /// <summary>
    /// Only review statistics where data.subject_id matches one of the array values are returned.
    /// </summary>
    [AliasAs("subject_ids")]
    public int[]? SubjectIds { get; set; }

    /// <summary>
    /// Only review statistics where data.subject_type matches one of the array values are returned. 
    /// Valid values are: kana_vocabulary, kanji, radical, or vocabulary.
    /// </summary>
    [AliasAs("subject_types")]
    public string[]? SubjectTypes { get; set; }

    /// <summary>
    /// Only review statistics updated after this time are returned.
    /// </summary>
    [AliasAs("updated_after")]
    public DateTime? UpdatedAfter { get; set; }
}
