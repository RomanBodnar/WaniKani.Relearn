using Microsoft.EntityFrameworkCore;
using WaniKani.Relearn.Auth.Data;
using WaniKani.Relearn.Data;
using WaniKani.Relearn.Data.Entities;
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
    BonpomDbContext dbContext
) : IUserSubjectsService
{
    public async Task<UserStudyItem> BookmarkSubjectForUser(string userId, int subjectId)
    {
        var user = await userReader.GetUserById(userId);
        if (user == null) 
        {
            throw new UserNotFoundException(userId);
        }

        var subject = await subjectCache.TryGetAsync(subjectId);
        if (subject == null)
        {
            throw new SubjectNotFoundException(subjectId);
        }

        var existing = await dbContext.UserMyBoxItems
            .FirstOrDefaultAsync(b => b.UserId == userId && b.SubjectId == subjectId);

        if (existing == null)
        {
            existing = new UserMyBoxEntity
            {
                UserId = userId,
                SubjectId = subjectId,
                BookmarkedAt = DateTime.UtcNow
            };
            dbContext.UserMyBoxItems.Add(existing);
            await dbContext.SaveChangesAsync();
        }

        var studyItem = new UserStudyItem
        {
            SubjectId = subjectId.ToString(),
            Type = subject.Object,
            Characters = subject.Characters,
            Slug = subject.Slug,
            Meaning = subject.Meanings.FirstOrDefault(x => x != null && x.Primary)?.Meaning ?? string.Empty,
            BookmarkedAt = existing.BookmarkedAt
        };

        if (subject is Kanji kanji)
        {
            studyItem.Reading = kanji.Readings.FirstOrDefault(x => x != null && x.Primary)?.Reading;
        } 
        else if (subject is Vocabulary vocabulary)
        {
            studyItem.Reading = vocabulary.Readings.FirstOrDefault(x => x != null && x.Primary)?.Reading;
        }
    
        return studyItem;
    }

    public async Task<IEnumerable<UserStudyItem>> GetBookmarkedSubjectsForUser(string userId)
    {
        var user = await userReader.GetUserById(userId);
        if (user == null)
        {
            throw new UserNotFoundException(userId);
        }

        var bookmarks = await dbContext.UserMyBoxItems
            .AsNoTracking()
            .Where(b => b.UserId == userId)
            .ToListAsync();

        var studyItems = new List<UserStudyItem>();
        foreach (var b in bookmarks)
        {
            var subject = await subjectCache.TryGetAsync(b.SubjectId);
            if (subject != null)
            {
                var item = new UserStudyItem
                {
                    SubjectId = b.SubjectId.ToString(),
                    Type = subject.Object,
                    Characters = subject.Characters,
                    Slug = subject.Slug,
                    Meaning = subject.Meanings.FirstOrDefault(x => x != null && x.Primary)?.Meaning ?? string.Empty,
                    BookmarkedAt = b.BookmarkedAt
                };

                if (subject is Kanji kanji)
                {
                    item.Reading = kanji.Readings.FirstOrDefault(x => x != null && x.Primary)?.Reading;
                } 
                else if (subject is Vocabulary vocabulary)
                {
                    item.Reading = vocabulary.Readings.FirstOrDefault(x => x != null && x.Primary)?.Reading;
                }

                studyItems.Add(item);
            }
        }

        return studyItems;
    }

    public async Task RemoveBookmarkedSubjectForUser(string userId, int subjectId)
    {
        var user = await userReader.GetUserById(userId);
        if (user == null)
        {
            throw new UserNotFoundException(userId);
        }

        var existing = await dbContext.UserMyBoxItems
            .FirstOrDefaultAsync(b => b.UserId == userId && b.SubjectId == subjectId);

        if (existing != null)
        {
            dbContext.UserMyBoxItems.Remove(existing);
            await dbContext.SaveChangesAsync();
        }
    }
}