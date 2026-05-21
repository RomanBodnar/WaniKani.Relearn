using System.ComponentModel.DataAnnotations;
using FluentValidation;
using WaniKani.Relearn.Auth.Data;

namespace WaniKani.Relearn.Auth.Api;

public record RegisterUserRequest(
    
    string Username,
    
    string Password,
   
    string Email
);

public class RegisterUserRequestValidator : AbstractValidator<RegisterUserRequest>
{
    public RegisterUserRequestValidator(IUserService userService)
    {
        RuleFor(x => x.Username)
            .NotEmpty()
            .Length(2, 100)
            .MustAsync(async (username, cancellation) =>
            {
                var existingUser = await userService.GetUserByUsername(username, cancellation);
                return existingUser == null;
            }).WithMessage("Username is already taken.");

        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(8);

        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .MustAsync(async (email, cancellation) =>
            {
                var existingUser = await userService.GetUserByEmail(email, cancellation);
                return existingUser == null;
            }).WithMessage("Email is already in use.");
    }
}