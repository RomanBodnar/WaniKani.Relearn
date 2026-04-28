# GCP Cloud Run Migration Plan

This document outlines the steps required to migrate the **WaniKani.Relearn** .NET backend from a local/server-based environment to **Google Cloud Run**.

## 1. Containerization (Dockerfile)
Cloud Run requires a container image. Create a `Dockerfile` in the root of the backend project (`/WaniKani.Relearn/`).

```dockerfile
# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["WaniKani.Relearn.csproj", "./"]
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .

# Cloud Run injects the PORT environment variable
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "WaniKani.Relearn.dll"]
```

### Alternative: Containerize via .csproj (No Dockerfile)
Modern .NET (7+) allows you to build container images directly from the build system without a `Dockerfile` using the `Microsoft.NET.Build.Containers` package.

1.  **Add the package**:
    ```bash
    dotnet add package Microsoft.NET.Build.Containers
    ```
2.  **Add properties to your `.csproj`**:
    ```xml
    <PropertyGroup>
      <ContainerImageName>wanikani-relearn</ContainerImageName>
      <ContainerRegistry>gcr.io/YOUR_PROJECT_ID</ContainerRegistry>
      <!-- Optional: Set the base image -->
      <ContainerBaseImage>mcr.microsoft.com/dotnet/aspnet:8.0</ContainerBaseImage>
    </PropertyGroup>
    ```
3.  **Publish directly to the registry**:
    ```bash
    dotnet publish --os linux --arch x64 /t:PublishContainer
    ```


## 2. Secrets Management (Google Secret Manager)
Instead of hardcoding the WaniKani API token or keeping it in `appsettings.json`:
1.  Enable the **Secret Manager API** in the GCP Console.
2.  Create a secret named `WANIKANI_ACCESS_TOKEN`.
3.  Grant the **Cloud Run Service Account** the `roles/secretmanager.secretAccessor` role.
4.  In the Cloud Run deployment settings, map this secret to an Environment Variable named `WaniKani__AccessToken` (Note the double underscore for .NET nested configuration mapping).

## 3. Data Access Migration (S3/Local -> GCS)
If you currently rely on local static files for subjects or mnemonics:
1.  Create a **Google Cloud Storage (GCS)** bucket.
2.  Upload your static assets to the bucket.
3.  Update `StaticFileDataAccess.cs` to use the `Google.Cloud.Storage.V1` NuGet package instead of `System.IO`.

## 4. Addressing Statelessness
Because Cloud Run is ephemeral:
*   **Background Tasks**: The `InMemoryDataLoader` will run every time a new instance starts. This is acceptable for small datasets, but for larger ones, consider moving this logic to a scheduled **Cloud Function**.
*   **Caching**: If you need a persistent cache across different container instances, provision a **Memorystore for Redis** instance.

## 5. Firebase/Firestore Integration
For persistent subject storage with a generous free tier, you can use **Cloud Firestore** (the database part of Firebase).

### Setup Steps
1.  **Enable Firestore**: Go to the GCP Console and create a Firestore database in **Native Mode**.
2.  **NuGet Package**: Add the Firestore client library to your .NET project:
    ```bash
    dotnet add package Google.Cloud.Firestore
    ```

### Implementation (FirebaseDataAccess.cs)
Create a new data access class that implements your storage interface:

```csharp
using Google.Cloud.Firestore;

public class FirebaseDataAccess 
{
    private readonly FirestoreDb _db;

    public FirebaseDataAccess(string projectId)
    {
        _db = FirestoreDb.Create(projectId);
    }

    public async Task SaveSubjectAsync(Subject subject)
    {
        DocumentReference docRef = _db.Collection("subjects").Document(subject.Id.ToString());
        await docRef.SetAsync(subject);
    }

    public async Task<Subject> GetSubjectAsync(int id)
    {
        DocumentReference docRef = _db.Collection("subjects").Document(id.ToString());
        DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();
        return snapshot.Exists ? snapshot.ConvertTo<Subject>() : null;
    }
}
```

### Authentication
When running on **Cloud Run**, you don't need to manage credential files. The library will automatically use the **Service Account** associated with your Cloud Run service. Simply ensure that the service account has the `Cloud Datastore User` role.

---

## 6. Setup Artifact Registry
Google recommends using **Artifact Registry** instead of the older Container Registry (gcr.io).

1.  **Enable the API**:
    ```bash
    gcloud services enable artifactregistry.googleapis.com
    ```
2.  **Create a Repository**:
    ```bash
    gcloud artifacts repositories create REPO_NAME \
        --repository-format=docker \
        --location=us-central1 \
        --description="Docker repository for WaniKani Relearn"
    ```
3.  **Configure Docker Authentication**:
    ```bash
    gcloud auth configure-docker us-central1-docker.pkg.dev
    ```

---

## 7. Deployment Steps
You can deploy directly from your terminal using the Google Cloud SDK:

```bash
# 1. Build and submit the image to Artifact Registry
# Replace LOCATION, PROJECT_ID, and REPO_NAME with your values
gcloud builds submit --tag us-central1-docker.pkg.dev/YOUR_PROJECT_ID/YOUR_REPO_NAME/wanikani-relearn

# 2. Deploy to Cloud Run
gcloud run deploy wanikani-relearn \
  --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/YOUR_REPO_NAME/wanikani-relearn \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="WaniKani__Api=https://api.wanikani.com/v2/"
```

## 8. Continuous Deployment (Optional)
For a professional workflow, set up **Cloud Build Triggers**:
1.  Connect your GitHub repository to Google Cloud.
2.  Create a build trigger that runs on every push to the `main` branch.
3.  Cloud Build will automatically rebuild the Docker image and rollout the new version to Cloud Run with zero downtime.

## 9. Cost Optimization
*   Set the **Minimum Instances** to `0` to ensure you only pay when requests are active.
*   Set **Concurrency** to `80` (default) or higher to allow a single container to handle multiple users simultaneously, maximizing the "Free Tier" efficiency.
