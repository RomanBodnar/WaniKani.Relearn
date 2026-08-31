using WaniKani.Relearn.Subjects.Data;
using WaniKani.Relearn.Subjects.Services;

namespace WaniKani.Relearn.Subjects;

public static class SubjectsServiceCollectionExtensions
{
    public static IServiceCollection AddSubjectsApi(this IServiceCollection services)
    {
        services.AddSubjectsData();
        return services;
    }
    
    public static IServiceCollection AddSubjectsData(this IServiceCollection services)
    {
        services.AddTransient<IUserSubjectsService, UserSubjectsService>();
        services.AddScoped<IUserReadingPracticeService, UserReadingPracticeService>();
        services.AddScoped<SubjectMnemonicFilter>();
        return services;
    }    
}