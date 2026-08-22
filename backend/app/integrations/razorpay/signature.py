import hmac
import hashlib
from typing import Optional
from app.core.config import settings
from app.core.logging import logger

def verify_payment_signature(order_id: str, payment_id: str, signature: str, key_secret: Optional[str] = None) -> bool:
    """
    Verifies Razorpay Standard Checkout payment signature using HMAC-SHA256:
    signature = HMAC_SHA256(order_id + "|" + payment_id, secret)
    """
    secret = key_secret or settings.RAZORPAY_KEY_SECRET
    msg = f"{order_id}|{payment_id}".encode("utf-8")
    
    generated_sig = hmac.new(
        secret.encode("utf-8"),
        msg,
        hashlib.sha256
    ).hexdigest()

    is_valid = hmac.compare_digest(generated_sig, signature)
    if not is_valid:
        logger.warning(f"Razorpay payment signature mismatch for order {order_id}!")
    return is_valid

def verify_webhook_signature(raw_body: bytes, signature: str, webhook_secret: Optional[str] = None) -> bool:
    """
    Verifies Razorpay webhook signature directly from the unparsed RAW HTTP request body.
    signature = HMAC_SHA256(raw_request_body, webhook_secret)
    """
    secret = webhook_secret or settings.RAZORPAY_WEBHOOK_SECRET
    generated_sig = hmac.new(
        secret.encode("utf-8"),
        raw_body,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(generated_sig, signature)
