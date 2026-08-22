import requests
from typing import Dict, Any, Optional
from app.core.config import settings
from app.core.logging import logger

class RazorpayClient:
    """
    Standard Razorpay Test API Client communicating directly with https://api.razorpay.com/v1.
    Authenticated via HTTP Basic Auth (Key ID + Key Secret).
    """
    BASE_URL = "https://api.razorpay.com/v1"

    def __init__(self, key_id: Optional[str] = None, key_secret: Optional[str] = None):
        self.key_id = key_id or settings.RAZORPAY_KEY_ID
        self.key_secret = key_secret or settings.RAZORPAY_KEY_SECRET

    @property
    def auth(self):
        return (self.key_id, self.key_secret)

    def create_order(self, amount_paise: int, currency: str = "INR", receipt: Optional[str] = None, notes: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Creates a Razorpay Order server-side before checkout.
        Amount must be in the smallest currency sub-unit (e.g., 10000 paise = ₹100.00).
        """
        url = f"{self.BASE_URL}/orders"
        payload = {
            "amount": amount_paise,
            "currency": currency,
            "receipt": receipt or f"RG-TEST-{int(amount_paise)}",
            "notes": notes or {"platform": "RiskGuard-Fraud-Decision-Engine"}
        }
        
        logger.info(f"Creating Razorpay Order: amount={amount_paise} paise, currency={currency}")
        res = requests.post(url, json=payload, auth=self.auth, timeout=10)
        if not res.ok:
            logger.error(f"Razorpay Order creation failed: {res.status_code} - {res.text}")
            raise Exception(f"Razorpay Order API Error: {res.status_code} - {res.text}")
        
        return res.json()

    def fetch_order(self, order_id: str) -> Dict[str, Any]:
        """Fetches order metadata from Razorpay API."""
        url = f"{self.BASE_URL}/orders/{order_id}"
        res = requests.get(url, auth=self.auth, timeout=10)
        if not res.ok:
            raise Exception(f"Razorpay Fetch Order Error: {res.status_code} - {res.text}")
        return res.json()

    def fetch_payment(self, payment_id: str) -> Dict[str, Any]:
        """Fetches payment details including method, card network/type from Razorpay API."""
        url = f"{self.BASE_URL}/payments/{payment_id}"
        res = requests.get(url, auth=self.auth, timeout=10)
        if not res.ok:
            raise Exception(f"Razorpay Fetch Payment Error: {res.status_code} - {res.text}")
        return res.json()

razorpay_client = RazorpayClient()
