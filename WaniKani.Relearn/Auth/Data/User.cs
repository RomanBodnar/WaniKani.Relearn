using System;
using Google.Cloud.Firestore;

namespace WaniKani.Relearn;

[FirestoreData]
public class User
{
    [FirestoreDocumentId]
    public required string UserId { get; set; }
    [FirestoreProperty]
    public required string Username { get; set; }
    [FirestoreProperty]
    public required string Email { get; set; }
}

[FirestoreData]
public record UserCredentials
{
    [FirestoreDocumentId]
    public required string UserId { get; set; }
    [FirestoreProperty]
    public required string Email { get; set; }
    [FirestoreProperty]
    public required string PasswordHash { get; set; }

    [FirestoreProperty]
    public required DateTime CreatedAt { get; set; }
    [FirestoreProperty]
    public DateTime? PasswordLastChanged { get; set; }
}