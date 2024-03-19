namespace WaniKani.Relearn;

public class VocabularyReading
{
    /// <summary>
    /// Indicates if the reading is used to evaluate user input for correctness.
    /// </summary>
    public bool AcceptedAnswer { get; }

    /// <summary>
    /// Indicates priority in the WaniKani system.
    /// </summary>
    public bool Primary { get; }

    /// <summary>
    /// A singular subject reading.
    /// </summary>
    public string Reading { get; }
}
