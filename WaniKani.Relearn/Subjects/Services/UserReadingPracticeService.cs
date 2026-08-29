using Microsoft.EntityFrameworkCore;
using WaniKani.Relearn.Data;
using WaniKani.Relearn.Data.Entities;
using WaniKani.Relearn.Subjects.Data;

namespace WaniKani.Relearn.Subjects.Services;

public class UserReadingPracticeService(
    BonpomDbContext dbContext,
    SentenceCache sentenceCache
) : IUserReadingPracticeService
{
    public async Task<HashSet<long>> GetPracticedSentenceIdsAsync(string userId, CancellationToken cancellationToken = default)
    {
        var ids = await dbContext.UserPracticedSentences
            .AsNoTracking()
            .Where(ps => ps.UserId == userId)
            .Select(ps => ps.SentenceId)
            .ToListAsync(cancellationToken);

        return ids.ToHashSet();
    }

    public async Task MarkSentenceAsPracticedAsync(string userId, long sentenceId, CancellationToken cancellationToken = default)
    {
        var existing = await dbContext.UserPracticedSentences
            .FirstOrDefaultAsync(ps => ps.UserId == userId && ps.SentenceId == sentenceId, cancellationToken);

        if (existing != null)
        {
            existing.PracticeCount++;
            existing.LastPracticedAt = DateTime.UtcNow;
        }
        else
        {
            var entity = new UserPracticedSentenceEntity
            {
                UserId = userId,
                SentenceId = sentenceId,
                MarkedAt = DateTime.UtcNow,
                PracticeCount = 1,
                LastPracticedAt = DateTime.UtcNow
            };
            dbContext.UserPracticedSentences.Add(entity);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UnmarkSentenceAsPracticedAsync(string userId, long sentenceId, CancellationToken cancellationToken = default)
    {
        var existing = await dbContext.UserPracticedSentences
            .FirstOrDefaultAsync(ps => ps.UserId == userId && ps.SentenceId == sentenceId, cancellationToken);

        if (existing != null)
        {
            dbContext.UserPracticedSentences.Remove(existing);
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task<ReadingBookmarkDto?> GetBookmarkAsync(string userId, CancellationToken cancellationToken = default)
    {
        var entity = await dbContext.UserReadingBookmarks
            .AsNoTracking()
            .FirstOrDefaultAsync(rb => rb.UserId == userId, cancellationToken);

        if (entity == null) return null;

        return new ReadingBookmarkDto(
            entity.Page,
            entity.SentenceIndex,
            entity.MinLevel,
            entity.MaxLevel,
            entity.UpdatedAt
        );
    }

    public async Task SaveBookmarkAsync(string userId, ReadingBookmarkDto bookmark, CancellationToken cancellationToken = default)
    {
        var existing = await dbContext.UserReadingBookmarks
            .FirstOrDefaultAsync(rb => rb.UserId == userId, cancellationToken);

        if (existing != null)
        {
            existing.Page = bookmark.Page;
            existing.SentenceIndex = bookmark.SentenceIndex;
            existing.MinLevel = bookmark.MinLevel;
            existing.MaxLevel = bookmark.MaxLevel;
            existing.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            var entity = new UserReadingBookmarkEntity
            {
                UserId = userId,
                Page = bookmark.Page,
                SentenceIndex = bookmark.SentenceIndex,
                MinLevel = bookmark.MinLevel,
                MaxLevel = bookmark.MaxLevel,
                UpdatedAt = DateTime.UtcNow
            };
            dbContext.UserReadingBookmarks.Add(entity);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task ClearBookmarkAsync(string userId, CancellationToken cancellationToken = default)
    {
        var existing = await dbContext.UserReadingBookmarks
            .FirstOrDefaultAsync(rb => rb.UserId == userId, cancellationToken);

        if (existing != null)
        {
            dbContext.UserReadingBookmarks.Remove(existing);
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task SetSentenceHiddenAsync(long sentenceId, bool isHidden, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
        //var sentence = await dbContext.ContextSentences
        //    .FirstOrDefaultAsync(s => s.Id == sentenceId, cancellationToken);

        //if (sentence != null)
        //{
        //    //sentence.HiddenAt = isHidden ? DateTime.UtcNow : null;
        //    sentence.UpdatedAt = DateTime.UtcNow;
        //    await dbContext.SaveChangesAsync(cancellationToken);

        //    if (isHidden)
        //    {
        //        sentenceCache.HideSentence(sentenceId);
        //    }
        //    else
        //    {
        //        sentenceCache.UnhideSentence(sentenceId);
        //    }
        //}
    }
}
