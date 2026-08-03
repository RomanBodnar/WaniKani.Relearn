using FluentValidation;
using WaniKani.Relearn.Auth.Api;
using WaniKani.Relearn.Auth.Data;

namespace WaniKani.Relearn.Auth;

public static class AuthServiceCollectionExtensions
{
    public static IServiceCollection AddAuthApi(this IServiceCollection services)
    {
        services.AddValidators();
        services.AddAuthData();
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
}