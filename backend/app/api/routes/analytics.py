from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import polars as pl
import os
from datetime import datetime, date

from app.core.database import get_session
from app.db.repositories import CaseRepository, TransactionRepository, RiskAssessmentRepository
from app.models.db_models import CaseRecord, TransactionRecord, RiskAssessmentRecord

router = APIRouter()

class CaseStatusUpdate(BaseModel):
    status: str # "review", "blocked", "resolved"
    resolution: Optional[str] = None # "confirmed_legitimate", "confirmed_fraud", "false_positive", "customer_verified"
    investigator_note: Optional[str] = None

# Explicit State Transition Graph
VALID_TRANSITIONS = {
    "open": ["review", "resolved", "blocked"],
    "review": ["resolved", "blocked"],
    "blocked": ["review"], # Re-open for appeal/investigation
    "resolved": ["review"], # Re-open if subsequent chargeback arrives
}

@router.get("/analytics/summary", summary="Operational Fraud Telemetry Summary")
async def get_analytics_summary():
    """Returns static held-out validation cohort metrics (118,534 transactions)."""
    summary_path = "output/reports/risk_band_operational_summary.csv"
    if os.path.exists(summary_path):
        df_q = pl.read_csv(summary_path)
        return {
            "status": "active",
            "total_validation_traffic": int(df_q['tx_volume'].sum()),
            "total_frauds_identified": int(df_q['fraud_count'].sum()),
            "queues": df_q.to_dicts()
        }
    return {"status": "telemetry_pending", "message": "Telemetry reports initializing"}

@router.get("/analytics/live", summary="Live Production Operational Telemetry")
async def get_live_analytics(timeframe: str = "today", session: Session = Depends(get_session)):
    """Computes live operational metrics from PostgreSQL with P95 latency and decision routing."""
    case_repo = CaseRepository(session)
    risk_repo = RiskAssessmentRepository(session)
    
    recent_assessments = risk_repo.list_recent(limit=200)
    all_cases = case_repo.list_recent(limit=200)
    
    total_tx = len(recent_assessments)
    if total_tx == 0:
        return {
            "status": "active",
            "timeframe": timeframe,
            "today_transactions": 0,
            "today_approved": 0,
            "today_review": 0,
            "today_blocked": 0,
            "total_cases": 0,
            "avg_risk_score": 0.0,
            "p95_latency_ms": 0.0,
            "mean_latency_ms": 0.0
        }
    
    approved = sum(1 for a in recent_assessments if a.action == "APPROVE")
    review = sum(1 for a in recent_assessments if a.action == "REVIEW")
    blocked = sum(1 for a in recent_assessments if a.action == "BLOCK")
    avg_score = sum(a.risk_score for a in recent_assessments) / total_tx
    latencies = sorted([a.total_latency_ms for a in recent_assessments])
    p95_idx = int(len(latencies) * 0.95)
    p95_latency = latencies[p95_idx] if latencies else 0.0
    mean_latency = sum(latencies) / len(latencies) if latencies else 0.0
    
    return {
        "status": "active",
        "timeframe": timeframe,
        "today_transactions": total_tx,
        "today_approved": approved,
        "today_review": review,
        "today_blocked": blocked,
        "total_cases": len(all_cases),
        "avg_risk_score": round(avg_score, 2),
        "p95_latency_ms": round(p95_latency, 2),
        "mean_latency_ms": round(mean_latency, 2)
    }

@router.get("/cases", summary="List Persistent Operational Cases")
async def list_cases(session: Session = Depends(get_session)):
    """Fetches real persistent cases stored in PostgreSQL."""
    case_repo = CaseRepository(session)
    cases = case_repo.list_recent(limit=50)
    return [
        {
            "id": c.case_id,
            "transaction_id": c.transaction_uuid,
            "razorpay_payment_id": c.razorpay_payment_id,
            "amount": c.amount_usd,
            "risk_score": c.risk_score,
            "risk_level": c.risk_level,
            "decision": c.decision,
            "action": c.action,
            "status": c.status,
            "resolution": c.resolution,
            "investigator_note": c.investigator_note,
            "resolved_at": c.resolved_at.isoformat() if c.resolved_at else None,
            "created_at": c.created_at.isoformat()
        }
        for c in cases
    ]

@router.get("/cases/{case_id}/audit", summary="Get Case Audit Event Trail")
async def get_case_audit(case_id: str, session: Session = Depends(get_session)):
    """Returns chronological audit events and state transitions for an investigation case."""
    from app.db.repositories import CaseAuditRepository
    audit_repo = CaseAuditRepository(session)
    events = audit_repo.list_by_case(case_id)
    return [
        {
            "id": e.id,
            "case_id": e.case_id,
            "event_type": e.event_type,
            "previous_status": e.previous_status,
            "new_status": e.new_status,
            "actor": e.actor,
            "reason": e.reason,
            "note": e.note,
            "created_at": e.created_at.isoformat()
        }
        for e in events
    ]

@router.patch("/cases/{case_id}/status", summary="Investigator Case Resolution & Audit Logging")
async def update_case_status(case_id: str, update_req: CaseStatusUpdate, session: Session = Depends(get_session)):
    """Updates case resolution status with strict state machine validation and investigator audit trail."""
    from app.db.repositories import CaseAuditRepository
    case_repo = CaseRepository(session)
    audit_repo = CaseAuditRepository(session)
    
    case_record = case_repo.get_by_case_id(case_id)
    if not case_record:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found.")

    target_status = update_req.status.lower()
    current_status = case_record.status.lower()

    if target_status not in VALID_TRANSITIONS.get(current_status, []):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid state transition: Cannot transition case from '{current_status}' to '{target_status}'. Valid targets are: {VALID_TRANSITIONS.get(current_status, [])}"
        )

    updated = case_repo.update_status(
        case_id=case_id,
        new_status=target_status,
        resolution=update_req.resolution,
        note=update_req.investigator_note
    )
    
    # Record Audit Event
    audit_repo.log_event(
        case_id=case_id,
        event_type="STATUS_CHANGED",
        previous_status=current_status,
        new_status=target_status,
        actor="Investigator",
        reason=update_req.resolution or "Manual triage review",
        note=update_req.investigator_note
    )
    session.commit()

    return {
        "status": "success",
        "case_id": updated.case_id,
        "new_status": updated.status,
        "resolution": updated.resolution,
        "investigator_note": updated.investigator_note,
        "resolved_at": updated.resolved_at.isoformat() if updated.resolved_at else None,
        "updated_at": updated.updated_at.isoformat()
    }

@router.get("/activity", summary="List Persistent Operational Activity Stream")
async def list_activity(session: Session = Depends(get_session)):
    """Fetches chronological decision events stored in PostgreSQL."""
    risk_repo = RiskAssessmentRepository(session)
    assessments = risk_repo.list_recent(limit=50)
    
    return [
        {
            "transaction_id": a.transaction_uuid,
            "razorpay_order_id": a.razorpay_order_id,
            "razorpay_payment_id": a.razorpay_payment_id,
            "risk": {
                "raw_probability": a.raw_probability,
                "calibrated_probability": a.calibrated_probability,
                "risk_score": a.risk_score,
                "risk_level": a.risk_level
            },
            "decision": {
                "decision": a.decision,
                "action": a.action,
                "policy_rule": a.policy_rule
            },
            "explanation": {
                "summary": f"Risk score {a.risk_score:.1f}/100 evaluated under {a.decision} policy.",
                "top_factors": []
            },
            "telemetry": {
                "inference_latency_ms": a.inference_latency_ms,
                "total_latency_ms": a.total_latency_ms
            },
            "model": {
                "name": a.model_name,
                "version": a.model_version
            },
            "created_at": a.created_at.isoformat()
        }
        for a in assessments
    ]
