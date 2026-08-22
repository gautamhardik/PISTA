# Vercel Deployment & Cloud Production Guide

This document outlines how to deploy both the **Frontend** and **Backend** of PISTA.

---

## Architecture Overview

* **Frontend**: Next.js 16 (Turbopack, App Router) $\to$ Deployed to **Vercel** with zero configuration or via root project settings.
* **Backend Options**:
  1. **Option A (Container Cloud / Render / Railway / Fly.io)**: *Recommended for ML*. Heavy ML binaries (`LightGBM`, `TreeSHAP`, `Scikit-Learn`, `Polars`, `PostgreSQL`) run at full speed inside a dedicated container using the existing `backend/Dockerfile`.
  2. **Option B (Vercel Serverless Python)**: Deployed using `@vercel/python` and `backend/vercel.json`.

---

## 1. Frontend Deployment on Vercel

1. Log into your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** $\to$ **Project**.
3. Import your GitHub repository: **`gautamhardik/PISTA`**.
4. Configure the Project Settings:
   * **Framework Preset**: `Next.js`
   * **Root Directory**: Click `Edit` and select **`frontend`**.
   * **Build Command**: `next build` (Default)
   * **Output Directory**: `.next` (Default)
   * **Install Command**: `npm install` (Default)
5. **Environment Variables**:
   Add the following environment variable pointing to your deployed backend URL:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-service-url.com
   ```
6. Click **Deploy**.

---

## 2. Backend Deployment

### Recommended: Docker / Cloud Container (Render, Railway, Fly.io, AWS)
Since PISTA runs a 492-feature LightGBM model and TreeSHAP explainer with PostgreSQL persistence, container hosting is ideal:

1. Connect `gautamhardik/PISTA` to Render / Railway.
2. Select **Dockerfile** deployment and set **Root Directory** to `backend`.
3. Set environment variables:
   ```env
   DATABASE_URL=postgresql://user:password@postgres-host:5432/pista
   RAZORPAY_KEY_ID=rzp_test_your_key
   RAZORPAY_KEY_SECRET=your_secret
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   ```
4. Deploy and copy your backend URL into your frontend `NEXT_PUBLIC_API_URL`.

### Vercel Serverless Python Deployment
If deploying the backend directory directly to Vercel:
1. Import repository and set **Root Directory** to **`backend`**.
2. Vercel will automatically detect [`backend/vercel.json`](backend/vercel.json) using `@vercel/python` pointing to `app/main.py`.
3. Supply the environment variables in the Vercel dashboard.
