using Microsoft.Extensions.Options;
using System.Security.Claims;
using WaniKani.Relearn.Auth.Data;
using AuthorizeAttribute = Microsoft.AspNetCore.Authorization.AuthorizeAttribute; 

namespace WaniKani.Relearn.Auth.Api;

public record SetWaniKaniTokenRequest(string WaniKaniToken, bool SaveToDatabase);
public record WaniKaniTokenStatusResponse(
    string UserId,
    bool IsSet,
    int? MaxAllowedLevel,
    string? Token);

[Route("api/account")]
[ApiController]
public class AccountManagementController(
    IAccountManagementService accountManagementService) : ControllerBase
{
    [HttpPost("wanikani-token")]
    [Authorize]
    public async Task<IActionResult> SetWaniKaniToken([FromBody] SetWaniKaniTokenRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        if (request.SaveToDatabase)
        {
            // todo: consider returning the encrypted token here
            await accountManagementService.SetWaniKaniToken(userId, request.WaniKaniToken);
        }

        // todo: check if Consent cookie is already set
        CookieOptions options = new CookieOptions
        {
            MaxAge = TimeSpan.FromDays(14),  // 14 days expiry
            HttpOnly = true,     // Avoid JavaScript access
            Secure = true,       // Only sent over HTTPS
            SameSite = SameSiteMode.Strict  // CSRF protection,
            
        };
        Response.Cookies.Append("WK-User-Token", request.WaniKaniToken, options);

        return Ok();

        /*
         * // Retrieves the cookie value using the exact key name
        string cookieValue = Request.Cookies["UserSessionToken"];

        // Validates if the cookie exists on the client's request
        if (string.IsNullOrEmpty(cookieValue))
        {
            return NotFound("Cookie not found or has expired.");
        }

        return Ok($"Successfully retrieved cookie value: {cookieValue}");
         */
    }
}
