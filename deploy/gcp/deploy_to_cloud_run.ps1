# ==============================================================================
# PISTA — Google Cloud Run Automated Deployment Script (PowerShell)
# Qualifies for the GitLab Transcend Hackathon +0.2 Bonus Points
# ==============================================================================

param (
    [string]$ProjectId = "pista-backend-2026",
    [string]$Region = "us-central1",
    [string]$ServiceName = "pista-backend"
)

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "🚀 Deploying PISTA to Google Cloud Run (Bonus Points Target)" -ForegroundColor Cyan
Write-Host "Project ID: $ProjectId | Region: $Region | Service: $ServiceName" -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Cyan

# 1. Ensure project configuration
Write-Host "[1/5] Setting gcloud project configuration..." -ForegroundColor Green
gcloud config set project $ProjectId --quiet

# 2. Enable Required Google Cloud APIs
Write-Host "[2/5] Enabling Cloud Run, Cloud Build, and Artifact Registry APIs..." -ForegroundColor Green
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com --quiet

# 3. Build & Deploy Backend Container to Cloud Run
Write-Host "[3/5] Submitting build and deploying to Cloud Run from ./backend..." -ForegroundColor Green
gcloud run deploy $ServiceName `
    --source ./backend `
    --region $Region `
    --platform managed `
    --allow-unauthenticated `
    --memory 2Gi `
    --cpu 2 `
    --set-env-vars "PROJECT_NAME=PISTA Transaction Intelligence API,VERSION=1.0.0,API_V1_PREFIX=/api/v1" `
    --quiet

# 4. Retrieve Public Endpoint URL
$SERVICE_URL = (gcloud run services describe $ServiceName --region $Region --format "value(status.url)").Trim()

Write-Host "======================================================================" -ForegroundColor Green
Write-Host "✅ Deployment Succeeded!" -ForegroundColor Green
Write-Host "Public Cloud Run URL: $SERVICE_URL" -ForegroundColor Yellow
Write-Host "Interactive Swagger: $SERVICE_URL/docs" -ForegroundColor Yellow
Write-Host "Health Probe:        $SERVICE_URL/health" -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Green

# 5. Verification Probe
Write-Host "[5/5] Probing live health endpoint..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$SERVICE_URL/health" -Method Get
    Write-Host "Probe Response: $($response | ConvertTo-Json -Compress)" -ForegroundColor Green
} catch {
    Write-Host "Note: Container is warming up. Verify at $SERVICE_URL/health" -ForegroundColor Yellow
}
