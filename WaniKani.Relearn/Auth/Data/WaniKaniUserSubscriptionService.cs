using WaniKani.Relearn.Contracts.Users;

namespace WaniKani.Relearn.Auth.Data;

public class WaniKaniUserSubscriptionService(
    HttpClient httpClient)
{
    public async Task<WaniKaniUserRestrictions> GetUserMaxLevel(string accessToken)
    {
        httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");

        var userApi = RestService.For<IUserApi>(httpClient);

        var user = await userApi.GetUser();
        return new WaniKaniUserRestrictions(
            MaxAllowedLevel: user.Data.Subscription.MaxLevelGranted,
            PeriodEndsAt: user.Data.Subscription.PeriodEndsAt);
    }
}
