using System.ComponentModel.DataAnnotations;

namespace WaniKani.Relearn.Auth.Api;

public record  LoginRequest(
    [Required]
    [EmailAddress]
    string Email,
    [Required]
    string Password
);
