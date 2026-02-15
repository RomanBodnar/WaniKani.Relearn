namespace WaniKani.Relearn;

public abstract record Subject
{
    [JsonPropertyName("auxiliary_meanings")]
    public IReadOnlyCollection<AuxiliaryMeaning> AuxiliaryMeanings { get; init; }

    /// <summary>
    /// The UTF-8 characters for the subject, including kanji and hiragana.
    /// </summary>
    [JsonPropertyName("characters")]
    public string Characters { get; init; }

    /// <summary>
    /// Timestamp when the subject was created.
    /// </summary>
    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; init; }

    /// <summary>
    /// A URL pointing to the page on wanikani.com that provides detailed information about this subject.
    /// </summary>
    [JsonPropertyName("document_url")]
    public string DocumentUrl { get; init; }

    /// <summary>
    /// Timestamp when the subject was hidden, indicating associated assignments will no longer 
    /// appear in lessons or reviews and that the subject page is no longer visible on wanikani.com.
    /// </summary>
    [JsonPropertyName("hidden_at")]
    public DateTime? HiddenAt { get; init; }

    /// <summary>
    /// The position that the subject appears in lessons. 
    /// Note that the value is scoped to the level of the subject, so there are duplicate values across levels.
    /// </summary>
    [JsonPropertyName("lesson_position")]
    public int LessonPosition { get; init; }

    /// <summary>
    /// The level of the subject, from 1 to 60.
    /// </summary>
    [JsonPropertyName("level")]
    public int Level { get; init; }

    /// <summary>
    /// The subject's meaning mnemonic.
    /// </summary>
    [JsonPropertyName("meaning_mnemonic")]
    public string MeaningMnemonic { get; init; }

    /// <summary>
    /// The subject meanings.
    /// </summary>
    [JsonPropertyName("meanings")]
    public IReadOnlyCollection<MeaningObject> Meanings { get; init; }

    /// <summary>
    /// The string that is used when generating the document URL for the subject. 
    /// Radicals use their meaning, downcased. Kanji and vocabulary use their characters.
    /// </summary>
    [JsonPropertyName("slug")]
    public string Slug { get; init; }

    /// <summary>
    /// Unique identifier of the associated spaced_repetition_system.
    /// </summary>
    [JsonPropertyName("spaced_repetition_system_id")]
    public int SpacedRepetitionSystemId { get; init; }
}