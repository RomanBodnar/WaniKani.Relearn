namespace WaniKani.Relearn.Subjects.Data;

public record PageResult<T>(
    IEnumerable<T> Data, 
    int Page,
    int PerPage,
    int TotalCount) where T : class;
