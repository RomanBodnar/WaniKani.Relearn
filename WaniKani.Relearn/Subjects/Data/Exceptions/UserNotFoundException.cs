namespace WaniKani.Relearn.Subjects.Data.Exceptions;

public class UserNotFoundException(string userId) : Exception($"User with ID {userId} does not exist.");