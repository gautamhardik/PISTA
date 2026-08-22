from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.db_models import TransactionRecord, PaymentRecord, RiskAssessmentRecord, CaseRecord, WebhookEventRecord

class TransactionRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, **kwargs) -> TransactionRecord:
        record = TransactionRecord(**kwargs)
        self.session.add(record)
        return record

    def get_by_uuid(self, uuid_str: str) -> Optional[TransactionRecord]:
        return self.session.query(TransactionRecord).filter(TransactionRecord.transaction_uuid == uuid_str).first()

    def get_by_order_id(self, order_id: str) -> Optional[TransactionRecord]:
        return self.session.query(TransactionRecord).filter(TransactionRecord.provider_order_id == order_id).first()

class PaymentRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_or_update(self, razorpay_order_id: str, **kwargs) -> PaymentRecord:
        record = self.session.query(PaymentRecord).filter(PaymentRecord.razorpay_order_id == razorpay_order_id).first()
        if not record:
            record = PaymentRecord(razorpay_order_id=razorpay_order_id, **kwargs)
            self.session.add(record)
        else:
            for k, v in kwargs.items():
                setattr(record, k, v)
        return record

class RiskAssessmentRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, **kwargs) -> RiskAssessmentRecord:
        record = RiskAssessmentRecord(**kwargs)
        self.session.add(record)
        return record

    def list_recent(self, limit: int = 50) -> List[RiskAssessmentRecord]:
        return self.session.query(RiskAssessmentRecord).order_by(RiskAssessmentRecord.id.desc()).limit(limit).all()

class CaseRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, **kwargs) -> CaseRecord:
        record = CaseRecord(**kwargs)
        self.session.add(record)
        return record

    def get_by_case_id(self, case_id: str) -> Optional[CaseRecord]:
        return self.session.query(CaseRecord).filter(CaseRecord.case_id == case_id).first()

    def list_recent(self, limit: int = 50) -> List[CaseRecord]:
        return self.session.query(CaseRecord).order_by(CaseRecord.id.desc()).limit(limit).all()

    def count(self) -> int:
        return self.session.query(CaseRecord).count()

    def update_status(self, case_id: str, new_status: str, resolution: Optional[str] = None, note: Optional[str] = None) -> Optional[CaseRecord]:
        record = self.get_by_case_id(case_id)
        if not record:
            return None
        record.status = new_status
        if resolution:
            record.resolution = resolution
        if note:
            record.investigator_note = note
        if new_status in ["resolved", "blocked"]:
            record.resolved_at = datetime.utcnow()
        record.updated_at = datetime.utcnow()
        return record

class CaseAuditRepository:
    def __init__(self, session: Session):
        self.session = session

    def log_event(self, case_id: str, event_type: str, previous_status: Optional[str] = None, new_status: Optional[str] = None, actor: str = "Investigator", reason: Optional[str] = None, note: Optional[str] = None):
        from app.models.db_models import CaseAuditRecord
        audit = CaseAuditRecord(
            case_id=case_id,
            event_type=event_type,
            previous_status=previous_status,
            new_status=new_status,
            actor=actor,
            reason=reason,
            note=note,
            created_at=datetime.utcnow()
        )
        self.session.add(audit)
        return audit

    def list_by_case(self, case_id: str):
        from app.models.db_models import CaseAuditRecord
        return self.session.query(CaseAuditRecord).filter(CaseAuditRecord.case_id == case_id).order_by(CaseAuditRecord.id.asc()).all()

class WebhookRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_event_id(self, event_id: str) -> Optional[WebhookEventRecord]:
        return self.session.query(WebhookEventRecord).filter(WebhookEventRecord.event_id == event_id).first()

    def record_event(self, **kwargs) -> WebhookEventRecord:
        record = WebhookEventRecord(**kwargs)
        self.session.add(record)
        return record
