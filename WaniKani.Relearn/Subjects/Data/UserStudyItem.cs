using Google.Cloud.Firestore;

namespace WaniKani.Relearn.Subjects.Data;

public class UserStudyItem
{
    [FirestoreDocumentId]
    public int SubjectId { get; set; }
    
    [FirestoreProperty]
    public DateTime BookmarkedAt { get; set; }
}