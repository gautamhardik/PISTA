# Multi-stage Dockerfile for RiskGuard Production FastAPI Backend

FROM python:3.11-slim as base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8000

WORKDIR /app

# Install system dependencies for C-extensions, LightGBM, and PostgreSQL client
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgomp1 \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies (full stack including catboost/xgboost for Docker/Render)
COPY requirements-full.txt requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy backend application code and ML champion artifacts
COPY app/ ./app/
COPY artifacts/ ./artifacts/
COPY tests/ ./tests/

# Health check
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 8000

# Start production server
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
