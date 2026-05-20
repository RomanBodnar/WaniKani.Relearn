using System.ComponentModel.DataAnnotations;

namespace WaniKani.Relearn.Auth;

public record class RegisterUserRequest(
    [Required]
    [StringLength(100, MinimumLength = 2)]
    string Username,
    [Required]
    [StringLength(100, MinimumLength = 8)]
    [DataType(DataType.Password)]
    string Password,
    [Required]
    [EmailAddress]
    string Email
);
