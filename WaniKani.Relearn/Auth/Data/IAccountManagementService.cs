namespace WaniKani.Relearn.Auth.Data;

public interface IAccountManagementService
{
    Task SetWaniKaniToken(string userId,string token);

    Task RemoveWaniKaniToken(string userId);

    Task<WaniKaniTokenStatus> GetWaniKaniTokenStatus(string userId);
}
