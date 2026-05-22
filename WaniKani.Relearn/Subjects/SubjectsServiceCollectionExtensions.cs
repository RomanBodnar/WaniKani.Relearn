using WaniKani.Relearn.Subjects.Data;

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
        return services;
    }    
}