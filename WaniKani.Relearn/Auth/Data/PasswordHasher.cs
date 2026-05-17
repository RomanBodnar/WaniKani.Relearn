using System.Security.Cryptography;

namespace WaniKani.Relearn.Auth.Data;

public class PasswordHasher : IPasswordHasher
{
    private const int SaltSize = 16;
    private const int HashSize = 32;
    private const int HashIterations = 100_000;

    private readonly HashAlgorithmName _hashAlgorithm = HashAlgorithmName.SHA512;
 
    public string HashPassword(string password)
    {
        byte[] saltBytes = RandomNumberGenerator.GetBytes(SaltSize);
        byte[] hashBytes = Rfc2898DeriveBytes.Pbkdf2(password, saltBytes, HashIterations, _hashAlgorithm, HashSize);
        return $"{Convert.ToHexString(hashBytes)}:{Convert.ToHexString(saltBytes)}";
    }

    public bool VerifyPassword(string password, string hash)
    {
        string[] parts = hash.Split(':');
        if (parts.Length != 2)        {
            throw new FormatException("Invalid hash format.");
        }

        byte[] hashBytes = Convert.FromHexString(parts[0]);
        byte[] saltBytes = Convert.FromHexString(parts[1]);

        byte[] inputHashBytes = Rfc2898DeriveBytes.Pbkdf2(password, saltBytes, HashIterations, _hashAlgorithm, HashSize);

       return CryptographicOperations.FixedTimeEquals(hashBytes, inputHashBytes);
    }
}
