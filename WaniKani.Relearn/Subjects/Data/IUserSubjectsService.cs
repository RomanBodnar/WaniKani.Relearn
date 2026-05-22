using Google.Cloud.Firestore;
using WaniKani.Relearn.Auth.Data;
using WaniKani.Relearn.Subjects.Data.Exceptions;

namespace WaniKani.Relearn.Subjects.Data;

public interface IUserSubjectsService
{
    Task BookmarkSubjectForUser(string userId, int subjectId);
}

public class UserSubjectsService(
    IUserReader userReader,
    SubjectCache subjectCache,
    FirestoreDb firestore
) : IUserSubjectsService
{
    public async Task BookmarkSubjectForUser(string userId, int subjectId)
    {
        var user = await userReader.GetUserById(userId);
        if (user == null) 
        {
            throw new UserNotFoundException(userId);
        }

        if (!subjectCache.TryGet(subjectId, out var subject))
        {
            // Optionally, you could implement a fallback to fetch the subject from an external API here
            throw new SubjectNotFoundException(subjectId);
        }

        var studyItemsCollection = firestore.Collection("users").Document(userId).Collection("study-items");
        var studyItemDoc = studyItemsCollection.Document(subjectId.ToString());
        await studyItemDoc.SetAsync(new UserStudyItem
        {
            SubjectId = subjectId,
            BookmarkedAt = DateTime.UtcNow
        });
        // Implement bookmarking logic here
    }
}