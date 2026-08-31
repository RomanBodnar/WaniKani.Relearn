using Microsoft.AspNetCore.DataProtection;

namespace WaniKani.Relearn.Account.Data;

public class WaniKaniDataProtector : IThirdPartyDataProtector
{
    private readonly IDataProtector _dataProtector;
    public WaniKaniDataProtector(IDataProtectionProvider dataProtectionProvider)
    {
        _dataProtector = dataProtectionProvider.CreateProtector("WaniKaniDataProtector");
    }

    public string ProtectToken(string userId, string token)
    {
        var personalProtector = _dataProtector.CreateProtector(userId);
        return personalProtector.Protect(token);
    }

    public string UnprotectToken(string userId, string protectedToken)
    {
        var personalProtector = _dataProtector.CreateProtector(userId);
        return personalProtector.Unprotect(protectedToken);
    }
}
