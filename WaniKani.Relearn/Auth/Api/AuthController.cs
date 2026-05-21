using System.Security.Claims;
using System.Text;
using FluentValidation;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using WaniKani.Relearn.Auth.Data;

namespace WaniKani.Relearn.Auth.Api;

[Route("api/auth")]
[ApiController]
public class AuthController(
    IUserService userService,
    IValidator<RegisterUserRequest> registerValidator
) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var isValid = await userService.ValidateUserCredentials(request.Email, request.Password);
        if (!isValid)
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }
        var user = await userService.GetUserByEmail(request.Email);
        if (user is null)
        {        
            return new ObjectResult(new { message = "User not found" }) { StatusCode = StatusCodes.Status500InternalServerError }; 
        }
        var claims = new List<Claim>
        {
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Name, user.Username),
            new(ClaimTypes.Role, "User")
        };
        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var principal = new ClaimsPrincipal(identity);

        // 3. This automatically issues the encrypted cookie to React
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

        // 4. Set up the Public Claims Cookie for React (HttpOnly = false)
        string jsonClaims = Convert.ToBase64String(
            Encoding.UTF8.GetBytes(
                JsonSerializer.Serialize(claims)));
        Response.Cookies.Append("X-User-Claims", jsonClaims, new CookieOptions
        {
            HttpOnly = false, // <-- Crucial: JS needs to read this
            Secure = true,
            SameSite = SameSiteMode.Lax,
            // Expires = DateTimeOffset.UtcNow.AddMinutes(15) // Keep synced with session lifetime
        });

        return Ok(new { message = "Logged in successfully" });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        Response.Cookies.Delete("X-User-Claims");
        return Ok(new { message = "Logged out" });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserRequest request)
    {
        if ( (await registerValidator.ValidateAsync(request)) is { IsValid: false } validationResult)
        {
            return BadRequest(validationResult.Errors);
        }

        await userService.CreateUser(request.Username, request.Email, request.Password);
        return Ok(new { message = "User registered successfully" });
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [HttpGet("me")]
    public IActionResult GetCurrentUser()
    {
        // Extract roles/permissions from the current user identity
        var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        var username = User.Identity?.Name;

        // Send this info safely to React in the JSON body
        return Ok(new
        {
            isAuthenticated = true,
            username,
            email,
            roles // e.g., ["Admin", "Manager"]
        });
    }
}
