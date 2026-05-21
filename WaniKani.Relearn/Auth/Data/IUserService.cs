namespace WaniKani.Relearn.Auth.Data;

public interface IUserService
{
    Task CreateUser(string username, string email, string password);

    Task<User?> GetUserByUsername(string username, CancellationToken cancellation = default);

    Task<User?> GetUserByEmail(string email, CancellationToken cancellation = default);

    Task<bool> ValidateUserCredentials(string usernameOrEmail, string password);
}
