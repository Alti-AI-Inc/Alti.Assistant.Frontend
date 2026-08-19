# ============================================================
# GitHub Actions Secrets Setup for Cloud Run Deployment
# Requires: GitHub CLI (gh) - https://cli.github.com
# Usage: .\scripts\set-github-secrets.ps1
# ============================================================

$REPO = "Alti-AI-Inc/Alti.Assistant.Frontend"

# ---- Check gh CLI is installed ----
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error "GitHub CLI (gh) is not installed. Install it from https://cli.github.com"
    exit 1
}

# ---- Check gh auth ----
gh auth status 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Not logged in to GitHub CLI. Running gh auth login..." -ForegroundColor Yellow
    gh auth login
}

Write-Host ""
Write-Host "Setting GitHub Actions secrets for: $REPO" -ForegroundColor Cyan
Write-Host "------------------------------------------------------------"

# ---- GCP Workload Identity Provider (auto-fetched) ----
Write-Host "Fetching GCP_WORKLOAD_IDENTITY_PROVIDER from gcloud..." -ForegroundColor Gray
$GCP_WORKLOAD_IDENTITY_PROVIDER = (gcloud iam workload-identity-pools providers describe github-provider `
    --location=global `
    --workload-identity-pool=github-pool `
    --project=alti-assistant-prod `
    --format="value(name)" 2>&1).Trim()

if (-not $GCP_WORKLOAD_IDENTITY_PROVIDER -or $LASTEXITCODE -ne 0) {
    Write-Error "Failed to fetch WIF provider. Make sure the pool and provider exist."
    exit 1
}
Write-Host "GCP_WORKLOAD_IDENTITY_PROVIDER -> $GCP_WORKLOAD_IDENTITY_PROVIDER" -ForegroundColor Gray

# ---- GCP Service Account ----
$GCP_SERVICE_ACCOUNT = "366561755636-compute@developer.gserviceaccount.com"
Write-Host "GCP_SERVICE_ACCOUNT -> $GCP_SERVICE_ACCOUNT (using default compute SA)" -ForegroundColor Gray

# ---- API URL ----
$NEXT_PUBLIC_API_URL = "https://apiv2.asonai.com/api/v1"
Write-Host "NEXT_PUBLIC_API_URL -> $NEXT_PUBLIC_API_URL" -ForegroundColor Gray

# ---- Stripe Key ----
$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = Read-Host "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (pk_...)"

Write-Host ""
Write-Host "Setting secrets..." -ForegroundColor Cyan

$secrets = @{
    GCP_WORKLOAD_IDENTITY_PROVIDER    = $GCP_WORKLOAD_IDENTITY_PROVIDER
    GCP_SERVICE_ACCOUNT               = $GCP_SERVICE_ACCOUNT
    NEXT_PUBLIC_API_URL               = $NEXT_PUBLIC_API_URL
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = $NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
}

foreach ($secret in $secrets.GetEnumerator()) {
    Write-Host "  Setting $($secret.Key)..." -NoNewline
    $secret.Value | gh secret set $secret.Key --repo $REPO
    if ($LASTEXITCODE -eq 0) {
        Write-Host " OK" -ForegroundColor Green
    } else {
        Write-Host " FAILED" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Done! Verify secrets at:" -ForegroundColor Green
Write-Host "https://github.com/$REPO/settings/secrets/actions" -ForegroundColor Cyan
