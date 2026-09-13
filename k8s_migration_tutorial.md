# Complete Kubernetes (GKE) Migration Tutorial for WaniKani.Relearn

This hands-on tutorial guides you through deploying **WaniKani.Relearn** to a **Google Kubernetes Engine (GKE) Autopilot** cluster using **Helm**, **Ingress-NGINX**, and **cert-manager** (Let's Encrypt).

---

## Architecture Overview

```
                                  ┌────────────────────────────────────────────────────────┐
                                  │               GKE Cluster (wanikani namespace)         │
                                  │                                                        │
┌──────────────┐                  │   ┌────────────────────────────────────────────────┐   │
│   Internet   │── HTTPS (443) ──►│   │     Ingress-NGINX + cert-manager (SSL/TLS)     │   │
└──────────────┘                  │   └───────────────┬────────────────┬───────────────┘   │
                                  │                   │ /              │ /api, /auth       │
                                  │                   ▼                ▼                   │
                                  │         ┌─────────────────┐ ┌───────────────┐          │
                                  │         │ Frontend Service│ │Backend Service│          │
                                  │         │   (ClusterIP)   │ │  (ClusterIP)  │          │
                                  │         └────────┬────────┘ └───────┬───────┘          │
                                  │                  │                  │                  │
                                  │                  ▼                  ▼                  │
                                  │         ┌─────────────────┐ ┌───────────────┐          │
                                  │         │ Frontend (Nginx)│ │ Backend (.NET)│          │
                                  │         │   (2 Replicas)  │ │ (2 Replicas)  │          │
                                  │         └─────────────────┘ └───────┬───────┘          │
                                  │                                     │                  │
                                  │                         Workload Identity (GCP SA)     │
                                  │                                     │                  │
                                  │                                     ▼                  │
                                  │                         ┌───────────────────────┐      │
                                  │   DB Migration Job ───► │ Shared DataProtection │      │
                                  │   (Helm Pre-hook)       │ Keys (in CockroachDB) │      │
                                  │                         └───────────────────────┘      │
                                  └─────────────────────────────────────┬──────────────────┘
                                                                        │
                                                                        ▼
                                                       ┌─────────────────────────────────┐
                                                       │ Database (CockroachDB Cloud)    │
                                                       └─────────────────────────────────┘
```

---

## Prerequisites

Ensure you have the following CLI tools installed locally:
1. **Google Cloud SDK (`gcloud`)**: [Install Guide](https://cloud.google.com/sdk/docs/install)
2. **Kubernetes CLI (`kubectl`)**: `gcloud components install kubectl`
3. **Helm v3**: [Install Guide](https://helm.sh/docs/intro/install/)
4. **Docker**: Running locally for container builds

Authenticate with Google Cloud:
```bash
gcloud auth login
gcloud auth application-default login
gcloud config set project YOUR_GCP_PROJECT_ID
```

---

## Step 1: Code Adaptations for Kubernetes

### 1.1 Persist Data Protection Keys to Database (Multi-replica Cookie Decryption)
When scaling backend pods, ASP.NET Core cookies (`BonPomAuth`) and encrypted WaniKani tokens require a shared key ring stored in CockroachDB / PostgreSQL.

1. In `WaniKani.Relearn/WaniKani.Relearn.csproj`, add:
```xml
<PackageReference Include="Microsoft.AspNetCore.DataProtection.EntityFrameworkCore" Version="10.0.0" />
<PackageReference Include="AspNetCore.HealthChecks.NpgSql" Version="9.0.0" />
```

2. In `WaniKani.Relearn/Data/BonpomDbContext.cs`, implement `IDataProtectionKeyContext`:
```csharp
using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;

public class BonpomDbContext : DbContext, IDataProtectionKeyContext
{
    // Add DbSet for keys
    public DbSet<DataProtectionKey> DataProtectionKeys { get; set; } = null!;
    
    // ... existing code ...
}
```

3. In `WaniKani.Relearn/Program.cs`, configure Data Protection and Health Checks:
```csharp
using Microsoft.AspNetCore.DataProtection;

// Data Protection persistence
builder.Services.AddDataProtection()
    .PersistKeysToDbContext<BonpomDbContext>()
    .SetApplicationName("WaniKaniRelearn");

// Health Checks (Liveness and Readiness)
builder.Services.AddHealthChecks()
    .AddNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")!, name: "database");

var app = builder.Build();

// Expose probes
app.MapHealthChecks("/healthz");
app.MapHealthChecks("/ready");
```

---

### 1.2 Optimize Frontend for Production (SPA on Nginx)

1. Create `WaniKani.Relearn.FE/nginx.conf`:
```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

2. Update `WaniKani.Relearn.FE/Dockerfile`:
```dockerfile
# Build Stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime Stage
FROM nginx:alpine
COPY --from=build /app/build/client /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Step 2: Create GKE Autopilot Cluster

GKE Autopilot manages node scaling and security automatically while offering a free control plane monthly credit.

```bash
# Variables
export PROJECT_ID="YOUR_GCP_PROJECT_ID"
export REGION="europe-west1"
export CLUSTER_NAME="wanikani-cluster"

# Enable required Google APIs
gcloud services enable container.googleapis.com artifactregistry.googleapis.com

# Create GKE Autopilot Cluster
gcloud container clusters create-auto $CLUSTER_NAME \
    --region $REGION \
    --project $PROJECT_ID \
    --release-channel regular

# Fetch kubeconfig credentials
gcloud container clusters get-credentials $CLUSTER_NAME --region $REGION --project $PROJECT_ID

# Verify connection
kubectl get nodes
```

---

## Step 3: Create Artifact Registry & Build Images

```bash
export REPO_NAME="wanikani-relearn"

# 1. Create Docker repository in Artifact Registry
gcloud artifacts repositories create $REPO_NAME \
    --repository-format=docker \
    --location=$REGION \
    --description="Docker repository for WaniKani Relearn"

# 2. Authenticate Docker with Artifact Registry
gcloud auth configure-docker $REGION-docker.pkg.dev

# 3. Build & Push Backend
docker build -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/wanikanirelearn:v1.0.0 \
    -f WaniKani.Relearn/Dockerfile WaniKani.Relearn
docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/wanikanirelearn:v1.0.0

# 4. Build & Push Frontend
docker build -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/wanikani-fe:v1.0.0 \
    -f WaniKani.Relearn.FE/Dockerfile WaniKani.Relearn.FE
docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/wanikani-fe:v1.0.0
```

---

## Step 4: Configure GCP Workload Identity

Link the Kubernetes ServiceAccount to a GCP Service Account to avoid storing secret JSON keys.

```bash
export K8S_NAMESPACE="wanikani"
export K8S_SA="wanikani-backend-sa"
export GCP_SA="wanikani-app-sa"

# 1. Create GCP Service Account
gcloud iam service-accounts create $GCP_SA \
    --display-name="WaniKani App Service Account"

# 2. Grant Secret Manager Access (if using Secret Manager)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --role="roles/secretmanager.secretAccessor" \
    --member="serviceAccount:$GCP_SA@$PROJECT_ID.iam.gserviceaccount.com"

# 3. Allow K8s ServiceAccount to impersonate GCP ServiceAccount
gcloud iam service-accounts add-iam-policy-binding $GCP_SA@$PROJECT_ID.iam.gserviceaccount.com \
    --role="roles/iam.workloadIdentityUser" \
    --member="serviceAccount:$PROJECT_ID.svc.id.goog[$K8S_NAMESPACE/$K8S_SA]"
```

---

## Step 5: Install Ingress-NGINX & cert-manager

```bash
# 1. Add Helm repos
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo add jetstack https://charts.jetstack.io
helm repo update

# 2. Install Ingress-NGINX controller
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
    --namespace ingress-nginx \
    --create-namespace \
    --set controller.service.type=LoadBalancer

# 3. Install cert-manager (for automatic Let's Encrypt SSL certificates)
helm upgrade --install cert-manager jetstack/cert-manager \
    --namespace cert-manager \
    --create-namespace \
    --set crds.enabled=true

# 4. Get Public IP of Load Balancer
kubectl get svc -n ingress-nginx ingress-nginx-controller -w
```
> **Action Required**: Map your custom domain DNS `A` record (e.g., `wanikani.yourdomain.com`) to the external IP shown above.

5. Create `cert-issuer.yaml` and apply:
```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod-key
    solvers:
    - http01:
        ingress:
          class: nginx
```
```bash
kubectl apply -f cert-issuer.yaml
```

---

## Step 6: Create the Helm Chart

Organize files into `helm/wanikani-relearn/`:

```
helm/wanikani-relearn/
├── Chart.yaml
├── values.yaml
├── values-prod.yaml
└── templates/
    ├── _helpers.tpl
    ├── serviceaccount.yaml
    ├── secret.yaml
    ├── configmap.yaml
    ├── backend-deployment.yaml
    ├── backend-service.yaml
    ├── frontend-deployment.yaml
    ├── frontend-service.yaml
    ├── ingress.yaml
    └── migration-job.yaml
```

### `Chart.yaml`
```yaml
apiVersion: v2
name: wanikani-relearn
description: Helm chart for WaniKani Relearn Web and API
type: application
version: 0.1.0
appVersion: "1.0.0"
```

### `templates/_helpers.tpl`
```yaml
{{/*
Expand the name of the chart.
*/}}
{{- define "wanikani.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "wanikani.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s" .Chart.Name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "wanikani.labels" -}}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
app.kubernetes.io/name: {{ include "wanikani.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
```

### `values.yaml`
```yaml
global:
  environment: Production

backend:
  replicaCount: 2
  image:
    repository: europe-west1-docker.pkg.dev/YOUR_GCP_PROJECT/wanikani-relearn/wanikanirelearn
    tag: "v1.0.0"
    pullPolicy: IfNotPresent
  service:
    port: 8080
  serviceAccount:
    name: wanikani-backend-sa
    gcpServiceAccount: "wanikani-app-sa@YOUR_GCP_PROJECT.iam.gserviceaccount.com"
  resources:
    requests:
      cpu: 100m
      memory: 256Mi
    limits:
      cpu: 500m
      memory: 512Mi
  config:
    wanikaniApi: "https://api.wanikani.com/v2/"
    wanikaniRevision: "20170710"
  secrets:
    databaseConnectionString: ""
    wanikaniAccessToken: ""

frontend:
  replicaCount: 2
  image:
    repository: europe-west1-docker.pkg.dev/YOUR_GCP_PROJECT/wanikani-relearn/wanikani-fe
    tag: "v1.0.0"
    pullPolicy: IfNotPresent
  service:
    port: 80
  resources:
    requests:
      cpu: 50m
      memory: 64Mi
    limits:
      cpu: 200m
      memory: 128Mi

ingress:
  enabled: true
  className: nginx
  host: wanikani.yourdomain.com
  tls:
    enabled: true
    secretName: wanikani-tls-cert
    issuer: letsencrypt-prod

migrations:
  enabled: true
```

### `templates/serviceaccount.yaml`
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: {{ .Values.backend.serviceAccount.name }}
  namespace: {{ .Release.Namespace }}
  annotations:
    iam.gke.io/gcp-service-account: {{ .Values.backend.serviceAccount.gcpServiceAccount }}
automountServiceAccountToken: true
```

### `templates/secret.yaml`
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: {{ include "wanikani.fullname" . }}-secret
  namespace: {{ .Release.Namespace }}
type: Opaque
stringData:
  ConnectionStrings__DefaultConnection: {{ .Values.backend.secrets.databaseConnectionString | quote }}
  WaniKani__AccessToken: {{ .Values.backend.secrets.wanikaniAccessToken | quote }}
```

### `templates/configmap.yaml`
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ include "wanikani.fullname" . }}-config
  namespace: {{ .Release.Namespace }}
data:
  ASPNETCORE_ENVIRONMENT: {{ .Values.global.environment | quote }}
  WaniKani__Api: {{ .Values.backend.config.wanikaniApi | quote }}
  WaniKani__Revision: {{ .Values.backend.config.wanikaniRevision | quote }}
```

### `templates/backend-service.yaml`
```yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ include "wanikani.fullname" . }}-backend-svc
  namespace: {{ .Release.Namespace }}
spec:
  type: ClusterIP
  selector:
    app.kubernetes.io/component: backend
  ports:
    - name: http
      port: {{ .Values.backend.service.port }}
      targetPort: {{ .Values.backend.service.port }}
```

### `templates/backend-deployment.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "wanikani.fullname" . }}-backend
  namespace: {{ .Release.Namespace }}
spec:
  replicas: {{ .Values.backend.replicaCount }}
  selector:
    matchLabels:
      app.kubernetes.io/component: backend
  template:
    metadata:
      labels:
        app.kubernetes.io/component: backend
    spec:
      serviceAccountName: {{ .Values.backend.serviceAccount.name }}
      containers:
        - name: backend
          image: "{{ .Values.backend.image.repository }}:{{ .Values.backend.image.tag }}"
          imagePullPolicy: {{ .Values.backend.image.pullPolicy }}
          ports:
            - containerPort: {{ .Values.backend.service.port }}
          envFrom:
            - configMapRef:
                name: {{ include "wanikani.fullname" . }}-config
            - secretRef:
                name: {{ include "wanikani.fullname" . }}-secret
          livenessProbe:
            httpGet:
              path: /healthz
              port: {{ .Values.backend.service.port }}
            initialDelaySeconds: 15
            periodSeconds: 20
          readinessProbe:
            httpGet:
              path: /ready
              port: {{ .Values.backend.service.port }}
            initialDelaySeconds: 5
            periodSeconds: 10
          resources:
            {{- toYaml .Values.backend.resources | nindent 12 }}
```

### `templates/frontend-service.yaml`
```yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ include "wanikani.fullname" . }}-frontend-svc
  namespace: {{ .Release.Namespace }}
spec:
  type: ClusterIP
  selector:
    app.kubernetes.io/component: frontend
  ports:
    - name: http
      port: {{ .Values.frontend.service.port }}
      targetPort: {{ .Values.frontend.service.port }}
```

### `templates/frontend-deployment.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "wanikani.fullname" . }}-frontend
  namespace: {{ .Release.Namespace }}
spec:
  replicas: {{ .Values.frontend.replicaCount }}
  selector:
    matchLabels:
      app.kubernetes.io/component: frontend
  template:
    metadata:
      labels:
        app.kubernetes.io/component: frontend
    spec:
      containers:
        - name: frontend
          image: "{{ .Values.frontend.image.repository }}:{{ .Values.frontend.image.tag }}"
          imagePullPolicy: {{ .Values.frontend.image.pullPolicy }}
          ports:
            - containerPort: {{ .Values.frontend.service.port }}
          resources:
            {{- toYaml .Values.frontend.resources | nindent 12 }}
```

### `templates/ingress.yaml`
```yaml
{{- if .Values.ingress.enabled }}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ include "wanikani.fullname" . }}-ingress
  namespace: {{ .Release.Namespace }}
  annotations:
    cert-manager.io/cluster-issuer: {{ .Values.ingress.tls.issuer }}
    nginx.ingress.kubernetes.io/proxy-body-size: "16m"
spec:
  ingressClassName: {{ .Values.ingress.className }}
  {{- if .Values.ingress.tls.enabled }}
  tls:
    - hosts:
        - {{ .Values.ingress.host }}
      secretName: {{ .Values.ingress.tls.secretName }}
  {{- end }}
  rules:
    - host: {{ .Values.ingress.host }}
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: {{ include "wanikani.fullname" . }}-backend-svc
                port:
                  number: {{ .Values.backend.service.port }}
          - path: /auth
            pathType: Prefix
            backend:
              service:
                name: {{ include "wanikani.fullname" . }}-backend-svc
                port:
                  number: {{ .Values.backend.service.port }}
          - path: /swagger
            pathType: Prefix
            backend:
              service:
                name: {{ include "wanikani.fullname" . }}-backend-svc
                port:
                  number: {{ .Values.backend.service.port }}
          - path: /
            pathType: Prefix
            backend:
              service:
                name: {{ include "wanikani.fullname" . }}-frontend-svc
                port:
                  number: {{ .Values.frontend.service.port }}
{{- end }}
```

### `templates/migration-job.yaml`
```yaml
{{- if .Values.migrations.enabled }}
apiVersion: batch/v1
kind: Job
metadata:
  name: {{ include "wanikani.fullname" . }}-migration
  namespace: {{ .Release.Namespace }}
  annotations:
    "helm.sh/hook": pre-install,pre-upgrade
    "helm.sh/hook-weight": "-1"
    "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
spec:
  template:
    spec:
      restartPolicy: OnFailure
      serviceAccountName: {{ .Values.backend.serviceAccount.name }}
      containers:
        - name: migrate-db
          image: "{{ .Values.backend.image.repository }}:{{ .Values.backend.image.tag }}"
          command: ["dotnet", "WaniKani.Relearn.dll", "--migrate-db"]
          envFrom:
            - secretRef:
                name: {{ include "wanikani.fullname" . }}-secret
{{- end }}
```

---

## Step 7: Deploy with Helm

Run the release command from your repository root:

```bash
helm upgrade --install wanikani-relearn ./helm/wanikani-relearn \
  --namespace wanikani \
  --create-namespace \
  --set backend.image.repository=$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/wanikanirelearn \
  --set backend.image.tag=v1.0.0 \
  --set frontend.image.repository=$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/wanikani-fe \
  --set frontend.image.tag=v1.0.0 \
  --set backend.secrets.databaseConnectionString="Host=bonpom-db-...cockroachlabs.cloud;Port=26257;Database=bonpom;Username=roman.bodnar;Password=YOUR_ACTUAL_PASSWORD;SSL Mode=VerifyFull" \
  --set backend.secrets.wanikaniAccessToken="YOUR_DEFAULT_WANIKANI_TOKEN" \
  --set ingress.host="wanikani.yourdomain.com" \
  --wait \
  --timeout 10m
```

Verify deployment:
```bash
# Check Pods
kubectl get pods -n wanikani

# Check Services
kubectl get svc -n wanikani

# Check Ingress and TLS Certificate
kubectl get ingress -n wanikani
kubectl get certificate -n wanikani
```

---

## Step 8: Automated CI/CD (GitHub Actions)

Create `.github/workflows/k8s-deploy.yml`:

```yaml
name: Build and Deploy to GKE

on:
  push:
    branches: [ main ]

env:
  PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
  REGION: europe-west1
  CLUSTER_NAME: wanikani-cluster
  REPOSITORY: wanikani-relearn

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: 'read'
      id-token: 'write'

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.GCP_WIF_PROVIDER_ID }}
          service_account: 'github-actions-sa@${{ env.PROJECT_ID }}.iam.gserviceaccount.com'
          token_format: 'access_token'

      - name: Setup GKE Credentials
        uses: google-github-actions/get-gke-credentials@v2
        with:
          cluster_name: ${{ env.CLUSTER_NAME }}
          location: ${{ env.REGION }}

      - name: Docker Login
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGION }}-docker.pkg.dev
          username: oauth2accesstoken
          password: ${{ steps.auth.outputs.access_token }}

      - name: Build & Push Backend Image
        uses: docker/build-push-action@v5
        with:
          context: ./WaniKani.Relearn
          file: ./WaniKani.Relearn/Dockerfile
          push: true
          tags: ${{ env.REGION }}-docker.pkg.dev/${{ env.PROJECT_ID }}/${{ env.REPOSITORY }}/wanikanirelearn:${{ github.sha }}

      - name: Build & Push Frontend Image
        uses: docker/build-push-action@v5
        with:
          context: ./WaniKani.Relearn.FE
          file: ./WaniKani.Relearn.FE/Dockerfile
          push: true
          tags: ${{ env.REGION }}-docker.pkg.dev/${{ env.PROJECT_ID }}/${{ env.REPOSITORY }}/wanikani-fe:${{ github.sha }}

      - name: Install Helm
        uses: azure/setup-helm@v4

      - name: Deploy Helm Chart
        run: |
          helm upgrade --install wanikani-relearn ./helm/wanikani-relearn \
            --namespace wanikani \
            --create-namespace \
            --set backend.image.repository=${{ env.REGION }}-docker.pkg.dev/${{ env.PROJECT_ID }}/${{ env.REPOSITORY }}/wanikanirelearn \
            --set backend.image.tag=${{ github.sha }} \
            --set frontend.image.repository=${{ env.REGION }}-docker.pkg.dev/${{ env.PROJECT_ID }}/${{ env.REPOSITORY }}/wanikani-fe \
            --set frontend.image.tag=${{ github.sha }} \
            --set backend.secrets.databaseConnectionString="${{ secrets.DB_CONNECTION_STRING }}" \
            --set backend.secrets.wanikaniAccessToken="${{ secrets.WANIKANI_ACCESS_TOKEN }}" \
            --wait \
            --timeout 8m
```

---

## Troubleshooting & Verification Checklist

| Check | Command | Expected Output |
|---|---|---|
| Pods Status | `kubectl get pods -n wanikani` | `Running` (2/2 backend, 2/2 frontend) |
| Health Check | `kubectl exec -it <backend-pod> -n wanikani -- curl http://localhost:8080/ready` | `Healthy` |
| DB Migration | `kubectl get jobs -n wanikani` | `1/1 Completed` |
| Ingress Routing | `curl -I https://wanikani.yourdomain.com/api/subjects` | HTTP 200 / 401 (not 502/404) |
| SSL Cert | `kubectl get certificate -n wanikani` | `READY=True` |
