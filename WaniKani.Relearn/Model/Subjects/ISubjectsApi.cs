namespace WaniKani.Relearn;

public interface ISubjectsApi
{
    [Get("/subjects")]
    Task<CollectionResource<TSubject>> GetSubjects<TSubject>(SubjectsQuery queryParams) where TSubject : Subject;

    [Get("/subjects/{slug}")]
    Task<SingleResource<TSubject>> GetSubject<TSubject>(string slug) where TSubject : Subject;
}
