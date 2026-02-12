namespace WaniKani.Relearn;

// check 
public interface IResource<out T>
{
}

public record CollectionResource<T> : IResource<T>
{
    /// <summary>
    /// The kind of object returned. See the object types section below for all the kinds. (Resources.cs)
    /// </summary>
    [JsonPropertyName("object")]
    public string Object { get; init;}
    
    /// <summary>
    /// The URL of the request. 
    /// For collections, that will contain all the filters and options you've passed to the API. 
    /// Resources have a single URL and don't need to be filtered, so the URL will be 
    /// the same in both resource and collection responses.
    /// </summary>
    [JsonPropertyName("url")]
    public string Url  { get; init; }

    [JsonPropertyName("pages")]
    public Pagination Pages { get; init; }

    [JsonPropertyName("total_count")]
    public int TotalCount { get; init; }

    /// <summary>
    /// For collections, this is the timestamp of the most recently updated resource in 
    /// the specified scope and is not limited by pagination. 
    /// If no resources were returned for the specified scope, 
    /// then this will be null. For a resource, then this is the last time that particular resource was updated.
    /// </summary>
    [JsonPropertyName("data_updated_at")]
    public DateTime DataUpdatedAt { get; init; }

    /// <summary>
    /// For collections, this is going to be the resources returned by the specified scope. 
    /// For resources, these are the attributes that are specific to that particular instance and kind of resource.
    /// </summary>
    [JsonPropertyName("data")]
    public IReadOnlyCollection<SingleResource<T>> Data { get; init; } = [];
}
