namespace WaniKani.Relearn;

public class AuxiliaryMeaning
{
    /// <summary>
    /// A singular subject meaning.
    /// </summary>
    public string Meaning { get; }

    /// <summary>
    /// Either 'whitelist' or 'blacklist'. 
    /// When evaluating user input, whitelisted meanings are used to match for correctness. 
    /// Blacklisted meanings are used to match for incorrectness.
    /// </summary>
    public string Type { get; }
}
