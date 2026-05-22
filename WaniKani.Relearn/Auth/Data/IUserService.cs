namespace WaniKani.Relearn.Auth.Data;

public interface IUserService : IUserReader, IUserWriter
{
    Task<bool> ValidateUserCredentials(string usernameOrEmail, string password);
}

public interface IUserReader
{
    Task<User?> GetUserById(string userId, CancellationToken cancellation = default);
    
    Task<User?> GetUserByUsername(string username, CancellationToken cancellation = default);

    Task<User?> GetUserByEmail(string email, CancellationToken cancellation = default);
}

public interface IUserWriter
{
    Task CreateUser(string username, string email, string password);
}