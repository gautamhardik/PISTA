#!/usr/bin/env pwsh
# PISTA Backend — Google Cloud Run Deployment Script
# Run from repo root: .\deploy-cloudrun.ps1

param(
    [string]$ProjectId = "",
    [string]$Region = "asia-south1"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "=== PISTA Backend — Cloud Run Deployment ===" -ForegroundColor Cyan

# 1. Ensure gcloud is authenticated
Write-Host "`n[1/6] Checking gcloud auth..." -ForegroundColor Yellow
$account = gcloud auth list --filter="status:ACTIVE" --format="value(account)" 2>&1
if (-not $account) {
    Write-Host "Not logged in. Running gcloud auth login..." -ForegroundColor Red
    gcloud auth login
}
Write-Host "  Authenticated as: $account" -ForegroundColor Green

# 2. Set/confirm project
if (-not $ProjectId) {
    $ProjectId = gcloud config get-value project 2>&1
    if (-not $ProjectId -or $ProjectId -like "*unset*") {
        Write-Host "`nNo project set. Listing your projects:" -ForegroundColor Yellow
        gcloud projects list
        $ProjectId = Read-Host "Enter your Project ID"
    }
}
gcloud config set project $ProjectId
Write-Host "  Project: $ProjectId" -ForegroundColor Green

# 3. Enable required APIs
Write-Host "`n[2/6] Enabling Cloud Run + Artifact Registry APIs..." -ForegroundColor Yellow
gcloud services enable `
    run.googleapis.com `
    artifactregistry.googleapis.com `
    cloudbuild.googleapis.com `
    --project=$ProjectId
Write-Host "  APIs enabled." -ForegroundColor Green

# 4. Create Artifact Registry repo (idempotent)
Write-Host "`n[3/6] Creating Artifact Registry repository..." -ForegroundColor Yellow
gcloud artifacts repositories create pista `
    --repository-format=docker `
    --location=$Region `
    --description="PISTA backend Docker images" `
    --project=$ProjectId `
    2>&1 | Select-Object -Last 3
Write-Host "  Repository ready." -ForegroundColor Green

# 5. Build & push Docker image
Write-Host "`n[4/6] Building and pushing Docker image..." -ForegroundColor Yellow
$ImageTag = "$Region-docker.pkg.dev/$ProjectId/pista/backend:latest"
gcloud builds submit ./backend `
    --tag=$ImageTag `
    --project=$ProjectId
Write-Host "  Image pushed: $ImageTag" -ForegroundColor Green

# 6. Deploy to Cloud Run
Write-Host "`n[5/6] Deploying to Cloud Run ($Region)..." -ForegroundColor Yellow
$ServiceUrl = gcloud run deploy pista-backend `
    --image=$ImageTag `
    --region=$Region `
    --platform=managed `
    --allow-unauthenticated `
    --port=8000 `
    --memory=2Gi `
    --cpu=1 `
    --min-instances=0 `
    --max-instances=5 `
    --set-env-vars="DATABASE_URL=postgresql://neondb_owner:npg_1ruhCdyn6MXE@ep-ancient-bread-b36404g3-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require,RAZORPAY_KEY_ID=rzp_test_TShUcPwAvvFwoz,RAZORPAY_KEY_SECRET=JrJZ6NqeH9QvysbWxVoTjxGi,RAZORPAY_WEBHOOK_SECRET=rzp_webhook_secret_riskguard_2026" `
    --project=$ProjectId `
    --format="value(status.url)" 2>&1 | Select-Object -Last 1

# Get the URL
$ServiceUrl = gcloud run services describe pista-backend `
    --region=$Region `
    --project=$ProjectId `
    --format="value(status.url)"

Write-Host "`n[6/6] Setting NEXT_PUBLIC_API_URL on Vercel frontend..." -ForegroundColor Yellow
vercel env add NEXT_PUBLIC_API_URL production --cwd ./frontend <<< $ServiceUrl
vercel --prod --yes --cwd ./frontend

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  BACKEND URL : $ServiceUrl" -ForegroundColor Green
Write-Host "  FRONTEND URL: https://frontend-sigma-vert-50.vercel.app" -ForegroundColor Green
Write-Host "  Health Check: $ServiceUrl/health" -ForegroundColor Green
Write-Host "============================================`n" -ForegroundColor Cyan

# Quick health check
Write-Host "Running health check..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
try {
    $health = Invoke-WebRequest -Uri "$ServiceUrl/health" -UseBasicParsing -TimeoutSec 30
    Write-Host "  Health: $($health.Content)" -ForegroundColor Green
} catch {
    Write-Host "  Health check pending (cold start may take 30s on first request)" -ForegroundColor Yellow
}
