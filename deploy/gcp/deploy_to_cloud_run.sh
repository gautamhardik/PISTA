#!/usr/bin/env bash
# ==============================================================================
# PISTA — Google Cloud Run Automated Deployment Script (Bash)
# Qualifies for the GitLab Transcend Hackathon +0.2 Bonus Points
# ==============================================================================

set -euo pipefail

PROJECT_ID="${1:-${GCP_PROJECT_ID:-pista-backend-2026}}"
REGION="${2:-${GCP_REGION:-us-central1}}"
SERVICE_NAME="${3:-pista-backend}"

echo "======================================================================"
echo "🚀 Deploying PISTA to Google Cloud Run (Bonus Points Target)"
echo "Project ID: $PROJECT_ID | Region: $REGION | Service: $SERVICE_NAME"
echo "======================================================================"

# 1. Ensure project configuration
echo "[1/5] Setting gcloud project..."
gcloud config set project "$PROJECT_ID" --quiet

# 2. Enable Required Google Cloud APIs
echo "[2/5] Enabling Cloud Run, Cloud Build, and Artifact Registry APIs..."
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com --quiet

# 3. Build & Deploy Backend Container to Cloud Run
echo "[3/5] Submitting build and deploying to Cloud Run from ./backend..."
gcloud run deploy "$SERVICE_NAME" \
    --source ./backend \
    --region "$REGION" \
    --platform managed \
    --allow-unauthenticated \
    --memory 2Gi \
    --cpu 2 \
    --set-env-vars "PROJECT_NAME=PISTA Transaction Intelligence API,VERSION=1.0.0,API_V1_PREFIX=/api/v1" \
    --quiet

# 4. Retrieve Public Endpoint URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --format "value(status.url)")

echo "======================================================================"
echo "✅ Deployment Succeeded!"
echo "Public Cloud Run URL: $SERVICE_URL"
echo "Interactive Swagger: $SERVICE_URL/docs"
echo "Health Probe:        $SERVICE_URL/health"
echo "======================================================================"

# 5. Verification Probe
echo "[5/5] Probing live health endpoint..."
curl -fsS "$SERVICE_URL/health" || echo "Container is initializing. Verify at $SERVICE_URL/health"
