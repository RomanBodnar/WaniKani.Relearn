namespace WaniKani.Relearn.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddRefitClients(this IServiceCollection services, IConfiguration configuration)
    {
        services
        .AddRefitClient<IAssignmentApi>()
        .ConfigureHttpClient(c =>
        {
            c.BaseAddress = new Uri(configuration["WaniKani:Api"]!);
            var accessToken = configuration["WaniKani:AccessToken"]!;
            c.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
            c.DefaultRequestHeaders.Add("Wanikani-Revision", configuration["WaniKani:Revision"]);
        });

        services
        .AddRefitClient<IReviewStatisticApi>()
        .ConfigureHttpClient(c =>
        {
            c.BaseAddress = new Uri(configuration["WaniKani:Api"]!);
            var accessToken = configuration["WaniKani:AccessToken"]!;
            c.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
            c.DefaultRequestHeaders.Add("Wanikani-Revision", configuration["WaniKani:Revision"]);
        });

        return services;
    }
}
