using WaniKani.Relearn;
using WaniKani.Relearn.Extensions;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Configuration
        IHostEnvironment env = builder.Environment;
         
        builder.Configuration
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
            .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true, reloadOnChange: true)
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["StaticFiles:Path"] = Path.Combine(env.ContentRootPath, "static")
            });

        builder.Services.AddCors(options =>
        {
            var allowedOrigins = builder.Configuration.GetSection("AllowedCorsOrigins").Get<string[]>() ?? Array.Empty<string>();
            
            options.AddPolicy("FrontendPolicy", policy => policy
                .WithOrigins(allowedOrigins)
                .AllowAnyMethod()
                .AllowAnyHeader());
        });

        builder.Services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            options.JsonSerializerOptions.NumberHandling = JsonNumberHandling.AllowReadingFromString;
        });
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var services = builder.Services;
        var configuration = builder.Configuration;
        services
            .AddDataAccess()
            .AddServices()
            .AddMappers()
            //.AddHttpLogging()
            .AddCustomHttpLogging()
            .AddRefitClients(configuration);

        services.AddHttpClient<IWaniKaniClient, WaniKaniClient>(client =>
        {
            client.BaseAddress = new Uri(configuration["WaniKani:Api"]!);
            var accessToken = configuration["WaniKani:AccessToken"]!;
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
        });

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        app.UseSwagger();
        app.UseSwaggerUI();

        app.UseHttpsRedirection();
        app.UseCors("FrontendPolicy");
        app.MapControllers();

        app.Run();
    }
}