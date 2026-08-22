from fastapi import APIRouter
from app.services.model_service import model_service

router = APIRouter()

@router.get("/model", summary="Active Production Model Metadata & Governance")
async def get_model_info():
    """Retrieve detailed governance metadata, metrics, and challenger benchmarks."""
    return {
        "champion": model_service.metadata,
        "features": {
            "total_count": len(model_service.feature_order),
            "sample_features": model_service.feature_order[:15]
        },
        "operating_policy": {
            "tau_review": 0.25,
            "tau_block": 0.75,
            "actions": {
                "APPROVE": "P < 0.25",
                "REVIEW": "0.25 <= P < 0.75",
                "BLOCK": "P >= 0.75"
            }
        }
    }
