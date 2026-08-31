0oijusing FluentValidation;
using WaniKani.Relearn.Account.Data;
using WaniKani.Relearn.Auth.Api;
using WaniKani.Relearn.Auth.Data;

namespace WaniKani.Relearn.Auth;

public static class AuthServiceCollectionExtensions
{
    public static IServiceCollection AddAuthApi(this IServiceCollection services)
    {
        services.AddValidators();
        services.AddAuthData();
        services.AddDataProtectionServices();
        return services;
    }

    public static IServiceCollection AddValidators(this IServiceCollection services)
    {
        services.AddScoped<IValidator<RegisterUserRequest>, RegisterUserRequestValidator>();
        return services;
    }

    public static IServiceCollection AddAuthData(this IServiceCollection services)
    {
        services.AddTransient<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IUserReader, UserService>();
        services.AddScoped<IUserService, UserService>();
        return services;
    }

    public static IServiceCollection AddDataProtectionServices(this IServiceCollection services)
    {
        services.AddDataProtection();
        services.AddTransient<IThirdPartyDataProtector, WaniKaniDataProtector>();
        return services;
    }
}