using WaniKani.Relearn;
using Refit;

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
                ["WaniKani:Revision"] = "20170710"
            });

        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var services = builder.Services;
        var configuration = builder.Configuration;

        services.AddRefitClient<IAssignmentApi>()
        .ConfigureHttpClient(c => 
        {
            c.BaseAddress = new Uri(configuration["WaniKani:Api"]!);
            var accessToken = configuration["WaniKani:AccessToken"]!;
            c.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
            c.DefaultRequestHeaders.Add("Wanikani-Revision", configuration["WaniKani:Revision"]);
        });

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