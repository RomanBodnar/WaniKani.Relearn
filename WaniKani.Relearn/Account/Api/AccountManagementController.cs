using System.Security.Claims;
using WaniKani.Relearn.Account.Data;
using WaniKani.Relearn.Auth.Data;
using AuthorizeAttribute = Microsoft.AspNetCore.Authorization.AuthorizeAttribute;

namespace WaniKani.Relearn.Account.Api;

public record SetWaniKaniTokenRequest
{
    public string? Token { get; init; }
    public string? WaniKaniToken { get; init; }
    public bool SaveToDatabase { get; init; }

    public string? ResolvedToken => !string.IsNullOrWhiteSpace(Token) ? Token : WaniKaniToken;
}

public record WaniKaniTokenStatusResponse(
    bool HasToken,
    string StorageType,
    int? MaxAllowedLevel);

[Route("api/account")]
[ApiController]
public class AccountManagementController(
    IAccountManagementService accountManagementService,
    WaniKaniUserSubscriptionService subscriptionService) : ControllerBase
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

        var rawToken = request.ResolvedToken;
        if (string.IsNullOrWhiteSpace(rawToken))
        {
            return BadRequest(new { message = "WaniKani token cannot be empty." });
        }

        int? maxLevel = null;
        if (request.SaveToDatabase)
        {
            await accountManagementService.SetWaniKaniToken(userId, rawToken);
            var status = await accountManagementService.GetWaniKaniTokenStatus(userId);
            maxLevel = status.MaxAllowedLevel;
        }
        else
        {
            try
            {
                var restrictions = await subscriptionService.GetUserMaxLevel(rawToken);
                maxLevel = restrictions.MaxAllowedLevel;
            }
            catch
            {
                maxLevel = 3;
            }
        }

        CookieOptions options = new CookieOptions
        {
            MaxAge = TimeSpan.FromDays(14),
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict
        };
        Response.Cookies.Append("WK-User-Token", rawToken, options);

        return Ok(new WaniKaniTokenStatusResponse(
            HasToken: true,
            StorageType: request.SaveToDatabase ? "Database" : "Cookie",
            MaxAllowedLevel: maxLevel));
    }

    [HttpDelete("wanikani-token")]
    public async Task<IActionResult> RemoveWaniKaniToken()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!string.IsNullOrEmpty(userId))
        {
            await accountManagementService.RemoveWaniKaniToken(userId);
        }

        Response.Cookies.Delete("WK-User-Token");
        return NoContent();
    }

    [HttpGet("wanikani-status")]
    public async Task<IActionResult> GetWaniKaniTokenStatus()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!string.IsNullOrEmpty(userId))
        {
            var dbStatus = await accountManagementService.GetWaniKaniTokenStatus(userId);
            if (dbStatus.HasToken)
            {
                return Ok(new WaniKaniTokenStatusResponse(
                    HasToken: true,
                    StorageType: "Database",
                    MaxAllowedLevel: dbStatus.MaxAllowedLevel));
            }
        }

        var cookieToken = Request.Cookies["WK-User-Token"];
        if (!string.IsNullOrEmpty(cookieToken))
        {
            int? maxAllowedLevel = null;
            try
            {
                var restrictions = await subscriptionService.GetUserMaxLevel(cookieToken);
                maxAllowedLevel = restrictions.MaxAllowedLevel;
            }
            catch
            {
                maxAllowedLevel = 3;
            }

            return Ok(new WaniKaniTokenStatusResponse(
                HasToken: true,
                StorageType: "Cookie",
                MaxAllowedLevel: maxAllowedLevel));
        }

        return Ok(new WaniKaniTokenStatusResponse(
            HasToken: false,
            StorageType: "None",
            MaxAllowedLevel: 3));
    }
}
