using Newtonsoft.Json;

namespace WaniKani.Relearn;

public class SingleResource
{
    [JsonProperty("id")]
    public int Id { get; set; }
    
    /// <summary>
    /// The kind of object returned. See the object types section below for all the kinds. (Resources.cs)
    /// </summary>
    [JsonProperty("object")]
    public string Object { get; set; }

    /// <summary>
    /// The URL of the request. 
    /// For collections, that will contain all the filters and options you've passed to the API. 
    /// Resources have a single URL and don't need to be filtered, so the URL will be 
    /// the same in both resource and collection responses.
    /// </summary>
    [JsonProperty("url")]
    public string Url  { get; set; }

    /// <summary>
    /// For collections, this is the timestamp of the most recently updated resource in 
    /// the specified scope and is not limited by pagination. 
    /// If no resources were returned for the specified scope, 
    /// then this will be null. For a resource, then this is the last time that particular resource was updated.
    /// </summary>
    [JsonProperty("data_updated_at")]
    public DateTime DataUpdatedAt { get; set; }

    /// <summary>
    /// For collections, this is going to be the resources returned by the specified scope. 
    /// For resources, these are the attributes that are specific to that particular instance and kind of resource.
    /// </summary>
    [JsonProperty("data")]
    public object Data { get; set; }
}
