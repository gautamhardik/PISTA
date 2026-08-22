---
title: PISTA Backend API
emoji: 🛡️
colorFrom: green
colorTo: blue
sdk: docker
app_port: 8000
pinned: false
license: mit
short_description: Production fraud detection API — FastAPI + LightGBM
---

# PISTA Backend API

Production-grade real-time transaction risk scoring API powering the PISTA platform.

- **Framework**: FastAPI 0.115
- **Model**: Tuned LightGBM Champion (ROC-AUC 0.913, PR-AUC 0.545)
- **Database**: Neon PostgreSQL (serverless)
- **Endpoints**: `/health`, `/api/v1/predict`, `/api/v1/model`, `/api/v1/analytics`, `/api/v1/payments`
