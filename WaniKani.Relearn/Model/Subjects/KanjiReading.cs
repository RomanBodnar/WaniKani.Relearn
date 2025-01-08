namespace WaniKani.Relearn;

public class KanjiReading
{
    /// <summary>
    /// A singular subject reading.
    /// </summary>
    public string Reading { get; init; }

    /// <summary>
    /// Indicates priority in the WaniKani system.
    /// </summary>
    public bool Primary { get; init; }

    /// <summary>
    /// Indicates if the reading is used to evaluate user input for correctness.
    /// </summary>
    public bool AcceptedAnswer { get; init; }

    /// <summary>
    /// The kanji reading's classfication: kunyomi, nanori, or onyomi.
    /// </summary>
    public string Type { get; init; }
}
