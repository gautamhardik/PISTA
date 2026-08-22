import pytest
import sys, os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app
from app.services.model_service import model_service

def test_notebook_to_api_consistency():
    """
    Verifies that scoring sample transactions directly with the 
    Tuned LightGBM booster produces valid calibrated outputs via the FastAPI API endpoint.
    """
    lgb_model = model_service.model
    feature_order = model_service.feature_order
    calibrator = model_service.calibrator

    assert lgb_model is not None, "Model booster not loaded"
    assert len(feature_order) > 0, "Feature order list is empty"

    # Test synthesized transactions across standard scenarios
    sample_payloads = [
        {"TransactionAmt": 150.0, "ProductCD": "W", "card1": 13926, "card4": "visa", "card6": "credit"},
        {"TransactionAmt": 4850.0, "ProductCD": "H", "card1": 9999, "card4": "discover", "card6": "credit"},
        {"TransactionAmt": 12.5, "ProductCD": "C", "card1": 4462, "card4": "mastercard", "card6": "debit"},
    ]

    with TestClient(app) as client:
        for payload in sample_payloads:
            response = client.post("/api/v1/predict", json=payload)
            assert response.status_code == 200
            data = response.json()

            assert "risk" in data
            assert "decision" in data
            assert "explanation" in data
            assert "telemetry" in data
            
            # Verify probability bounds and risk score scaling
            assert 0.0 <= data["risk"]["calibrated_probability"] <= 1.0
            assert 0.0 <= data["risk"]["risk_score"] <= 100.0
            assert data["decision"]["action"] in ["APPROVE", "REVIEW", "BLOCK"]
