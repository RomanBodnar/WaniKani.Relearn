namespace WaniKani.Relearn;

public class Radical : Subject
{
    /// <summary>
    /// An array of numeric identifiers for the kanji that have the radical as a component.
    /// </summary>
    public IReadOnlyCollection<string> AmalgationSubjectIds { get; }

    /// <summary>
    /// Unlike kanji and vocabulary, radicals can have a null value for characters. 
    /// Not all radicals have a UTF entry, so the radical must be visually represented with an image instead.
    /// </summary>
    public string? Characters { get; }

    /// <summary>
    /// A collection of images of the radical. 
    /// </summary>
    public IReadOnlyCollection<CharacterImage> CharacterImages { get; }
}
