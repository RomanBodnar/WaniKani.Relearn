namespace WaniKani.Relearn.Auth.Data;

public interface IUserService
{
    Task CreateUser(string username, string email, string password);

    Task<User?> GetUserByUsername(string username);

    Task<User?> GetUserByEmail(string email);

    Task<bool> ValidateUserCredentials(string usernameOrEmail, string password);
}
