namespace WaniKani.Relearn;

public class SubjectsQuery
{
    [AliasAs("ids")]
    public int[]? Ids { get; set; }

    [AliasAs("types")]
    public string[]? Types { get; set; }

    [AliasAs("slugs")]
    public string[]? Slugs { get; set; }

    [AliasAs("levels")]
    public int[]? Levels { get; set; }

    [AliasAs("hidden")]
    public bool? Hidden { get; set; }

    [AliasAs("updated_after")]
    public DateTime? UpdatedAfter { get; set; }
}
