import uuid
import time
import json
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from app.core.logging import logger
from app.core.config import settings
from app.integrations.razorpay.client import razorpay_client
from app.integrations.razorpay.signature import verify_payment_signature
from app.integrations.razorpay.adapter import razorpay_adapter
from app.services.preprocessing_service import preprocessing_service
from app.services.model_service import model_service
from app.services.risk_service import risk_service
from app.services.explanation_service import explanation_service
from app.schemas.prediction import PredictionResponse, ModelInfo, RiskAssessment, DecisionAction, Explanation, PerformanceTelemetry
from app.db.repositories import TransactionRepository, PaymentRepository, RiskAssessmentRepository, CaseRepository

class RazorpayService:
    """
    Coordinates end-to-end Razorpay Test Mode transactions with the RiskGuard ML engine:
    1. Server-side Order creation
    2. Payment verification
    3. Tuned LightGBM inference & calibration
    4. TreeSHAP explanation
    5. Durable relational database persistence with atomic transactions & rollbacks
    """

    def create_order(self, amount_inr: float, currency: str = "INR", receipt: Optional[str] = None, session: Optional[Session] = None) -> Dict[str, Any]:
        """Creates a Razorpay Test Order and records it."""
        amount_paise = int(round(amount_inr * 100))
        receipt_id = receipt or f"RG-TEST-{uuid.uuid4().hex[:8]}"

        order = razorpay_client.create_order(
            amount_paise=amount_paise,
            currency=currency,
            receipt=receipt_id
        )

        if session:
            try:
                payment_repo = PaymentRepository(session)
                payment_repo.create_or_update(
                    razorpay_order_id=order["id"],
                    amount_paise=amount_paise,
                    currency=currency,
                    status="created"
                )
                session.commit()
            except Exception as e:
                session.rollback()
                logger.error(f"Failed to record created payment order: {e}")
                raise e

        return {
            "order_id": order["id"],
            "key_id": settings.RAZORPAY_KEY_ID,
            "amount_paise": amount_paise,
            "amount_inr": amount_inr,
            "currency": currency,
            "receipt": receipt_id
        }

    def verify_and_score_payment(
        self,
        order_id: str,
        payment_id: str,
        signature: str,
        customer_metadata: Optional[Dict[str, Any]] = None,
        session: Optional[Session] = None
    ) -> PredictionResponse:
        """
        Verifies signature, fetches payment from Razorpay, runs Tuned LightGBM champion,
        generates SHAP explanation, and atomically persists relational state in database.
        """
        t_start = time.perf_counter()

        # 1. HMAC-SHA256 Signature Verification
        is_valid_sig = verify_payment_signature(order_id, payment_id, signature)
        if not is_valid_sig:
            logger.error(f"Invalid HMAC-SHA256 signature for Razorpay payment {payment_id}!")
            raise ValueError("Payment signature verification failed. Untrusted checkout response.")

        # 2. Fetch payment metadata from Razorpay API
        try:
            payment_info = razorpay_client.fetch_payment(payment_id)
        except Exception as e:
            logger.warning(f"Could not fetch payment {payment_id} from Razorpay: {e}. Using fallback.")
            payment_info = {"id": payment_id, "amount": 10000, "currency": "INR", "method": "card"}

        amount_paise = payment_info.get("amount", 10000)

        # 3. Canonical Adapter -> 492 features
        txn_input = razorpay_adapter.to_canonical_transaction(
            amount_paise=amount_paise,
            payment_data=payment_info,
            customer_data=customer_metadata
        )

        # 4. Preprocessing & Booster scoring
        features_df = preprocessing_service.transform_transaction(txn_input)

        t_infer_start = time.perf_counter()
        raw_prob = model_service.predict_raw(features_df)
        calibrated_prob = model_service.calibrate_probability(raw_prob)
        t_infer = (time.perf_counter() - t_infer_start) * 1000.0

        # 5. Isotonic Calibration & Tri-State Policy
        risk_obj, decision_obj = risk_service.evaluate_risk(raw_prob, calibrated_prob)

        # 6. TreeSHAP attribution
        explanation_obj = explanation_service.explain_transaction(features_df, risk_obj.risk_level)

        total_latency = (time.perf_counter() - t_start) * 1000.0
        txn_uuid = uuid.uuid4().hex[:8]

        model_name = model_service.metadata.get("model_name", "RiskGuard-Tuned-LightGBM-Champion")
        model_version = model_service.metadata.get("model_version", "1.0.0")

        response = PredictionResponse(
            transaction_id=txn_uuid,
            model=ModelInfo(
                name=model_name,
                version=model_version,
                framework="LightGBM",
                role="PRODUCTION_CHAMPION"
            ),
            risk=risk_obj,
            decision=DecisionAction(
                decision=decision_obj.decision,
                action=decision_obj.action,
                policy_rule=f"Razorpay Verified: {decision_obj.policy_rule}"
            ),
            explanation=explanation_obj,
            telemetry=PerformanceTelemetry(
                inference_latency_ms=round(t_infer, 2),
                total_latency_ms=round(total_latency, 2)
            )
        )

        # 7. Relational Persistence with Atomic Transaction Handling
        if session:
            try:
                txn_repo = TransactionRepository(session)
                pay_repo = PaymentRepository(session)
                risk_repo = RiskAssessmentRepository(session)
                case_repo = CaseRepository(session)

                # A. Store Transaction Record
                tx_rec = txn_repo.create(
                    transaction_uuid=txn_uuid,
                    provider="razorpay",
                    provider_order_id=order_id,
                    amount_minor=amount_paise,
                    amount_inr=amount_paise / 100.0,
                    amount_usd=txn_input.TransactionAmt,
                    currency="INR",
                    product_cd=txn_input.ProductCD,
                    card_network=txn_input.card4,
                    card_type=txn_input.card6,
                    email=customer_metadata.get("email") if customer_metadata else None,
                    device_type=txn_input.DeviceType
                )
                session.flush() # Populate tx_rec.id

                # B. Store/Update Payment Record
                pay_rec = pay_repo.create_or_update(
                    razorpay_order_id=order_id,
                    transaction_id=tx_rec.id,
                    razorpay_payment_id=payment_id,
                    signature_verified=True,
                    status=payment_info.get("status", "authorized"),
                    amount_paise=amount_paise,
                    payment_method=payment_info.get("method", "card")
                )

                # C. Store Risk Assessment Record with ML Model Governance
                factors_json = json.dumps([f.model_dump() for f in explanation_obj.top_factors])
                risk_rec = risk_repo.create(
                    transaction_id=tx_rec.id,
                    transaction_uuid=txn_uuid,
                    razorpay_order_id=order_id,
                    razorpay_payment_id=payment_id,
                    raw_probability=risk_obj.raw_probability,
                    calibrated_probability=risk_obj.calibrated_probability,
                    risk_score=risk_obj.risk_score,
                    risk_level=risk_obj.risk_level,
                    decision=decision_obj.decision,
                    action=decision_obj.action,
                    policy_rule=decision_obj.policy_rule,
                    model_name=model_name,
                    model_version=model_version,
                    top_factors_json=factors_json,
                    inference_latency_ms=t_infer,
                    total_latency_ms=total_latency
                )
                session.flush() # Populate risk_rec.id

                # D. Create Case
                total_cases = case_repo.count()
                case_id = f"RG-{total_cases + 1848}"
                case_rec = case_repo.create(
                    case_id=case_id,
                    transaction_id=tx_rec.id,
                    risk_assessment_id=risk_rec.id,
                    transaction_uuid=txn_uuid,
                    razorpay_payment_id=payment_id,
                    amount_usd=txn_input.TransactionAmt,
                    risk_score=risk_obj.risk_score,
                    risk_level=risk_obj.risk_level,
                    decision=decision_obj.decision,
                    action=decision_obj.action,
                    status="blocked" if decision_obj.action == "BLOCK" else "review" if decision_obj.action == "REVIEW" else "resolved"
                )

                # Commit all relational state atomically
                session.commit()
                logger.info(f"Persisted Case {case_id} for Transaction {txn_uuid} & Razorpay Payment {payment_id}")
            except Exception as e:
                session.rollback()
                logger.error(f"Transaction failed, rolled back all changes: {e}")
                raise e

        return response

razorpay_service = RazorpayService()
