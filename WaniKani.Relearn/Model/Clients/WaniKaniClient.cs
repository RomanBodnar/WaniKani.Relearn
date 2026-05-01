using Newtonsoft.Json;
using Microsoft.AspNetCore.WebUtilities;
using static System.Math;
namespace WaniKani.Relearn;

public interface IWaniKaniClient
{
    Task<string> GetByUrl(string url);
    Task<CollectionResource<Assignment>> GetAssignments(AssignmentsQuery assignmentsQuery);
}

public class WaniKaniClient(
    HttpClient httpClient) : IWaniKaniClient
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
            var parameters = new Dictionary<string, string?>
            {
                ["immediately_available_for_review"] = assignmentsQuery.ImmediatelyAvailableForReview?.ToString().ToLower() ?? null,
                ["immediately_available_for_lessons"] = assignmentsQuery.ImmediatelyAvailableForLessons?.ToString().ToLower() ?? null,
            };
            
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri(QueryHelpers.AddQueryString(new Uri(httpClient.BaseAddress, "assignments").ToString(), parameters))
            };

            var response = await httpClient.SendAsync(request);

            var code = response.StatusCode;
            var resourcesJson = await response.Content.ReadAsStringAsync();
            var collectionResource = System.Text.Json.JsonSerializer.Deserialize<CollectionResource<Assignment>>(resourcesJson);
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