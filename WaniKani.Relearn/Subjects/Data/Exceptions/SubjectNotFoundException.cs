namespace WaniKani.Relearn.Subjects.Data.Exceptions;

public class SubjectNotFoundException(int subjectId) : Exception($"Subject with ID {subjectId} not found.");