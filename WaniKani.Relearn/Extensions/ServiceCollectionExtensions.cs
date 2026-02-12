using WaniKani.Relearn.DataAccess;
using WaniKani.Relearn.Http;
using WaniKani.Relearn.Model.Subjects;

namespace WaniKani.Relearn.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddDataAccess(this IServiceCollection services)
    {
        services.AddSingleton<StaticFileDataAccess>();
        return services;
    }

    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddScoped<SubjectsService>();
        return services;
    }

    public static IServiceCollection AddRefitClients(this IServiceCollection services, IConfiguration configuration)
    {
        var refitSettings = new RefitSettings
        {
            UrlParameterFormatter = new BooleanUrlParameterFormatter()
        };
        services.AddSingleton<HttpLoggingHandler>();
        services
            .AddRefitClient<IAssignmentApi>(refitSettings)
            .ConfigureHttpClient(c => ConfigureHttpClient(c, configuration))
            .AddHttpMessageHandler<HttpLoggingHandler>();

        services
            .AddRefitClient<IReviewStatisticApi>(refitSettings)
            .ConfigureHttpClient(c => ConfigureHttpClient(c, configuration))
            .AddHttpMessageHandler<HttpLoggingHandler>();
        services
            .AddRefitClient<ISubjectsApi>(refitSettings)
            .ConfigureHttpClient(c => ConfigureHttpClient(c, configuration))
            .AddHttpMessageHandler<HttpLoggingHandler>();

        services
            .AddRefitClient<IReviewsApi>(refitSettings)
            .ConfigureHttpClient(c => ConfigureHttpClient(c, configuration))
            .AddHttpMessageHandler<HttpLoggingHandler>();

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
