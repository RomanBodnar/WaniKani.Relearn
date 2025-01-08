namespace WaniKani.Relearn;

public class Pagination
{   
    [JsonPropertyName("next_url")]
    public string NextUrl { get; set; }

    [JsonPropertyName("previous_url")]
    public string PreviousUrl { get; set;}

    [JsonPropertyName("per_page")]
    public int PerPage { get; set;}
}
