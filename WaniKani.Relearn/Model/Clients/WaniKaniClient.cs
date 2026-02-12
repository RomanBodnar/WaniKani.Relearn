using Newtonsoft.Json;

namespace WaniKani.Relearn;

public interface IWaniKaniClient
{
    Task<string> GetByUrl(string url);
    Task<CollectionResource<Assignment>> GetAssignments(AssignmentsQuery assignmentsQuery);
}

public class WaniKaniClient(
    HttpClient httpClient
) : IWaniKaniClient
{
    public async Task<string> GetByUrl(string url)
    {
        var request = new HttpRequestMessage
        {
            Method = HttpMethod.Get,
            RequestUri = new Uri(httpClient.BaseAddress, url)
        };

        var response = await httpClient.SendAsync(request);
        return await response.Content.ReadAsStringAsync();
    }

    public async Task<CollectionResource<Assignment>> GetAssignments(AssignmentsQuery assignmentsQuery)
    {
        try
        {
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri(httpClient.BaseAddress, "assignments")
            };

            var response = await httpClient.SendAsync(request);

            var code = response.StatusCode;
            var resourcesJson = await response.Content.ReadAsStringAsync();
            var collectionResource = JsonConvert.DeserializeObject<CollectionResource<Assignment>>(resourcesJson);
            return collectionResource;
        } 
        catch (Exception e)
        {
            string message = e.Message;
            Console.WriteLine(message);
            return null;
        }
    }
}