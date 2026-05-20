using WaniKani.Relearn.Contracts.Resources;

namespace WaniKani.Relearn.Contracts.Subjects;

public interface ISubjectsApi
{
    [Get("/subjects")]
    Task<CollectionResource<TSubject>> GetSubjects<TSubject>(SubjectsQuery queryParams) where TSubject : Subject;

    [Get("/subjects/{id}")]
    Task<SingleResource<TSubject>> GetSubject<TSubject>(int id) where TSubject : Subject;
}
