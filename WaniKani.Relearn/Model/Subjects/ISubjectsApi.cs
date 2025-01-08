namespace WaniKani.Relearn;

public interface ISubjectsApi
{
    [Get("/subjects")]
    Task<CollectionResource<Subject>> GetSubjects(SubjectsQuery queryParams);

    [Get("/subjects/{id}")]
    Task<SingleResource<Subject>> GetSubject(int id);
}
