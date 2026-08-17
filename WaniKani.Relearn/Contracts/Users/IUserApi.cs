using WaniKani.Relearn.Contracts.Resources;

namespace WaniKani.Relearn.Contracts.Users;

public interface IUserApi
{
    [Get("/user")]
    public Task<SingleResource<User>> GetUser();
}
