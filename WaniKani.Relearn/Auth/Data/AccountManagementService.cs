using Microsoft.EntityFrameworkCore;
using WaniKani.Relearn.Contracts.Clients;
using WaniKani.Relearn.Data;
using WaniKani.Relearn.Data.Entities;
using WaniKani.Relearn.Subjects.Data.Exceptions;

namespace WaniKani.Relearn.Auth.Data;

public class AccountManagementService(
    IUserReader userReader,
    IThirdPartyDataProtector dataProtector,
    WaniKaniUserSubscriptionService subscriptionService,
    BonpomDbContext dbContext) : IAccountManagementService
{
    public async Task<WaniKaniTokenStatus> GetWaniKaniTokenStatus(string userId)
    {
        var user = await userReader.GetUserById(userId);
        if (user == null)
        {
            throw new UserNotFoundException(userId);
        }
        throw new NotImplementedException();
    }

    public async Task RemoveWaniKaniToken(string userId)
    {
        var user = await userReader.GetUserById(userId);
        if (user == null)
        {
            throw new UserNotFoundException(userId);
        }

        var existingToken = await dbContext.UserWaniKaniSettings.FirstOrDefaultAsync(x => x.UserId == userId);
        if(existingToken is not null)
        {
            dbContext.UserWaniKaniSettings.Remove(existingToken);
            await dbContext.SaveChangesAsync();
        }
    }

    public async Task SetWaniKaniToken(string userId, string token)
    {
        var user = await userReader.GetUserById(userId);
        if (user == null)
        {
            throw new UserNotFoundException(userId);
        }

        var existingToken = await dbContext.UserWaniKaniSettings.FirstOrDefaultAsync(x => x.UserId == userId);
        var maxLevelAllowed = await subscriptionService.GetUserMaxLevel(token);
        if (existingToken is not null)
        {
            existingToken.EncryptedWaniKaniToken = dataProtector.ProtectToken(userId, token);
            existingToken.UpdatedAt = DateTime.UtcNow;
            existingToken.MaxAllowedLevel = maxLevelAllowed.MaxAllowedLevel;
            existingToken.MaxAllowedLevelValidUntil = maxLevelAllowed.PeriodEndsAt;
            dbContext.UserWaniKaniSettings.Update(existingToken);
        }
        else
        {
            var newUserToken = new UserWaniKaniSettingsEntity
            {
                UserId = userId,
                EncryptedWaniKaniToken = dataProtector.ProtectToken(userId, token),
                MaxAllowedLevel = maxLevelAllowed.MaxAllowedLevel,
                MaxAllowedLevelValidUntil = maxLevelAllowed.PeriodEndsAt,
                UpdatedAt = DateTime.UtcNow
            };
            dbContext.UserWaniKaniSettings.Add(newUserToken);
        }

        await dbContext.SaveChangesAsync();
    }
}
