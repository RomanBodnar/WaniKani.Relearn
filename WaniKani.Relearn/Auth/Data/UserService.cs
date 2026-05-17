using Google.Cloud.Firestore;

namespace WaniKani.Relearn.Auth.Data;

public class UserService(
    FirestoreDb firestore, 
    IPasswordHasher passwordHasher) 
    : IUserService
{
    public async Task CreateUser(string username, string email, string password)
    {
        string userId = "user_" + Guid.CreateVersion7().ToString("N");
        var userDoc = firestore.Collection("users").Document(userId);
        var credentialsDoc = firestore.Collection("user-credentials").Document(userId);

        var user = new User
        {
            UserId = userId,
            Username = username,
            Email = email
        };

        var userCredentials = new UserCredentials
        {
            UserId = userId,
            Email = email,
            PasswordHash = passwordHasher.HashPassword(password),
            CreatedAt = DateTime.UtcNow,
            PasswordLastChanged = DateTime.UtcNow
        };
        await userDoc.SetAsync(user);
        await credentialsDoc.SetAsync(userCredentials);
    }

    public Task<User?> GetUserByUsername(string username)
    {
        // Implement logic to retrieve user by username from database.
        throw new NotImplementedException();
    }

    public Task<User?> GetUserByEmail(string email)
    {
        // Implement logic to retrieve user by email from database.
        throw new NotImplementedException();
    }

    public async Task<bool> ValidateUserCredentials(string usernameOrEmail, string password)
    {
        var credentialsQuery = await firestore
            .Collection("user-credentials")
            .WhereEqualTo("Email", usernameOrEmail)
            .Limit(1)
            .GetSnapshotAsync();
        var document = credentialsQuery.Documents.FirstOrDefault();
        if (document == null) return false;

        var credentials = document.ConvertTo<UserCredentials>();   
        return passwordHasher.VerifyPassword(password, credentials.PasswordHash);
    }
}