namespace WaniKani.Relearn.Auth.Data;

public interface IThirdPartyDataProtector
{
    public string ProtectToken(string userId, string token);

    public string UnprotectToken(string userId, string protectedToken);
}
