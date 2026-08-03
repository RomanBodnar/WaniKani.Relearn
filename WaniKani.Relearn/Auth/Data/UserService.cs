using Microsoft.EntityFrameworkCore;
using WaniKani.Relearn.Data;
using WaniKani.Relearn.Data.Entities;

namespace WaniKani.Relearn.Auth.Data;

public class UserService(
    BonpomDbContext dbContext, 
    IPasswordHasher passwordHasher) 
    : IUserService
{
    public async Task CreateUser(string username, string email, string password)
    {
        string userId = "usr_" + Guid.CreateVersion7().ToString("N");

        var userEntity = new UserEntity
        {
            Id = userId,
            Username = username,
            Email = email,
            CreatedAt = DateTime.UtcNow
        };

        var credentialsEntity = new UserCredentialsEntity
        {
            UserId = userId,
            Email = email,
            PasswordHash = passwordHasher.HashPassword(password),
            CreatedAt = DateTime.UtcNow,
            PasswordLastChanged = DateTime.UtcNow
        };

        dbContext.Users.Add(userEntity);
        dbContext.UserCredentials.Add(credentialsEntity);
        await dbContext.SaveChangesAsync();
    }

    public async Task<User?> GetUserByUsername(string username, CancellationToken cancellation = default)
    {
        var userEntity = await dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Username == username, cancellation);

        if (userEntity == null) return null;

        return new User
        {
            UserId = userEntity.Id,
            Username = userEntity.Username,
            Email = userEntity.Email
        };
    }

    public async Task<User?> GetUserByEmail(string email, CancellationToken cancellation = default)
    {
        var userEntity = await dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == email, cancellation);

        if (userEntity == null) return null;

        return new User
        {
            UserId = userEntity.Id,
            Username = userEntity.Username,
            Email = userEntity.Email
        };
    }

    public async Task<bool> ValidateUserCredentials(string usernameOrEmail, string password)
    {
        var credentials = await dbContext.UserCredentials
            .AsNoTracking()
            .FirstOrDefaultAsync(uc => uc.Email == usernameOrEmail || (uc.User != null && uc.User.Username == usernameOrEmail));

        if (credentials == null) return false;

        return passwordHasher.VerifyPassword(password, credentials.PasswordHash);
    }

    public async Task<User?> GetUserById(string userId, CancellationToken cancellation = default)
    {
        var userEntity = await dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId, cancellation);

        if (userEntity == null) return null;

        return new User
        {
            UserId = userEntity.Id,
            Username = userEntity.Username,
            Email = userEntity.Email
        };
    }
}