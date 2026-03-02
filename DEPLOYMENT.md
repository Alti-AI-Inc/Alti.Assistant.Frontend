# Deployment Guide — GCP Cloud Run

This guide covers everything needed to build, test, and deploy the Alti Assistant Frontend to Google Cloud Run.

---

## Prerequisites

### Tools Required

| Tool | Install |
|---|---|
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | Required for local build & test |
| [Google Cloud SDK (gcloud)](https://cloud.google.com/sdk/docs/install) | Required for GCP operations |
| [GitHub CLI (gh)](https://cli.github.com) | Required for setting GitHub secrets |
| [Node.js 22+](https://nodejs.org) | Required for local dev |
| [pnpm](https://pnpm.io/installation) | `npm install -g pnpm` |

### Authenticate

```powershell
# Authenticate gcloud
gcloud auth login

# Set active project
gcloud config set project alti-assistant-prod

# Authenticate GitHub CLI
gh auth login
```

---

## Environment Variables

| Variable | Where set | Notes |
|---|---|---|
| `AUTH_SECRET` | GCP Secret Manager | Session signing secret |
| `AUTH_TRUST_HOST` | Cloud Run env var | Must be `true` |
| `NEXT_PUBLIC_API_URL` | Build arg + Cloud Run env var | Baked in at build time |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | GCP Secret Manager | Stripe public key |

---

## One-Time GCP Setup

Run these once per project. Skip if already done.

### 1. Enable APIs

```bash
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  iamcredentials.googleapis.com \
  --project=alti-assistant-prod
```

### 2. Create Artifact Registry Repository

```bash
gcloud artifacts repositories create alti-assistant \
  --repository-format=docker \
  --location=us-central1 \
  --project=alti-assistant-prod
```

### 3. Store Secrets in Secret Manager

```bash
echo -n "your-auth-secret" | gcloud secrets create AUTH_SECRET --data-file=- --project=alti-assistant-prod

echo -n "pk_test_..." | gcloud secrets create NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY --data-file=- --project=alti-assistant-prod
```

To update an existing secret version:

```bash
echo -n "new-value" | gcloud secrets versions add AUTH_SECRET --data-file=- --project=alti-assistant-prod
```

### 4. Grant Cloud Run Service Account Permissions

```bash
# Secret Manager access
gcloud projects add-iam-policy-binding alti-assistant-prod \
  --member="serviceAccount:366561755636-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" --condition=None

# Cloud Run admin (for GitHub Actions deploys)
gcloud projects add-iam-policy-binding alti-assistant-prod \
  --member="serviceAccount:366561755636-compute@developer.gserviceaccount.com" \
  --role="roles/run.admin" --condition=None

# Artifact Registry write access
gcloud projects add-iam-policy-binding alti-assistant-prod \
  --member="serviceAccount:366561755636-compute@developer.gserviceaccount.com" \
  --role="roles/artifactregistry.writer" --condition=None

# Service Account user
gcloud projects add-iam-policy-binding alti-assistant-prod \
  --member="serviceAccount:366561755636-compute@developer.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser" --condition=None
```

### 5. Configure Workload Identity Federation (GitHub Actions)

```bash
# Create WIF pool
gcloud iam workload-identity-pools create github-pool \
  --location=global \
  --display-name="GitHub Actions Pool" \
  --project=alti-assistant-prod

# Create OIDC provider
gcloud iam workload-identity-pools providers create-oidc github-provider \
  --location=global \
  --workload-identity-pool=github-pool \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
  --attribute-condition="assertion.repository=='Alti-AI-Inc/Alti.Assistant.Frontend'" \
  --project=alti-assistant-prod

# Bind GitHub repo to service account
gcloud iam service-accounts add-iam-policy-binding \
  366561755636-compute@developer.gserviceaccount.com \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/366561755636/locations/global/workloadIdentityPools/github-pool/attribute.repository/Alti-AI-Inc/Alti.Assistant.Frontend" \
  --project=alti-assistant-prod \
  --condition=None
```

### 6. Set GitHub Actions Secrets

```powershell
.\scripts\set-github-secrets.ps1
```

This script auto-fetches the WIF provider name and prompts only for the Stripe key.

---

## Local Development

```powershell
pnpm install
pnpm dev
# App runs at http://localhost:3000
```

---

## Local Docker Build & Test

### Build

> `NEXT_PUBLIC_*` variables are **baked in at build time** — they cannot be overridden at runtime.

```powershell
# For local testing against local backend
docker build `
  --build-arg NEXT_PUBLIC_API_URL=http://host.docker.internal:5100/api/v1 `
  --build-arg NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... `
  -t alti-assistant-frontend:local .

# For production API
docker build `
  --build-arg NEXT_PUBLIC_API_URL=https://apiv2.asonai.com/api/v1 `
  --build-arg NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... `
  -t alti-assistant-frontend:local .
```

### Run

```powershell
docker run --rm -p 3000:8080 `
  -e AUTH_SECRET=your-auth-secret `
  -e AUTH_TRUST_HOST=true `
  -e NEXT_PUBLIC_API_URL=https://apiv2.asonai.com/api/v1 `
  -e NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... `
  alti-assistant-frontend:local
```

App available at **http://localhost:3000**

> `AUTH_TRUST_HOST=true` is required when running in Docker locally. Cloud Run sets this automatically via env var.

---

## Manual Deploy to Cloud Run

### Step 1 — Authenticate Docker

```powershell
gcloud auth configure-docker us-central1-docker.pkg.dev --quiet
```

### Step 2 — Build Production Image

```powershell
docker build --build-arg NEXT_PUBLIC_API_URL=https://apiv2.asonai.com/api/v1 --build-arg NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... -t us-central1-docker.pkg.dev/alti-assistant-prod/alti-assistant/alti-assistant-frontend:latest .
```

### Step 3 — Push to Artifact Registry

```powershell
docker push us-central1-docker.pkg.dev/alti-assistant-prod/alti-assistant/alti-assistant-frontend:latest
```

### Step 4 — Deploy to Cloud Run

```powershell
gcloud run deploy alti-assistant-frontend `
  --image us-central1-docker.pkg.dev/alti-assistant-prod/alti-assistant/alti-assistant-frontend:latest `
  --region us-central1 `
  --platform managed `
  --allow-unauthenticated `
  --port 8080 `
  --memory 1Gi `
  --cpu 1 `
  --min-instances 1 `
  --max-instances 10 `
  --set-env-vars "NODE_ENV=production,NEXT_PUBLIC_API_URL=https://apiv2.asonai.com/api/v1,AUTH_TRUST_HOST=true" `
  --set-secrets "AUTH_SECRET=AUTH_SECRET:latest,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:latest" `
  --project alti-assistant-prod
```

---

## Automated Deploy (GitHub Actions)

Any push to the **`prod`** branch automatically triggers `.github/workflows/deploy.yml` which:

1. Builds the Docker image with production build args
2. Pushes to Artifact Registry
3. Deploys to Cloud Run

**Service URL:** https://alti-assistant-frontend-366561755636.us-central1.run.app

---

## Useful Commands

```powershell
# View live Cloud Run logs
gcloud run services logs read alti-assistant-frontend --region us-central1 --project alti-assistant-prod --limit 50

# Check running service details
gcloud run services describe alti-assistant-frontend --region us-central1 --project alti-assistant-prod

# List all revisions
gcloud run revisions list --service alti-assistant-frontend --region us-central1 --project alti-assistant-prod

# Roll back to previous revision
gcloud run services update-traffic alti-assistant-frontend `
  --to-revisions REVISION_NAME=100 `
  --region us-central1 `
  --project alti-assistant-prod

# Stop local container
docker stop $(docker ps -q --filter ancestor=alti-assistant-frontend:local)
```
