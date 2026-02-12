using WaniKani.Relearn;
using WaniKani.Relearn.Extensions;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Configuration
        IHostEnvironment env = builder.Environment;
         
        builder.Configuration
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
            .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true, reloadOnChange: true)
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["WaniKani:Api"] = "https://api.wanikani.com/v2/",
                ["WaniKani:AccessToken"] = "a31b5b14-24cb-482a-8c93-ca6a17e3fa08",
                ["WaniKani:Revision"] = "20170710",
                ["StaticFiles:Path"] = Path.Combine(env.ContentRootPath, "static")
            });

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("localhost", policy => policy.AllowAnyOrigin());
        });

        builder.Services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        });
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var services = builder.Services;
        var configuration = builder.Configuration;

        services
            .AddDataAccess()
            .AddServices()
            .AddRefitClients(configuration);

        services.AddHttpClient<IWaniKaniClient, WaniKaniClient>(client =>
        {
            client.BaseAddress = new Uri(configuration["WaniKani:Api"]!);
            var accessToken = configuration["WaniKani:AccessToken"]!;
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
        });

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.MapControllers();

        app.Run();
    }
}