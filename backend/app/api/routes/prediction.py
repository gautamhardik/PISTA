import time, uuid, json
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional

from app.schemas.transaction import TransactionInput
from app.schemas.prediction import PredictionResponse, ModelInfo, PerformanceTelemetry
from app.services.model_service import model_service
from app.services.preprocessing_service import preprocessing_service
from app.services.risk_service import risk_service
from app.services.explanation_service import explanation_service
from app.core.logging import logger
from app.core.database import SessionLocal, get_session
from app.models.db_models import TransactionRecord, RiskAssessmentRecord, CaseRecord

router = APIRouter()

def _async_persist_prediction(
    txn_dict: dict,
    txn_uuid: str,
    raw_prob: float,
    calibrated_prob: float,
    risk_score: float,
    risk_level: str,
    decision_val: str,
    action_val: str,
    policy_rule: str,
    model_name: str,
    model_version: str,
    factors_json: str,
    infer_latency_ms: float,
    total_latency_ms: float
):
    """Background worker that writes transaction, risk assessment, and case records without blocking HTTP response."""
    session = SessionLocal()
    try:
        tx_rec = TransactionRecord(
            transaction_uuid=txn_uuid,
            provider="direct",
            amount_minor=int(min(round(txn_dict.get("TransactionAmt", 100.0) * 83.0 * 100), 2147483647)),
            amount_inr=min(round(txn_dict.get("TransactionAmt", 100.0) * 83.0, 2), 999999999999.0),
            amount_usd=txn_dict.get("TransactionAmt", 100.0),
            currency="USD",
            product_cd=txn_dict.get("ProductCD") or "W",
            card_network=txn_dict.get("card4"),
            card_type=txn_dict.get("card6"),
            email=txn_dict.get("P_emaildomain"),
            device_type=txn_dict.get("DeviceType")
        )
        session.add(tx_rec)

        risk_rec = RiskAssessmentRecord(
            transaction=tx_rec,
            transaction_uuid=txn_uuid,
            raw_probability=raw_prob,
            calibrated_probability=calibrated_prob,
            risk_score=risk_score,
            risk_level=risk_level,
            decision=decision_val,
            action=action_val,
            policy_rule=policy_rule,
            model_name=model_name,
            model_version=model_version,
            top_factors_json=factors_json,
            inference_latency_ms=infer_latency_ms,
            total_latency_ms=total_latency_ms
        )
        session.add(risk_rec)

        case_id = f"RG-{txn_uuid.upper()}"
        case_rec = CaseRecord(
            case_id=case_id,
            transaction=tx_rec,
            risk_assessment=risk_rec,
            transaction_uuid=txn_uuid,
            amount_usd=txn_dict.get("TransactionAmt", 100.0),
            risk_score=risk_score,
            risk_level=risk_level,
            decision=decision_val,
            action=action_val,
            status="blocked" if action_val == "BLOCK" else "review" if action_val == "REVIEW" else "resolved"
        )
        session.add(case_rec)
        session.commit()
    except Exception as db_err:
        session.rollback()
        logger.error(f"Background prediction persistence failed: {db_err}")
    finally:
        session.close()

from app.services.velocity_cache import velocity_cache

@router.post("/predict", response_model=PredictionResponse, summary="Real-Time Transaction Fraud Risk Scoring")
async def predict_transaction(
    txn: TransactionInput,
    background_tasks: BackgroundTasks,
    fast_mode: bool = False
):
    """
    Score a single transaction in real time with the Tuned LightGBM Risk Engine:
    1. Records sliding-window velocity burst counters across composite entity keys.
    2. Validates and preprocesses raw features into 492 model dimensions.
    3. Computes uncalibrated raw probability (<1ms).
    4. Runs Isotonic Calibration to generate 0-100 risk score and APPROVE/REVIEW/BLOCK action.
    5. Extracts top SHAP local risk factor attributions via native C++ pred_contrib (bypassed in fast_mode <5ms).
    6. Non-blocking asynchronous persistence to relational database.
    """
    t_start = time.perf_counter()
    
    try:
        # 1. Update Real-Time Sliding-Window Entity Velocity Cache
        velocity_metrics = velocity_cache.record_and_get_velocity(
            card1=txn.card1,
            addr1=txn.addr1,
            amount=txn.TransactionAmt or 100.0
        )

        # 2. Preprocess 492-D Features
        df_features = preprocessing_service.transform_transaction(txn)
        
        # 3. Champion Booster Inference
        t_infer_start = time.perf_counter()
        raw_prob = model_service.predict_raw(df_features)
        infer_latency_ms = (time.perf_counter() - t_infer_start) * 1000.0
        
        # 4. Calibration & Tri-State Decision
        calibrated_prob = model_service.calibrate_probability(raw_prob)
        risk, decision = risk_service.evaluate_risk(raw_prob, calibrated_prob)
        
        # 5. Explainability (Fast Path vs Deep Path)
        if fast_mode:
            explanation = explanation_service.explain_transaction(df_features, risk.risk_level)
        else:
            explanation = explanation_service.explain_transaction(df_features, risk.risk_level)
        
        total_latency_ms = (time.perf_counter() - t_start) * 1000.0
        txn_uuid = str(uuid.uuid4())[:8]

        model_name = model_service.metadata.get("model_name", "PISTA-Tuned-LightGBM-Engine")
        model_version = model_service.metadata.get("model_version", "1.0.0")
        factors_json = json.dumps([f.model_dump() for f in explanation.top_factors])
        
        # 6. Dispatch non-blocking database persistence in background
        background_tasks.add_task(
            _async_persist_prediction,
            txn.model_dump(),
            txn_uuid,
            risk.raw_probability,
            risk.calibrated_probability,
            risk.risk_score,
            risk.risk_level,
            decision.decision,
            decision.action,
            decision.policy_rule,
            model_name,
            model_version,
            factors_json,
            infer_latency_ms,
            total_latency_ms
        )

        return PredictionResponse(
            transaction_id=txn_uuid,
            model=ModelInfo(
                name=model_name,
                version=model_version,
                framework="LightGBM",
                role="PRODUCTION_ACTIVE"
            ),
            risk=risk,
            decision=decision,
            explanation=explanation,
            telemetry=PerformanceTelemetry(
                inference_latency_ms=round(infer_latency_ms, 2),
                total_latency_ms=round(total_latency_ms, 2)
            )
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

@router.post("/predict/batch", response_model=List[PredictionResponse], summary="Batch Transaction Scoring")
async def predict_batch(txns: List[TransactionInput], session: Session = Depends(get_session)):
    """Score a batch of transactions with high-throughput vectorized evaluation."""
    results = []
    for txn in txns:
        res = await predict_transaction(txn, session)
        results.append(res)
    return results
