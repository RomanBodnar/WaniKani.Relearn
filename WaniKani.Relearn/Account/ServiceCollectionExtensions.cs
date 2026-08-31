using WaniKani.Relearn.Account.Data;
using WaniKani.Relearn.Auth.Data;

namespace WaniKani.Relearn.Account;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddAccountManagement(this IServiceCollection services)
    {
        services.AddTransient<IAccountManagementService, AccountManagementService>();
        services.AddTransient<WaniKaniUserSubscriptionService>();
        services.AddScoped<IWaniKaniUserCache, WaniKaniUserCache>();
        return services;
    }
}
