using Google.Cloud.Firestore;
using WaniKani.Relearn.Auth.Data;
using WaniKani.Relearn.Subjects.Data.Exceptions;
using WaniKani.Relearn.Subjects.Data.Models;

namespace WaniKani.Relearn.Subjects.Data;

public interface IUserSubjectsService
{
    Task<UserStudyItem> BookmarkSubjectForUser(string userId, int subjectId);

    Task<IEnumerable<UserStudyItem>> GetBookmarkedSubjectsForUser(string userId);

    Task RemoveBookmarkedSubjectForUser(string userId, int subjectId);
}

public class UserSubjectsService(
    IUserReader userReader,
    SubjectCache subjectCache,
    FirestoreDb firestore
) : IUserSubjectsService
{
    public async Task<UserStudyItem> BookmarkSubjectForUser(string userId, int subjectId)
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
        
        var studyItem = new UserStudyItem
        {
            SubjectId = subjectId.ToString(),
            Type = subject.Object,
            Characters = subject.Characters,
            Slug = subject.Slug,
            Meaning = subject.Meanings.FirstOrDefault(x => x.Primary)?.Meaning ?? string.Empty,
            BookmarkedAt = DateTime.UtcNow
        };

        if (subject is Kanji kanji)
        {
            studyItem.Reading = kanji.Readings.FirstOrDefault(x => x.Primary)?.Reading;
        } 
        else if (subject is Vocabulary vocabulary)
        {
            studyItem.Reading = vocabulary.Readings.FirstOrDefault(x => x.Primary)?.Reading;
        }
    
        await studyItemDoc.SetAsync(studyItem);

        return studyItem;
    }

    public async Task<IEnumerable<UserStudyItem>> GetBookmarkedSubjectsForUser(string userId)
    {
        var user = await userReader.GetUserById(userId);
        if (user == null)
        {
            throw new UserNotFoundException(userId);
        }

        var studyItemsCollection = firestore.Collection("users").Document(userId).Collection("study-items");
        var snapshot = await studyItemsCollection.GetSnapshotAsync();
        var studyItems = snapshot.Documents.Select(doc => doc.ConvertTo<UserStudyItem>()).ToList();
        return studyItems;
    }

    public async Task RemoveBookmarkedSubjectForUser(string userId, int subjectId)
    {
        var user = await userReader.GetUserById(userId);
        if (user == null)
        {
            throw new UserNotFoundException(userId);
        }

        var studyItemsCollection = firestore.Collection("users").Document(userId).Collection("study-items");
        var studyItemDoc = studyItemsCollection.Document(subjectId.ToString());
        await studyItemDoc.DeleteAsync();
    }
}