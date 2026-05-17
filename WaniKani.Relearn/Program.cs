using Microsoft.AspNetCore.Authentication.Cookies;
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
            .AddEnvironmentVariables()
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
                .AllowAnyHeader()
                .AllowCredentials());
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
            .AddDataAccessMappers()
            //.AddHttpLogging()
            .AddCustomHttpLogging()
            .AddRefitClients(configuration);

        services.AddHttpClient<IWaniKaniClient, WaniKaniClient>(client =>
        {
            client.BaseAddress = new Uri(configuration["WaniKani:Api"]!);
            var accessToken = configuration["WaniKani:AccessToken"]!;
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
        });

        builder.Services
            .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(options =>
            {
                options.Cookie.Name = "BonPomAuth";
                options.Cookie.HttpOnly = true;
                options.Cookie.SameSite = SameSiteMode.Lax;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;// Requires HTTPS
                options.LoginPath = "/auth/login";
                options.LogoutPath = "/auth/logout";
    
                // Stop .NET from trying to redirect API calls to a login page
                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return Task.CompletedTask;
                };
            });


        var app = builder.Build();

        // Configure the HTTP request pipeline.
        app.UseSwagger();
        app.UseSwaggerUI();

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseHttpsRedirection();
        app.UseCors("FrontendPolicy");
        app.MapControllers();

        app.Run();
    }
}
