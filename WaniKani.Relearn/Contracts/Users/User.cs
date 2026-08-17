namespace WaniKani.Relearn.Contracts.Users;

public record User
{
    /// <summary>
    /// If the user is on vacation, this will be the timestamp of when that vacation started. 
    /// If the user is not on vacation, this is null.
    /// </summary>
    [JsonPropertyName("current_vacation_started_at")]
    public DateTime? CurrentVacationStartedAt { get; set; }

    /// <summary>
    /// The current level of the user. This ignores subscription status.
    /// </summary>
    [JsonPropertyName("level")]
    public int Level { get; set; }

    /// <summary>
    /// User settings specific to the WaniKani application.
    /// </summary>
    [JsonPropertyName("preferences")]
    public UserPreferences Preferences { get; set; }

    /// <summary>
    /// The URL to the user's public facing profile page.
    /// </summary>
    [JsonPropertyName("profile_url")]
    public string ProfileUrl { get; set; } = string.Empty;

    /// <summary>
    /// The signup date for the user.
    /// </summary>
    [JsonPropertyName("started_at")]
    public DateTime StartedAt { get; set; }

    /// <summary>
    /// Details about the user's subscription state. See table below for the object structure.
    /// </summary>
    [JsonPropertyName("subscription")]
    public Subscription Subscription { get; set; } = new Subscription();

    /// <summary>
    /// The user's username.
    /// </summary>
    [JsonPropertyName("username")]
    public string Username { get; set; } = string.Empty;
}
