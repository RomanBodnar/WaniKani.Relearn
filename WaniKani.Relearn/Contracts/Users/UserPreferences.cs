namespace WaniKani.Relearn.Contracts.Users;

public record UserPreferences
{
    /// <summary>
    /// Automatically play pronunciation audio for vocabulary during extra study.
    /// </summary>
    [JsonPropertyName("extra_study_autoplay_audio")]
    public bool ExtraStudyAutoplayAudio { get; set; }

    /// <summary>
    /// Automatically play pronunciation audio for vocabulary during lessons.
    /// </summary>
    [JsonPropertyName("lessons_autoplay_audio")]
    public bool LessonsAutoplayAudio { get; set; }

    /// <summary>
    /// Number of subjects introduced to the user during lessons before quizzing.
    /// </summary>
    [JsonPropertyName("lessons_batch_size")]
    public int LessonsBatchSize { get; set; }

    /// <summary>
    /// Automatically play pronunciation audio for vocabulary during reviews.
    /// </summary>
    [JsonPropertyName("reviews_autoplay_audio")]
    public bool ReviewsAutoplayAudio { get; set; }

    /// <summary>
    /// Toggle for display SRS change indicator after a subject has been completely answered during review.
    /// </summary>
    [JsonPropertyName("reviews_display_srs_indicator")]
    public bool ReviewsDisplaySrsIndicator { get; set; }

    /// <summary>
    /// The order in which reviews are presented. The options are shuffled and lower_levels_first. 
    /// The default (and best experience) is shuffled.
    /// </summary>
    [JsonPropertyName("reviews_presentation_order")]
    public string ReviewsPresentationOrder { get; set; } = string.Empty;
}
