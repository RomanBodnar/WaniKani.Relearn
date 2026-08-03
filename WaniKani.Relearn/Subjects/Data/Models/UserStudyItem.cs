namespace WaniKani.Relearn.Subjects.Data.Models;

public class UserStudyItem
{
    public required string SubjectId { get; set; }

    public required string Type { get; set; }

    public string? Characters { get; set; }

    public required string Slug { get; set; } 

    public required string Meaning { get; set; }

    public string? Reading { get; set; }

    public DateTime BookmarkedAt { get; set; }
}