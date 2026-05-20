using System.Diagnostics;
using System.Net.Http.Headers;
using Microsoft.Extensions.Options;

namespace WaniKani.Relearn.Http;

public class HttpLoggingHandlerOptions
{
    public bool LogRequestHeaders { get; set; } = false;
    public bool LogResponseHeaders { get; set; } = false;
    public bool LogRequestBody { get; set; } = false;
    public bool LogResponseBody { get; set; } = false;
    public string[]? SensitiveHeaderNames { get; set; } = ["Authorization", "X-API-Key"];
}

public class HttpLoggingHandler(
    ILogger<HttpLoggingHandler> logger,
    IOptions<HttpLoggingHandlerOptions>? options = null) : DelegatingHandler
{
    private readonly HttpLoggingHandlerOptions _options = options?.Value ?? new HttpLoggingHandlerOptions();

    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        var id = Guid.NewGuid();
        var stopwatch = Stopwatch.StartNew();

        try
        {
            LogRequest(id, request);
            var response = await base.SendAsync(request, cancellationToken);
            stopwatch.Stop();
            LogResponse(id, response, stopwatch);
            return response;
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            logger.LogError(
                ex,
                "[{Id}] Request failed after {ElapsedMs}ms: {Method} {Uri}",
                id,
                stopwatch.ElapsedMilliseconds,
                request.Method,
                request.RequestUri);
            throw;
        }
    }

    private void LogRequest(Guid id, HttpRequestMessage request)
    {
        logger.LogInformation(
            "[{Id}] {Method} {Uri}",
            id,
            request.Method,
            request.RequestUri);

        if (_options.LogRequestHeaders)
        {
            LogHeaders(id, "Request", request.Headers);
        }
    }

    private void LogResponse(Guid id, HttpResponseMessage response, Stopwatch stopwatch)
    {
        logger.LogInformation(
            "[{Id}] Response: {StatusCode} in {ElapsedMs}ms",
            id,
            (int)response.StatusCode,
            stopwatch.ElapsedMilliseconds);

        if (_options.LogResponseHeaders)
        {
            LogHeaders(id, "Response", response.Headers);
        }
    }

    private void LogHeaders(Guid id, string type, HttpHeaders headers)
    {
        var sensitiveNames = _options.SensitiveHeaderNames ?? Array.Empty<string>();
        var headerLog = string.Join(
            ", ",
            headers
                .Where(h => !sensitiveNames.Contains(h.Key, StringComparer.OrdinalIgnoreCase))
                .Select(h => $"{h.Key}={string.Join(",", h.Value)}"));

        logger.LogInformation("[{Id}] {Type} Headers: {Headers}", id, type, headerLog);
    }
}
