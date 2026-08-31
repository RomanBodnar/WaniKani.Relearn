using Microsoft.AspNetCore.DataProtection;
using WaniKani.Relearn.Account.Data;
using Xunit;

namespace BonPom.Tests;

public class WaniKaniDataProtectorTests
{
    private readonly WaniKaniDataProtector _protector;

    public WaniKaniDataProtectorTests()
    {
        var provider = new EphemeralDataProtectionProvider();
        _protector = new WaniKaniDataProtector(provider);
    }

    [Fact]
    public void ProtectToken_And_UnprotectToken_RoundtripsSuccessfully()
    {
        // Arrange
        var userId = "user-abc-123";
        var rawToken = "5d6a8f12-0000-1111-2222-333344445555";

        // Act
        var encrypted = _protector.ProtectToken(userId, rawToken);
        var decrypted = _protector.UnprotectToken(userId, encrypted);

        // Assert
        Assert.NotEqual(rawToken, encrypted);
        Assert.Equal(rawToken, decrypted);
    }

    [Fact]
    public void UnprotectToken_WithWrongUserId_ThrowsException()
    {
        // Arrange
        var userA = "user-A";
        var userB = "user-B";
        var rawToken = "secret-token";

        var encryptedForUserA = _protector.ProtectToken(userA, rawToken);

        // Act & Assert
        Assert.ThrowsAny<Exception>(() => _protector.UnprotectToken(userB, encryptedForUserA));
    }
}
