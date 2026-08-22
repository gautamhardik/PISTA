import pytest
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app

def test_health():
    with TestClient(app) as client:
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"

def test_readiness():
    with TestClient(app) as client:
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ready"
        assert data["model_loaded"] is True
        assert data["feature_count"] == 492

def test_model_info():
    with TestClient(app) as client:
        response = client.get("/api/v1/model")
        assert response.status_code == 200
        data = response.json()
        assert data["champion"]["framework"] == "LightGBM"
        assert data["operating_policy"]["tau_review"] == 0.25
        assert data["operating_policy"]["tau_block"] == 0.75

def test_prediction_single():
    with TestClient(app) as client:
        payload = {
            "TransactionAmt": 150.00,
            "ProductCD": "W",
            "card1": 13926,
            "card2": 361.0,
            "card4": "visa",
            "card6": "credit",
            "addr1": 315.0,
            "addr2": 87.0,
            "P_emaildomain": "gmail.com",
            "DeviceType": "desktop"
        }
        response = client.post("/api/v1/predict", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "risk" in data
        assert "decision" in data
        assert "explanation" in data
        assert data["decision"]["action"] in ["APPROVE", "REVIEW", "BLOCK"]
        assert data["telemetry"]["inference_latency_ms"] < 500.0

def test_prediction_high_risk():
    with TestClient(app) as client:
        payload = {
            "TransactionAmt": 999.99,
            "ProductCD": "C",
            "card1": 99999,
            "card4": "visa",
            "card6": "credit",
            "P_emaildomain": "protonmail.com",
            "R_emaildomain": "mail.ru",
            "DeviceType": "mobile",
            "additional_features": {
                "C13": 50.0,
                "C14": 40.0,
                "V258": 10.0
            }
        }
        response = client.post("/api/v1/predict", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["risk"]["risk_score"] >= 0.0
        assert data["decision"]["action"] in ["APPROVE", "REVIEW", "BLOCK"]
