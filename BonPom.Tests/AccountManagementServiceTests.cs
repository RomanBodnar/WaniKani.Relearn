using Microsoft.EntityFrameworkCore;
using NSubstitute;
using WaniKani.Relearn.Account.Data;
using WaniKani.Relearn.Auth.Data;
using WaniKani.Relearn.Data;
using WaniKani.Relearn.Data.Entities;
using Xunit;

namespace BonPom.Tests;

public class AccountManagementServiceTests
{
    private readonly IUserReader _userReader = Substitute.For<IUserReader>();
    private readonly IThirdPartyDataProtector _dataProtector = Substitute.For<IThirdPartyDataProtector>();
    private readonly WaniKaniUserSubscriptionService _subscriptionService;
    private readonly BonpomDbContext _dbContext;
    private readonly AccountManagementService _service;

    public AccountManagementServiceTests()
    {
        var options = new DbContextOptionsBuilder<BonpomDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _dbContext = new BonpomDbContext(options);

        var httpClient = new HttpClient();
        _subscriptionService = new WaniKaniUserSubscriptionService(httpClient);

        _dataProtector.ProtectToken(Arg.Any<string>(), Arg.Any<string>())
            .Returns(callInfo => "encrypted_" + callInfo.ArgAt<string>(1));

        _service = new AccountManagementService(_userReader, _dataProtector, _subscriptionService, _dbContext);
    }

    [Fact]
    public async Task GetWaniKaniTokenStatus_WhenNoSettingsExist_ReturnsHasTokenFalse()
    {
        // Arrange
        var userId = "user-1";
        _userReader.GetUserById(userId).Returns(new User { UserId = userId, Username = "test", Email = "test@test.com" });

        // Act
        var status = await _service.GetWaniKaniTokenStatus(userId);

        // Assert
        Assert.False(status.HasToken);
        Assert.Equal("None", status.StorageType);
        Assert.Equal(3, status.MaxAllowedLevel);
    }

    [Fact]
    public async Task GetWaniKaniTokenStatus_WhenSettingsExistWithToken_ReturnsHasTokenTrue()
    {
        // Arrange
        var userId = "user-2";
        _userReader.GetUserById(userId).Returns(new User { UserId = userId, Username = "test", Email = "test@test.com" });

        _dbContext.UserWaniKaniSettings.Add(new UserWaniKaniSettingsEntity
        {
            UserId = userId,
            EncryptedWaniKaniToken = "encrypted_token",
            MaxAllowedLevel = 60,
            UpdatedAt = DateTime.UtcNow
        });
        await _dbContext.SaveChangesAsync();

        // Act
        var status = await _service.GetWaniKaniTokenStatus(userId);

        // Assert
        Assert.True(status.HasToken);
        Assert.Equal("Database", status.StorageType);
        Assert.Equal(60, status.MaxAllowedLevel);
    }

    [Fact]
    public async Task RemoveWaniKaniToken_WhenSettingsExist_RemovesFromDatabase()
    {
        // Arrange
        var userId = "user-3";
        _userReader.GetUserById(userId).Returns(new User { UserId = userId, Username = "test", Email = "test@test.com" });

        _dbContext.UserWaniKaniSettings.Add(new UserWaniKaniSettingsEntity
        {
            UserId = userId,
            EncryptedWaniKaniToken = "encrypted_token",
            MaxAllowedLevel = 60,
            UpdatedAt = DateTime.UtcNow
        });
        await _dbContext.SaveChangesAsync();

        // Act
        await _service.RemoveWaniKaniToken(userId);

        // Assert
        var remaining = await _dbContext.UserWaniKaniSettings.FirstOrDefaultAsync(x => x.UserId == userId);
        Assert.Null(remaining);
    }
}
