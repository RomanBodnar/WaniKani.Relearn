using Microsoft.Extensions.Caching.Memory;
using Microsoft.EntityFrameworkCore;
using WaniKani.Relearn.Data;

namespace WaniKani.Relearn.Account.Data;

public interface IWaniKaniUserCache
{
    Task<int?> GetMaxLevel(string userId);
    void  SetMaxLevel(string userId, int? level);
    void RemoveMaxLevel(string userId);
}

public class WaniKaniUserCache(IMemoryCache memoryCache, BonpomDbContext dbContext) : IWaniKaniUserCache
{
    private readonly string wkLevelPrefix = "wk_level_";

    private string GetLevelKey(string userId) => $"{wkLevelPrefix}{userId}";

    public async Task<int?> GetMaxLevel(string userId)
    {
        return await memoryCache.GetOrCreateAsync(
            GetLevelKey(userId),
            async entry =>
            {
                var userSettings = await dbContext.UserWaniKaniSettings.SingleOrDefaultAsync(u => u.UserId == userId);
                return userSettings?.MaxAllowedLevel; // use the actual property name
            },
            new MemoryCacheEntryOptions() 
            { 
                AbsoluteExpiration = DateTimeOffset.UtcNow.AddHours(24), 
                SlidingExpiration = TimeSpan.FromHours(6) 
            });
    }

    public void RemoveMaxLevel(string userId) => memoryCache.Remove(GetLevelKey(userId));

    public void SetMaxLevel(string userId, int? level)
    {
        memoryCache.Set(
            GetLevelKey(userId), 
            level,
            new MemoryCacheEntryOptions()
            {
                AbsoluteExpiration = DateTimeOffset.UtcNow.AddHours(24),
                SlidingExpiration = TimeSpan.FromHours(6)
            });
    }
}
