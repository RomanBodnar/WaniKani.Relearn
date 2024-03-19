using Newtonsoft.Json;

namespace WaniKani.Relearn;

public class Subject
{
    [JsonProperty("auxiliary_meanings")]
    public IReadOnlyCollection<AuxiliaryMeaning> AuxiliaryMeanings { get; }

    /// <summary>
    /// The UTF-8 characters for the subject, including kanji and hiragana.
    /// </summary>
    [JsonProperty("characters")]
    public string Characters { get; }

    /// <summary>
    /// Timestamp when the subject was created.
    /// </summary>
    [JsonProperty("created_at")]
    public DateTime CreatedAt { get; }

    /// <summary>
    /// A URL pointing to the page on wanikani.com that provides detailed information about this subject.
    /// </summary>
    [JsonProperty("document_url")]
    public string DocumentUrl { get; }

    /// <summary>
    /// Timestamp when the subject was hidden, indicating associated assignments will no longer 
    /// appear in lessons or reviews and that the subject page is no longer visible on wanikani.com.
    /// </summary>
    [JsonProperty("hidden_at")]
    public DateTime? HiddenAt { get; }

    /// <summary>
    /// The position that the subject appears in lessons. 
    /// Note that the value is scoped to the level of the subject, so there are duplicate values across levels.
    /// </summary>
    public int LessonPosition { get; }

    /// <summary>
    /// The level of the subject, from 1 to 60.
    /// </summary>
    public int Level { get; }

    /// <summary>
    /// The subject's meaning mnemonic.
    /// </summary>
    public string MeaningMnemonic { get; }

    /// <summary>
    /// The subject meanings.
    /// </summary>
    public IReadOnlyCollection<MeaningObject> Meanings { get; }

    /// <summary>
    /// The string that is used when generating the document URL for the subject. 
    /// Radicals use their meaning, downcased. Kanji and vocabulary use their characters.
    /// </summary>
    public string Slug { get; }

    /// <summary>
    /// Unique identifier of the associated spaced_repetition_system.
    /// </summary>
    public int SpacedRepetitionSystemId { get; }
}