import json
from typing import Dict, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, Request, Header, BackgroundTasks
from sqlalchemy.orm import Session

from app.core.database import get_session, SessionLocal
from app.core.logging import logger
from app.services.razorpay_service import razorpay_service
from app.integrations.razorpay.signature import verify_webhook_signature
from app.schemas.prediction import PredictionResponse
from app.models.db_models import WebhookEventRecord, PaymentRecord

router = APIRouter(prefix="/payments/razorpay", tags=["Razorpay Test Integration"])

class CreateOrderRequest(BaseModel):
    amount_inr: float
    currency: str = "INR"
    receipt: Optional[str] = None

class CreateOrderResponse(BaseModel):
    order_id: str
    key_id: str
    amount_paise: int
    amount_inr: float
    currency: str
    receipt: str

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    customer_metadata: Optional[Dict[str, Any]] = None

@router.post("/order", response_model=CreateOrderResponse)
async def create_order(req: CreateOrderRequest, session: Session = Depends(get_session)):
    """Creates a Razorpay Test Mode order server-side."""
    if req.amount_inr <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive.")
    try:
        res = razorpay_service.create_order(
            amount_inr=req.amount_inr,
            currency=req.currency,
            receipt=req.receipt,
            session=session
        )
        return res
    except Exception as e:
        logger.error(f"Order creation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify", response_model=PredictionResponse)
async def verify_payment(req: VerifyPaymentRequest, session: Session = Depends(get_session)):
    """
    Verifies Razorpay Standard Checkout HMAC-SHA256 signature and executes Tuned LightGBM risk evaluation.
    """
    try:
        prediction = razorpay_service.verify_and_score_payment(
            order_id=req.razorpay_order_id,
            payment_id=req.razorpay_payment_id,
            signature=req.razorpay_signature,
            customer_metadata=req.customer_metadata,
            session=session
        )
        return prediction
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Payment verification failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def process_webhook_async(event_id: str, event_type: str, payload: Dict[str, Any]):
    """
    Asynchronous background handler for webhook reconciliation.
    Guarantees that slow database or ML tasks never block the fast 200 HTTP acknowledgment.
    Handles out-of-order webhook events (e.g. payment.captured arriving before or after order creation).
    """
    bg_session = SessionLocal()
    try:
        # 1. Update webhook record to processed
        rec = bg_session.query(WebhookEventRecord).filter(WebhookEventRecord.event_id == event_id).first()
        if rec:
            rec.processed = True
            bg_session.add(rec)

        # 2. Resilient State Machine / Out-of-Order Handling
        payment_entity = payload.get("payload", {}).get("payment", {}).get("entity", {})
        order_id = payment_entity.get("order_id")
        payment_id = payment_entity.get("id")

        if order_id and payment_id:
            pay_rec = bg_session.query(PaymentRecord).filter(PaymentRecord.razorpay_order_id == order_id).first()
            if pay_rec:
                pay_rec.razorpay_payment_id = payment_id
                pay_rec.status = payment_entity.get("status", "captured")
                bg_session.add(pay_rec)
            else:
                # Create placeholder record if captured webhook arrived before order was stored
                new_pay = PaymentRecord(
                    razorpay_order_id=order_id,
                    razorpay_payment_id=payment_id,
                    status=payment_entity.get("status", "captured"),
                    amount_paise=payment_entity.get("amount", 0),
                    currency=payment_entity.get("currency", "INR"),
                    payment_method=payment_entity.get("method", "card")
                )
                bg_session.add(new_pay)

        bg_session.commit()
        logger.info(f"Async webhook processing completed for event: {event_type} (ID: {event_id})")
    except Exception as e:
        logger.error(f"Error in background webhook processing for event {event_id}: {e}")
        bg_session.rollback()
    finally:
        bg_session.close()

@router.post("/webhook")
async def handle_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    x_razorpay_signature: Optional[str] = Header(None, alias="X-Razorpay-Signature"),
    x_razorpay_event_id: Optional[str] = Header(None, alias="X-Razorpay-Event-Id"),
    session: Session = Depends(get_session)
):
    """
    Fast, production-safe Razorpay webhook endpoint:
    1. Reads unparsed raw body bytes.
    2. Validates HMAC-SHA256 signature against RAZORPAY_WEBHOOK_SECRET.
    3. Uses exact 'X-Razorpay-Event-Id' for duplicate detection.
    4. Queues background worker for async state reconciliation.
    5. Returns fast 200 OK (< 20ms) to prevent gateway retries.
    """
    # 1. Read raw body bytes
    raw_body = await request.body()

    if not x_razorpay_signature:
        raise HTTPException(status_code=400, detail="Missing X-Razorpay-Signature header")

    # 2. Verify signature directly on raw bytes
    is_valid = verify_webhook_signature(raw_body, x_razorpay_signature)
    if not is_valid:
        logger.warning("Invalid Razorpay webhook signature received!")
        raise HTTPException(status_code=401, detail="Invalid webhook signature")

    # 3. Parse JSON payload
    try:
        payload = json.loads(raw_body.decode("utf-8"))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    # 4. Extract unique event ID strictly from X-Razorpay-Event-Id or payload
    event_id = x_razorpay_event_id or payload.get("event_id") or payload.get("id") or str(hash(raw_body))
    event_type = payload.get("event", "unknown")

    # 5. Idempotency Check: Reject duplicate event delivery
    existing = session.query(WebhookEventRecord).filter(WebhookEventRecord.event_id == event_id).first()
    if existing:
        logger.info(f"Duplicate webhook event {event_id} received. Acknowledging immediately.")
        return {"status": "ignored_duplicate", "event_id": event_id}

    # 6. Save event immediately with pending processing status
    webhook_rec = WebhookEventRecord(
        event_id=event_id,
        event_type=event_type,
        signature_valid=True,
        processed=False,
        payload_json=json.dumps(payload)
    )
    session.add(webhook_rec)
    session.commit()

    # 7. Hand off to asynchronous background worker & return fast 200 OK
    background_tasks.add_task(process_webhook_async, event_id, event_type, payload)

    logger.info(f"Webhook {event_type} (ID: {event_id}) verified & queued. Responded 200 OK.")
    return {"status": "acknowledged", "event_id": event_id, "event_type": event_type}
