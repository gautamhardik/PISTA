import hmac
import hashlib
import json
import uuid
from fastapi.testclient import TestClient

from app.main import app
from app.core.config import settings
from app.core.database import init_db, SessionLocal
from app.integrations.razorpay.signature import verify_payment_signature, verify_webhook_signature
from app.integrations.razorpay.adapter import razorpay_adapter
from app.services.preprocessing_service import preprocessing_service
from app.services.model_service import model_service
from app.services.risk_service import risk_service
from app.db.repositories import TransactionRepository, PaymentRepository, RiskAssessmentRepository, CaseRepository, WebhookRepository
from app.models.db_models import TransactionRecord, PaymentRecord, RiskAssessmentRecord, CaseRecord, WebhookEventRecord

# Initialize database schema before tests run
init_db()

client = TestClient(app)

def test_database_connection_and_repositories():
    """Verify database connection and relational repository CRUD operations."""
    db = SessionLocal()
    try:
        txn_repo = TransactionRepository(db)
        risk_repo = RiskAssessmentRepository(db)
        case_repo = CaseRepository(db)

        test_uuid = f"test_crud_{uuid.uuid4().hex[:8]}"
        tx = txn_repo.create(
            transaction_uuid=test_uuid,
            provider="test",
            amount_minor=10000,
            amount_inr=100.0,
            amount_usd=1.20,
            currency="INR",
            product_cd="W"
        )
        db.flush()

        assert tx.id is not None
        assert tx.transaction_uuid == test_uuid

        risk = risk_repo.create(
            transaction_id=tx.id,
            transaction_uuid=test_uuid,
            raw_probability=0.12,
            calibrated_probability=0.04,
            risk_score=4.0,
            risk_level="LOW",
            decision="LEGITIMATE",
            action="APPROVE",
            policy_rule="Test Policy Rule",
            model_name="RiskGuard-Tuned-LightGBM-Champion",
            model_version="1.0.0",
            inference_latency_ms=1.2,
            total_latency_ms=5.0
        )
        db.flush()
        assert risk.id is not None
        assert risk.transaction_id == tx.id

        case_id = f"RG-TEST-{uuid.uuid4().hex[:6]}"
        c = case_repo.create(
            case_id=case_id,
            transaction_id=tx.id,
            risk_assessment_id=risk.id,
            transaction_uuid=test_uuid,
            amount_usd=1.20,
            risk_score=4.0,
            risk_level="LOW",
            decision="LEGITIMATE",
            action="APPROVE",
            status="resolved"
        )
        db.commit()

        assert c.id is not None
        assert c.case_id == case_id

        # Verify relational query
        queried_tx = txn_repo.get_by_uuid(test_uuid)
        assert queried_tx is not None
        assert len(queried_tx.risk_assessments) == 1
        assert queried_tx.risk_assessments[0].risk_score == 4.0
    finally:
        db.close()

def test_database_transaction_rollback():
    """Verify atomic transaction rollback on failure (no partial state)."""
    db = SessionLocal()
    try:
        txn_repo = TransactionRepository(db)
        test_uuid = f"test_rollback_{uuid.uuid4().hex[:8]}"

        try:
            tx = txn_repo.create(
                transaction_uuid=test_uuid,
                provider="test",
                amount_minor=10000,
                amount_inr=100.0,
                amount_usd=1.20,
                currency="INR",
                product_cd="W"
            )
            db.flush()
            # Force artificial exception
            raise RuntimeError("Forced simulation error before commit")
        except RuntimeError:
            db.rollback()

        # Confirm nothing was committed
        assert txn_repo.get_by_uuid(test_uuid) is None
    finally:
        db.close()

def test_payment_signature_verification():
    order_id = "order_test_12345"
    payment_id = "pay_test_67890"
    secret = settings.RAZORPAY_KEY_SECRET
    
    msg = f"{order_id}|{payment_id}".encode("utf-8")
    valid_sig = hmac.new(secret.encode("utf-8"), msg, hashlib.sha256).hexdigest()

    assert verify_payment_signature(order_id, payment_id, valid_sig, secret) is True
    assert verify_payment_signature(order_id, payment_id, "invalid_signature", secret) is False

def test_tampered_signature_rejection():
    """Verify that fake signatures return HTTP 400 without executing ML scoring."""
    response = client.post("/api/v1/payments/razorpay/verify", json={
        "razorpay_order_id": "order_test_tampered",
        "razorpay_payment_id": "pay_test_tampered",
        "razorpay_signature": "fake_invalid_signature_hex_12345"
    })
    assert response.status_code == 400
    assert "Untrusted checkout response" in response.text

def test_webhook_fast_200_and_idempotency():
    """Verify fast 200 response, duplicate event rejection using X-Razorpay-Event-Id."""
    secret = settings.RAZORPAY_WEBHOOK_SECRET
    event_id = f"evt_test_unique_id_{uuid.uuid4().hex[:12]}"
    payload = {
        "entity": "event",
        "account_id": "acc_123",
        "event": "payment.authorized",
        "contains": ["payment"],
        "payload": {
            "payment": {
                "entity": {
                    "id": f"pay_test_webhook_{uuid.uuid4().hex[:8]}",
                    "amount": 50000,
                    "currency": "INR",
                    "status": "authorized",
                    "order_id": f"order_test_webhook_{uuid.uuid4().hex[:8]}"
                }
            }
        }
    }
    raw_body = json.dumps(payload).encode("utf-8")
    valid_sig = hmac.new(secret.encode("utf-8"), raw_body, hashlib.sha256).hexdigest()

    # 1. First webhook delivery -> returns 200 acknowledged
    res1 = client.post(
        "/api/v1/payments/razorpay/webhook",
        content=raw_body,
        headers={
            "X-Razorpay-Signature": valid_sig,
            "X-Razorpay-Event-Id": event_id,
            "Content-Type": "application/json"
        }
    )
    assert res1.status_code == 200
    assert res1.json()["status"] == "acknowledged"

    # 2. Duplicate webhook delivery with same event ID -> returns 200 ignored_duplicate (idempotent)
    res2 = client.post(
        "/api/v1/payments/razorpay/webhook",
        content=raw_body,
        headers={
            "X-Razorpay-Signature": valid_sig,
            "X-Razorpay-Event-Id": event_id,
            "Content-Type": "application/json"
        }
    )
    assert res2.status_code == 200
    assert res2.json()["status"] == "ignored_duplicate"

def test_razorpay_adapter_scientific_mapping():
    """Verify feature transformations and 492-feature representation."""
    model_service.load_artifacts()
    
    txn_input = razorpay_adapter.to_canonical_transaction(
        amount_paise=100000, # ₹1,000.00 -> $12.05 USD
        payment_data={
            "method": "card",
            "card": {"network": "visa", "type": "credit", "last4": "4242"},
            "email": "fraud_test@gmail.com"
        }
    )

    assert abs(txn_input.TransactionAmt - 12.05) < 0.01
    assert txn_input.card4 == "visa"
    assert txn_input.card6 == "credit"
    assert txn_input.card1 == 42420 # Derived integration identifier

    features_df = preprocessing_service.transform_transaction(txn_input)
    assert features_df.shape[1] == 492

    raw_prob = model_service.predict_raw(features_df)
    calibrated_prob = model_service.calibrate_probability(raw_prob)
    risk_obj, decision_obj = risk_service.evaluate_risk(raw_prob, calibrated_prob)

    assert 0.0 <= risk_obj.risk_score <= 100.0
    assert decision_obj.action in ["APPROVE", "REVIEW", "BLOCK"]
