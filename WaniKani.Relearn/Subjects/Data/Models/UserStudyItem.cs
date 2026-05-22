using Google.Cloud.Firestore;

namespace WaniKani.Relearn.Subjects.Data.Models;

[FirestoreData]
public class UserStudyItem
{
    [FirestoreDocumentId]
    public required string SubjectId { get; set; }

    [FirestoreProperty]
    public required string Type { get; set; }

    [FirestoreProperty]
    public string? Characters { get; set; }

    [FirestoreProperty]
    public required string Slug { get; set; } 

    [FirestoreProperty]
    public required string Meaning { get; set; }

    [FirestoreProperty]
    public string? Reading { get; set; }

    [FirestoreProperty]
    public DateTime BookmarkedAt { get; set; }
}