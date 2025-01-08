namespace WaniKani.Relearn.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddRefitClients(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddRefitClient<IAssignmentApi>()
            .ConfigureHttpClient(c => ConfigureHttpClient(c, configuration));

        services
            .AddRefitClient<IReviewStatisticApi>()
            .ConfigureHttpClient(c => ConfigureHttpClient(c, configuration));

        services
            .AddRefitClient<ISubjectsApi>()
            .ConfigureHttpClient(c => ConfigureHttpClient(c, configuration));;
        
        services
            .AddRefitClient<IReviewsApi>()
            .ConfigureHttpClient(c => ConfigureHttpClient(c, configuration));
        
        return services;
    }

    private static void ConfigureHttpClient(HttpClient client, IConfiguration configuration)
    {
        client.BaseAddress = new Uri(configuration["WaniKani:Api"]!);
        var accessToken = configuration["WaniKani:AccessToken"]!;
        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
        client.DefaultRequestHeaders.Add("Wanikani-Revision", configuration["WaniKani:Revision"]);
    }
}
