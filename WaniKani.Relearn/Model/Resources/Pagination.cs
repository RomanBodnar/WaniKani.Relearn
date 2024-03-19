using Newtonsoft.Json;

namespace WaniKani.Relearn;

public class Pagination
{   
    [JsonProperty("next_url")]
    public string NextUrl { get; set; }

    [JsonProperty("previous_url")]
    public string PreviousUrl { get; set;}

    [JsonProperty("per_page")]
    public int PerPage { get; set;}
}
