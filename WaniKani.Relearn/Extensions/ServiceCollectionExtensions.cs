using WaniKani.Relearn.Api.Mappers;
using WaniKani.Relearn.DataAccess;
using WaniKani.Relearn.Http;
using WaniKani.Relearn.Model.Reviews;
using WaniKani.Relearn.Model.Subjects;
using WaniKani.Relearn.Services;

namespace WaniKani.Relearn.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddDataAccess(this IServiceCollection services)
    {
        services.AddHostedService<InMemoryDataLoader>();
        services.AddSingleton<SubjectCache>();
        services.AddSingleton<IDataAccess, StaticFileDataAccess>();
        return services;
    }

    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddScoped<SubjectsService>();
        services.AddScoped<IDashboardService, DashboardService>();
        return services;
    }

    public static IServiceCollection AddMappers(this IServiceCollection services)
    {
        services.AddScoped<KanjiMapper>();
        services.AddScoped<VocabularyMapper>();
        services.AddScoped<RadicalMapper>();
        services.AddScoped<KanaVocabularyMapper>();
        return services;
    }

    public static IServiceCollection AddCustomHttpLogging(this IServiceCollection services)
    {
        services.Configure<HttpLoggingHandlerOptions>(options =>
        {
            options.LogRequestHeaders = true;
            options.LogResponseHeaders = true;
            options.SensitiveHeaderNames = ["Authorization", "X-API-Key"];
        });

        return services.AddTransient<HttpLoggingHandler>();
    }

    public static IServiceCollection AddRefitClients(this IServiceCollection services, IConfiguration configuration)
    {
        var refitSettings = new RefitSettings
        {
            UrlParameterFormatter = new BooleanUrlParameterFormatter(),
            ContentSerializer = new SystemTextJsonContentSerializer(new JsonSerializerOptions
            {
                Converters =
                {
                    new JsonStringEnumConverter(),
                },
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                NumberHandling = JsonNumberHandling.AllowReadingFromString
            })
        };
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
