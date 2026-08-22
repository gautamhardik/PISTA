from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, CheckConstraint
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class TransactionRecord(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    transaction_uuid = Column(String(64), unique=True, index=True, nullable=False)
    provider = Column(String(32), default="direct", nullable=False) # "direct" or "razorpay"
    provider_order_id = Column(String(64), index=True, nullable=True)
    amount_minor = Column(Integer, nullable=False) # In paise / cents
    amount_inr = Column(Float, nullable=False)
    amount_usd = Column(Float, nullable=False) # Nominal USD equivalent for ML model
    currency = Column(String(10), default="INR", nullable=False)
    product_cd = Column(String(10), default="W", nullable=False)
    card_network = Column(String(32), nullable=True)
    card_type = Column(String(32), nullable=True)
    email = Column(String(128), nullable=True)
    device_type = Column(String(32), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    payments = relationship("PaymentRecord", back_populates="transaction", cascade="all, delete-orphan")
    risk_assessments = relationship("RiskAssessmentRecord", back_populates="transaction", cascade="all, delete-orphan")
    cases = relationship("CaseRecord", back_populates="transaction", cascade="all, delete-orphan")

class PaymentRecord(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    transaction_id = Column(Integer, ForeignKey("transactions.id", ondelete="CASCADE"), nullable=True)
    razorpay_order_id = Column(String(64), index=True, nullable=False)
    razorpay_payment_id = Column(String(64), index=True, nullable=True)
    signature_verified = Column(Boolean, default=False, nullable=False)
    status = Column(String(32), default="created", nullable=False) # created, authorized, captured, failed
    amount_paise = Column(Integer, nullable=False)
    currency = Column(String(10), default="INR", nullable=False)
    payment_method = Column(String(32), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    transaction = relationship("TransactionRecord", back_populates="payments")

class RiskAssessmentRecord(Base):
    __tablename__ = "risk_assessments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    transaction_id = Column(Integer, ForeignKey("transactions.id", ondelete="CASCADE"), nullable=True)
    transaction_uuid = Column(String(64), index=True, nullable=False)
    razorpay_order_id = Column(String(64), index=True, nullable=True)
    razorpay_payment_id = Column(String(64), index=True, nullable=True)
    raw_probability = Column(Float, nullable=False)
    calibrated_probability = Column(Float, nullable=False)
    risk_score = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False) # LOW, MEDIUM, HIGH, CRITICAL
    decision = Column(String(20), nullable=False) # LEGITIMATE, SUSPICIOUS, FRAUD
    action = Column(String(20), nullable=False) # APPROVE, REVIEW, BLOCK
    policy_rule = Column(String(255), nullable=False)
    model_name = Column(String(64), default="RiskGuard-Tuned-LightGBM-Champion", nullable=False)
    model_version = Column(String(16), default="1.0.0", nullable=False)
    top_factors_json = Column(Text, nullable=True)
    inference_latency_ms = Column(Float, nullable=False)
    total_latency_ms = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    transaction = relationship("TransactionRecord", back_populates="risk_assessments")
    cases = relationship("CaseRecord", back_populates="risk_assessment", cascade="all, delete-orphan")

    __table_args__ = (
        CheckConstraint("risk_score >= 0.0 AND risk_score <= 100.0", name="chk_risk_score_range"),
        CheckConstraint("calibrated_probability >= 0.0 AND calibrated_probability <= 1.0", name="chk_prob_range"),
    )

class CaseRecord(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, autoincrement=True)
    case_id = Column(String(32), unique=True, index=True, nullable=False) # RG-1848, etc.
    transaction_id = Column(Integer, ForeignKey("transactions.id", ondelete="CASCADE"), nullable=True)
    risk_assessment_id = Column(Integer, ForeignKey("risk_assessments.id", ondelete="CASCADE"), nullable=True)
    transaction_uuid = Column(String(64), index=True, nullable=False)
    razorpay_payment_id = Column(String(64), nullable=True)
    amount_usd = Column(Float, nullable=False)
    risk_score = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)
    decision = Column(String(20), nullable=False)
    action = Column(String(20), nullable=False)
    status = Column(String(20), default="open", index=True, nullable=False) # open, review, blocked, resolved
    resolution = Column(String(64), nullable=True) # confirmed_legitimate, confirmed_fraud, false_positive, customer_verified
    investigator_note = Column(Text, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    transaction = relationship("TransactionRecord", back_populates="cases")
    risk_assessment = relationship("RiskAssessmentRecord", back_populates="cases")

class WebhookEventRecord(Base):
    __tablename__ = "webhook_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    event_id = Column(String(128), unique=True, index=True, nullable=False) # x-razorpay-event-id
    event_type = Column(String(64), index=True, nullable=False) # payment.authorized, payment.failed, order.paid
    signature_valid = Column(Boolean, nullable=False)
    status = Column(String(32), default="received", nullable=False) # received, processed, ignored_duplicate
    processed = Column(Boolean, default=False, nullable=False)
    payload_json = Column(Text, nullable=False)
    received_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    processed_at = Column(DateTime, nullable=True)

class CaseAuditRecord(Base):
    __tablename__ = "case_audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    case_id = Column(String(32), index=True, nullable=False)
    event_type = Column(String(64), nullable=False) # STATUS_CHANGE, NOTE_ADDED, CREATED, RESOLVED
    previous_status = Column(String(32), nullable=True)
    new_status = Column(String(32), nullable=True)
    actor = Column(String(64), default="Investigator", nullable=False)
    reason = Column(String(128), nullable=True)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

