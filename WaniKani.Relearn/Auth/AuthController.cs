using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WaniKani.Relearn.Auth
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (request.Email.Contains("@"))
            {
                // This is a placeholder for the actual login logic.
                // In a real application, you would validate the user's credentials and issue a token or set a cookie.
                var claims = new List<Claim> { 
                    new Claim(ClaimTypes.Email, request.Email),
                    new Claim(ClaimTypes.Role, "User")
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
                    // todo: consider SameSite=None if React is on a different domain, but be aware of security implications
                    // todo: set to Lax in future 
                    SameSite = SameSiteMode.Lax,
                    // Expires = DateTimeOffset.UtcNow.AddMinutes(15) // Keep synced with session lifetime
                });
            
            return Ok(new { message = "Logged in successfully" });
            }
            else
            {
                return BadRequest("Invalid email format.");
            }
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);  
            Response.Cookies.Delete("X-User-Claims");
            return Ok(new { message = "Logged out" });
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterUserRequest request)
        {
            // This is a placeholder for the actual registration logic.
            // In a real application, you would create a new user account.
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
            return Ok(new { 
                isAuthenticated = true, 
                username = username,
                email = email,
                roles = roles // e.g., ["Admin", "Manager"]
            });
        }
    }
}
