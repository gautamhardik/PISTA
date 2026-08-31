from fastapi import APIRouter
from app.services.model_service import model_service

router = APIRouter()

@router.get("/health", summary="Basic Liveness Probe")
async def health():
    return {"status": "ok", "service": "PISTA Transaction Intelligence"}

@router.get("/api/v1/health", summary="Service Readiness Probe")
async def readiness():
    return {
        "status": "ready" if model_service.is_ready else "not_ready",
        "model_loaded": model_service.model is not None,
        "calibrator_loaded": model_service.calibrator is not None,
        "feature_count": len(model_service.feature_order),
        "model_name": model_service.metadata.get("model_name", "PISTA Tuned LightGBM Risk Engine")
    }
