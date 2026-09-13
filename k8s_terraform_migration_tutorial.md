# Complete Infrastructure-as-Code (Terraform) Tutorial for WaniKani.Relearn on GKE

This tutorial provides a complete, production-grade **Infrastructure as Code (IaC)** blueprint using **Terraform** to provision and manage the entire **WaniKani.Relearn** ecosystem on Google Cloud Platform:
* **Google Cloud Infrastructure**: VPC, Subnets, GKE Autopilot, Artifact Registry, IAM Service Accounts, and Workload Identity.
* **Kubernetes & Helm Resources**: Automated installation of `ingress-nginx`, `cert-manager` (Let's Encrypt), and the `wanikani-relearn` application Helm release.

---

## 1. Architecture Overview (Terraform Managed)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   Terraform Scope                                      │
│                                                                                        │
│  ┌───────────────────────── Google Cloud Platform (europe-west1) ───────────────────┐  │
│  │                                                                                  │  │
│  │  ┌────────────────────────┐      ┌────────────────────────────────────────────┐  │  │
│  │  │   Artifact Registry    │      │             VPC & Custom Subnet            │  │  │
│  │  │  (wanikani-relearn)    │      │  (Primary, Pod CIDR, Service CIDR)         │  │  │
│  │  └────────────────────────┘      └─────────────────────┬──────────────────────┘  │  │
│  │                                                        │                         │  │
│  │  ┌────────────────────────┐                            ▼                         │  │
│  │  │   GCP IAM Service      │             ┌─────────────────────────────┐          │  │
│  │  │   Account (Workload    │◄───────────►│    GKE Autopilot Cluster    │          │  │
│  │  │   Identity Bound)      │             └──────────────┬──────────────┘          │  │
│  │  └────────────────────────┘                            │                         │  │
│  └────────────────────────────────────────────────────────┼─────────────────────────┘  │
│                                                           │                            │
│  ┌──────────────────────── Kubernetes & Helm Provider ────┼─────────────────────────┐  │
│  │                                                        ▼                         │  │
│  │  ┌────────────────────────────────────────────────────────────────────────────┐  │  │
│  │  │ Ingress Controller (ingress-nginx) ──► Public Cloud Load Balancer (IP)     │  │  │
│  │  ├────────────────────────────────────────────────────────────────────────────┤  │  │
│  │  │ cert-manager (Let's Encrypt ClusterIssuer)                                │  │  │
│  │  ├────────────────────────────────────────────────────────────────────────────┤  │  │
│  │  │ wanikani-relearn Helm Release:                                             │  │  │
│  │  │  • Namespace (wanikani)                                                    │  │  │
│  │  │  • Backend Deployment (2 replicas, .NET 10 Web API)                        │  │  │
│  │  │  • Frontend Deployment (2 replicas, React Router SPA on Nginx)             │  │  │
│  │  │  • ClusterIP Services & Ingress routing (/ and /api)                       │  │  │
│  │  │  • DB Migration Job (Pre-upgrade hook)                                     │  │  │
│  │  └─────────────────────────────────────┬──────────────────────────────────────┘  │  │
│  └────────────────────────────────────────┼─────────────────────────────────────────┘  │
└───────────────────────────────────────────┼────────────────────────────────────────────┘
                                            │
                                            ▼
                             ┌─────────────────────────────┐
                             │ Database (CockroachDB Cloud)│
                             └─────────────────────────────┘
```

---

## 2. Directory Structure

Create a dedicated `terraform/` directory in the repository root:

```
terraform/
├── backend.tf               # GCS Remote State configuration
├── versions.tf              # Provider declarations and version constraints
├── variables.tf             # Input variable definitions
├── terraform.tfvars.example # Sample variable values
├── main.tf                  # APIs, VPC, and Subnetwork definitions
├── gke.tf                   # GKE Autopilot cluster definition
├── artifact_registry.tf     # Google Artifact Registry repository
├── iam.tf                   # Workload Identity & GCP IAM Service Account
├── helm.tf                  # Ingress-NGINX, cert-manager, and App Helm Release
└── outputs.tf               # Terraform output values (GKE endpoint, Ingress IP)
```

---

## 3. Terraform Code Implementation

### 3.1 `terraform/versions.tf`
Specifies required Terraform providers: Google, Google Beta, Kubernetes, and Helm.

```hcl
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 6.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.30"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.14"
    }
  }
}
```

---

### 3.2 `terraform/backend.tf`
Stores Terraform state securely in a Google Cloud Storage (GCS) bucket with versioning and encryption.

```hcl
terraform {
  backend "gcs" {
    bucket = "YOUR_GCP_PROJECT_ID-tfstate"
    prefix = "wanikani-relearn/prod"
  }
}
```
*(Run `gcloud storage buckets create gs://YOUR_GCP_PROJECT_ID-tfstate --location=europe-west1` prior to initializing if this bucket does not exist).*

---

### 3.3 `terraform/variables.tf`
Centralizes all configurable parameters:

```hcl
variable "project_id" {
  description = "The GCP Project ID"
  type        = string
}

variable "region" {
  description = "Primary GCP Region"
  type        = string
  default     = "europe-west1"
}

variable "cluster_name" {
  description = "Name of the GKE Autopilot cluster"
  type        = string
  default     = "wanikani-cluster"
}

variable "artifact_repo_name" {
  description = "Artifact Registry Docker repository name"
  type        = string
  default     = "wanikani-relearn"
}

variable "domain_name" {
  description = "The fully-qualified domain name (e.g., wanikani.yourdomain.com)"
  type        = string
}

variable "acme_email" {
  description = "Email address used for Let's Encrypt SSL certificate registration"
  type        = string
}

variable "db_connection_string" {
  description = "Full connection string to CockroachDB / PostgreSQL"
  type        = string
  sensitive   = true
}

variable "wanikani_access_token" {
  description = "Default WaniKani Personal Access Token"
  type        = string
  sensitive   = true
  default     = ""
}

variable "backend_image_tag" {
  description = "Image tag for the backend (.NET API)"
  type        = string
  default     = "v1.0.0"
}

variable "frontend_image_tag" {
  description = "Image tag for the frontend (React Router SPA)"
  type        = string
  default     = "v1.0.0"
}
```

---

### 3.4 `terraform/terraform.tfvars.example`
Copy this file to `terraform.tfvars` and supply your actual credentials:

```hcl
project_id            = "your-gcp-project-id"
region                = "europe-west1"
cluster_name          = "wanikani-cluster"
domain_name           = "wanikani.yourdomain.com"
acme_email            = "admin@yourdomain.com"
db_connection_string  = "Host=bonpom-db-...cockroachlabs.cloud;Port=26257;Database=bonpom;Username=roman.bodnar;Password=YOUR_ACTUAL_PASSWORD;SSL Mode=VerifyFull"
wanikani_access_token = "YOUR_DEFAULT_WANIKANI_TOKEN"
backend_image_tag     = "v1.0.0"
frontend_image_tag    = "v1.0.0"
```

---

### 3.5 `terraform/main.tf`
Enables required Google APIs, provisions the VPC, and sets up secondary subnet IP ranges for GKE Pods and Services.

```hcl
provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

# 1. Enable Required GCP APIs
locals {
  services = [
    "container.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
    "compute.googleapis.com",
    "iam.googleapis.com",
    "cloudresourcemanager.googleapis.com"
  ]
}

resource "google_project_service" "enabled_apis" {
  for_each                   = toset(local.services)
  project                    = var.project_id
  service                    = each.key
  disable_on_destroy         = false
  disable_dependent_services = false
}

# 2. Custom VPC Network
resource "google_compute_network" "vpc" {
  name                    = "wanikani-vpc"
  auto_create_subnetworks = false
  depends_on              = [google_project_service.enabled_apis]
}

# 3. Custom Subnet with Secondary Ranges for GKE Pods and Services
resource "google_compute_subnetwork" "subnet" {
  name                     = "wanikani-subnet"
  ip_cidr_range            = "10.10.0.0/20"
  region                   = var.region
  network                  = google_compute_network.vpc.id
  private_ip_google_access = true

  secondary_ip_range {
    range_name    = "pods-subnet"
    ip_cidr_range = "10.20.0.0/16"
  }

  secondary_ip_range {
    range_name    = "services-subnet"
    ip_cidr_range = "10.30.0.0/20"
  }
}
```

---

### 3.6 `terraform/gke.tf`
Deploys a managed **GKE Autopilot** cluster. Autopilot provisions, autoscales, and secures nodes automatically.

```hcl
resource "google_container_cluster" "autopilot_cluster" {
  name     = var.cluster_name
  location = var.region

  # Enable GKE Autopilot Mode
  enable_autopilot = true

  network    = google_compute_network.vpc.name
  subnetwork = google_compute_subnetwork.subnet.name

  ip_allocation_policy {
    cluster_secondary_range_name  = "pods-subnet"
    services_secondary_range_name = "services-subnet"
  }

  release_channel {
    channel = "REGULAR"
  }

  deletion_protection = false # Set to true for production data protection

  depends_on = [
    google_project_service.enabled_apis,
    google_compute_subnetwork.subnet
  ]
}
```

---

### 3.7 `terraform/artifact_registry.tf`
Provisions the Docker repository in Google Artifact Registry.

```hcl
resource "google_artifact_registry_repository" "docker_repo" {
  repository_id = var.artifact_repo_name
  location      = var.region
  format        = "DOCKER"
  description   = "Docker repository for WaniKani Relearn images"

  depends_on = [google_project_service.enabled_apis]
}
```

---

### 3.8 `terraform/iam.tf`
Configures **GCP Workload Identity**, binding the Kubernetes ServiceAccount (`wanikani-backend-sa`) directly to a GCP IAM Service Account without storing static JSON credentials.

```hcl
# 1. GCP IAM Service Account for the Application
resource "google_service_account" "app_sa" {
  account_id   = "wanikani-app-sa"
  display_name = "WaniKani Application Workload Identity SA"
}

# 2. Grant Secret Manager Access
resource "google_project_iam_member" "secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.app_sa.email}"
}

# 3. Workload Identity User Binding
# Binds: GCP Service Account <---> K8s ServiceAccount (namespace: wanikani, name: wanikani-backend-sa)
resource "google_service_account_iam_member" "workload_identity_user" {
  service_account_id = google_service_account.app_sa.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "serviceAccount:${var.project_id}.svc.id.goog[wanikani/wanikani-backend-sa]"

  depends_on = [google_container_cluster.autopilot_cluster]
}
```

---

### 3.9 `terraform/helm.tf`
Configures dynamic authentication from Terraform to GKE, then installs `ingress-nginx`, `cert-manager`, and your local Helm chart `../helm/wanikani-relearn`.

```hcl
# 1. Fetch current Google Auth client configuration
data "google_client_config" "default" {}

# 2. Configure Kubernetes Provider
provider "kubernetes" {
  host                   = "https://${google_container_cluster.autopilot_cluster.endpoint}"
  token                  = data.google_client_config.default.access_token
  cluster_ca_certificate = base64decode(google_container_cluster.autopilot_cluster.master_auth[0].cluster_ca_certificate)
}

# 3. Configure Helm Provider
provider "helm" {
  kubernetes {
    host                   = "https://${google_container_cluster.autopilot_cluster.endpoint}"
    token                  = data.google_client_config.default.access_token
    cluster_ca_certificate = base64decode(google_container_cluster.autopilot_cluster.master_auth[0].cluster_ca_certificate)
  }
}

# 4. Install Ingress-NGINX
resource "helm_release" "ingress_nginx" {
  name             = "ingress-nginx"
  repository       = "https://kubernetes.github.io/ingress-nginx"
  chart            = "ingress-nginx"
  version          = "4.11.2"
  namespace        = "ingress-nginx"
  create_namespace = true

  set {
    name  = "controller.service.type"
    value = "LoadBalancer"
  }

  depends_on = [google_container_cluster.autopilot_cluster]
}

# 5. Install cert-manager
resource "helm_release" "cert_manager" {
  name             = "cert-manager"
  repository       = "https://charts.jetstack.io"
  chart            = "cert-manager"
  version          = "v1.16.1"
  namespace        = "cert-manager"
  create_namespace = true

  set {
    name  = "crds.enabled"
    value = "true"
  }

  depends_on = [google_container_cluster.autopilot_cluster]
}

# 6. ClusterIssuer for Let's Encrypt SSL
resource "kubernetes_manifest" "letsencrypt_issuer" {
  manifest = {
    apiVersion = "cert-manager.io/v1"
    kind       = "ClusterIssuer"
    metadata = {
      name = "letsencrypt-prod"
    }
    spec = {
      acme = {
        server = "https://acme-v02.api.letsencrypt.org/directory"
        email  = var.acme_email
        privateKeySecretRef = {
          name = "letsencrypt-prod-key"
        }
        solvers = [
          {
            http01 = {
              ingress = {
                class = "nginx"
              }
            }
          }
        ]
      }
    }
  }

  depends_on = [helm_release.cert_manager]
}

# 7. Deploy WaniKani Relearn Application Helm Release
resource "helm_release" "wanikani_app" {
  name             = "wanikani-relearn"
  chart            = "${path.module}/../helm/wanikani-relearn"
  namespace        = "wanikani"
  create_namespace = true
  timeout          = 600
  wait             = true

  # Override values from variables
  set {
    name  = "backend.image.repository"
    value = "${var.region}-docker.pkg.dev/${var.project_id}/${var.artifact_repo_name}/wanikanirelearn"
  }

  set {
    name  = "backend.image.tag"
    value = var.backend_image_tag
  }

  set {
    name  = "backend.serviceAccount.name"
    value = "wanikani-backend-sa"
  }

  set {
    name  = "backend.serviceAccount.gcpServiceAccount"
    value = google_service_account.app_sa.email
  }

  set_sensitive {
    name  = "backend.secrets.databaseConnectionString"
    value = var.db_connection_string
  }

  set_sensitive {
    name  = "backend.secrets.wanikaniAccessToken"
    value = var.wanikani_access_token
  }

  set {
    name  = "frontend.image.repository"
    value = "${var.region}-docker.pkg.dev/${var.project_id}/${var.artifact_repo_name}/wanikani-fe"
  }

  set {
    name  = "frontend.image.tag"
    value = var.frontend_image_tag
  }

  set {
    name  = "ingress.host"
    value = var.domain_name
  }

  set {
    name  = "ingress.tls.issuer"
    value = "letsencrypt-prod"
  }

  depends_on = [
    google_container_cluster.autopilot_cluster,
    google_service_account_iam_member.workload_identity_user,
    helm_release.ingress_nginx,
    kubernetes_manifest.letsencrypt_issuer
  ]
}
```

---

### 3.10 `terraform/outputs.tf`
Exposes the deployed infrastructure attributes:

```hcl
output "gke_cluster_name" {
  description = "GKE Cluster Name"
  value       = google_container_cluster.autopilot_cluster.name
}

output "gke_cluster_endpoint" {
  description = "Kubernetes API Endpoint"
  value       = google_container_cluster.autopilot_cluster.endpoint
}

output "artifact_registry_url" {
  description = "Docker Registry URL"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${var.artifact_repo_name}"
}

output "gcp_service_account_email" {
  description = "Workload Identity GCP IAM Service Account"
  value       = google_service_account.app_sa.email
}

output "ingress_ip_instruction" {
  description = "Instruction to retrieve Ingress Public IP"
  value       = "Run 'kubectl get svc -n ingress-nginx ingress-nginx-controller -o jsonpath=\"{.status.loadBalancer.ingress[0].ip}\"' to obtain your Load Balancer IP and point your DNS A record."
}
```

---

## 4. Execution Walkthrough

### Step 1: Initialize Terraform
Navigate to the `terraform/` directory:
```bash
cd terraform
terraform init
```

### Step 2: Build & Push Initial Container Images
Before applying the application Helm chart, build and push the container images so GKE can pull them:

```bash
# 1. First provision the Artifact Registry only:
terraform apply -target=google_artifact_registry_repository.docker_repo -auto-approve

# 2. Configure Docker authentication:
gcloud auth configure-docker europe-west1-docker.pkg.dev

# 3. Build & Push Backend image from repository root:
docker build -t europe-west1-docker.pkg.dev/YOUR_PROJECT_ID/wanikani-relearn/wanikanirelearn:v1.0.0 \
  -f ../WaniKani.Relearn/Dockerfile ../WaniKani.Relearn
docker push europe-west1-docker.pkg.dev/YOUR_PROJECT_ID/wanikani-relearn/wanikanirelearn:v1.0.0

# 4. Build & Push Frontend image from repository root:
docker build -t europe-west1-docker.pkg.dev/YOUR_PROJECT_ID/wanikani-relearn/wanikani-fe:v1.0.0 \
  -f ../WaniKani.Relearn.FE/Dockerfile ../WaniKani.Relearn.FE
docker push europe-west1-docker.pkg.dev/YOUR_PROJECT_ID/wanikani-relearn/wanikani-fe:v1.0.0
```

### Step 3: Plan and Apply Complete Infrastructure
Generate an execution plan and apply:

```bash
# Review plan
terraform plan -out=tfplan

# Apply
terraform apply tfplan
```

### Step 4: Configure DNS Record
Retrieve the Ingress external IP:
```bash
kubectl get svc -n ingress-nginx ingress-nginx-controller
```
Create a DNS **A** record pointing `wanikani.yourdomain.com` to the external IP. Once DNS propagates, `cert-manager` will automatically validate the HTTP-01 challenge and issue a Let's Encrypt certificate.

---

## 5. Automated CI/CD with GitHub Actions and Terraform

Create `.github/workflows/terraform-ci-cd.yml` to automate Terraform validation, planning, and deployment:

```yaml
name: Terraform Infrastructure & Deployment

on:
  push:
    branches: [ main ]
    paths:
      - 'terraform/**'
      - 'helm/**'
  pull_request:
    branches: [ main ]
    paths:
      - 'terraform/**'
      - 'helm/**'

env:
  PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
  TF_VERSION: "1.9.0"

jobs:
  terraform:
    name: Terraform Plan & Apply
    runs-on: ubuntu-latest
    permissions:
      contents: 'read'
      id-token: 'write'
      pull-requests: 'write'

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Authenticate to GCP (Workload Identity Federation)
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.GCP_WIF_PROVIDER_ID }}
          service_account: 'github-actions-sa@${{ env.PROJECT_ID }}.iam.gserviceaccount.com'

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: ${{ env.TF_VERSION }}

      - name: Terraform Init
        run: terraform init
        working-directory: ./terraform

      - name: Terraform Format Check
        run: terraform fmt -check
        working-directory: ./terraform

      - name: Terraform Plan
        id: plan
        run: |
          terraform plan -no-color \
            -var="project_id=${{ env.PROJECT_ID }}" \
            -var="domain_name=${{ secrets.DOMAIN_NAME }}" \
            -var="acme_email=${{ secrets.ACME_EMAIL }}" \
            -var="db_connection_string=${{ secrets.DB_CONNECTION_STRING }}" \
            -var="wanikani_access_token=${{ secrets.WANIKANI_ACCESS_TOKEN }}" \
            -out=tfplan
        working-directory: ./terraform

      - name: Terraform Apply (Main Branch Only)
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        run: terraform apply -auto-approve tfplan
        working-directory: ./terraform
```

---

## 6. Teardown & Clean Up

To safely delete all provisioned resources and avoid unnecessary charges:

```bash
cd terraform

# Clean teardown (Kubernetes workloads and Ingress first, then GKE and VPC)
terraform destroy \
  -var="project_id=YOUR_PROJECT_ID" \
  -var="domain_name=wanikani.yourdomain.com" \
  -var="acme_email=admin@yourdomain.com" \
  -var="db_connection_string=dummy"
```
