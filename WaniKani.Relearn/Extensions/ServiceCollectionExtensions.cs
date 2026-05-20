using Google.Cloud.Firestore;
using WaniKani.Relearn.Auth.Data;
using WaniKani.Relearn.Contracts.Assignments;
using WaniKani.Relearn.Contracts.Reviews;
using WaniKani.Relearn.Contracts.Subjects;
using WaniKani.Relearn.Http;
using WaniKani.Relearn.Services;
using WaniKani.Relearn.Subjects.Data;

namespace WaniKani.Relearn.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddDataAccess(this IServiceCollection services, IConfiguration configuration)
    {
        var projectId = configuration["Firebase:ProjectId"];
        var databaseId = configuration["Firebase:DatabaseId"];

        services.AddHostedService<InMemoryDataLoader>();
        services.AddSingleton<SubjectCache>();
        services.AddSingleton<IDataAccess, StaticFileDataAccess>();
        services.AddSingleton<SentenceCache>();
        services.AddSingleton<SentenceExtractor>();
        
        services.AddSingleton<FirestoreDb>(_ =>
        {
            // Automatically uses Application Default Credentials (ADC)
            var builder = new FirestoreDbBuilder
            {
                ProjectId = projectId,
                DatabaseId = databaseId
            };
            return builder.Build();
        });

        return services;
    }

    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddScoped<SubjectsService>();
        services.AddTransient<IPasswordHasher, PasswordHasher>();
        services.AddTransient<IUserService, UserService>();
        return services;
    }

    public static IServiceCollection AddDataAccessMappers(this IServiceCollection services)
    {
        services.AddTransient<Subjects.Data.Mappers.KanjiMapper>();
        services.AddTransient<Subjects.Data.Mappers.VocabularyMapper>();
        services.AddTransient<Subjects.Data.Mappers.KanaVocabularyMapper>();
        services.AddTransient<Subjects.Data.Mappers.RadicalMapper>();
        return services;
    }

    public static IServiceCollection AddMappers(this IServiceCollection services)
    {
        services.AddScoped<Subjects.Api.Mappers.KanjiMapper>();
        services.AddScoped<Subjects.Api.Mappers.VocabularyMapper>();
        services.AddScoped<Subjects.Api.Mappers.RadicalMapper>();
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
