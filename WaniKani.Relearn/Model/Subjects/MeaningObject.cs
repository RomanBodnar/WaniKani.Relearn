namespace WaniKani.Relearn;

public class MeaningObject
{
    /// <summary>
    /// A singular subject meaning.
    /// </summary>
    public string Meaning { get; init; }

    /// <summary>
    /// Indicates priority in the WaniKani system.
    /// </summary>
    public bool Primary { get; init; }

    /// <summary>
    /// Indicates if the meaning is used to evaluate user input for correctness.
    /// </summary>
    public bool AcceptedAnswer { get; init; }
}
