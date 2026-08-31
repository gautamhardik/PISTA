from typing import Dict, Any, Optional
from app.schemas.transaction import TransactionInput
from app.core.logging import logger

class RazorpayTransactionAdapter:
    """
    Translates raw Razorpay order, payment, and customer payloads into 
    canonical RiskGuard TransactionInput suitable for the 492-feature ML model.
    
    SCIENTIFIC METHODOLOGY, COVARIATE SHIFT & ARCHITECTURAL MAPPING DOCUMENTATION:
    -----------------------------------------------------------------------------------------------------
    IMPORTANT SCIENTIFIC CAVEAT:
    The Razorpay integration is a technical integration demonstration using the IEEE-CIS-trained 
    RiskGuard champion model. Because Razorpay transaction data does not contain the complete IEEE-CIS 
    feature space, unavailable features remain missing according to the established preprocessing protocol. 
    Therefore, RiskGuard's Razorpay-mode predictions should be interpreted as model outputs under 
    distribution shift, not as independently validated Razorpay fraud-performance metrics.
    -----------------------------------------------------------------------------------------------------
    Razorpay Source Field     RiskGuard Canonical Field   IEEE-CIS ML Feature   Transformation & Rationale
    -----------------------------------------------------------------------------------------------------
    payment.amount (paise)    amount_inr -> amount_usd    TransactionAmt        UNIT COMPATIBILITY TRANSFORMATION:
                                                                                Scaled from INR paise to INR float, then 
                                                                                converted using fixed 1/83.0 rate so the 
                                                                                monetary feature uses the same nominal unit 
                                                                                (USD) as training data. Does not claim statistical 
                                                                                equivalence to IEEE-CIS dollar distribution.
    payment.method            product_cd                  ProductCD             PROVIDER PROXY MAPPING:
                                                                                "card" -> "C" (Card), other methods -> "W" (Web).
                                                                                Populated as a provider-to-dataset proxy mapping;
                                                                                not semantically identical to IEEE-CIS categories.
    payment.card.network      card_network                card4                 Lowercase network string ("visa", "mastercard", etc.).
    payment.card.type         card_type                   card6                 Card classification ("credit" or "debit").
    payment.card.last4        synthetic_card_id           card1                 DERIVED INTEGRATION IDENTIFIER:
                                                                                Numerical proxy derived from last4 digits (last4 * 10).
                                                                                Explicitly classified as an integration proxy, not
                                                                                real device or fraud intelligence.
    payment.email             email_domain                P_emaildomain         Domain extracted after "@" symbol ("gmail.com", etc.).
    customer.device_type      device_type                 DeviceType            Client device category ("desktop" or "mobile").
    payment.user_agent        device_info                 DeviceInfo            Raw browser user agent string.
    customer.addr1            billing_region              addr1                 Billing state / regional proxy code.
    customer.addr2            country_code                addr2                 Country / international billing proxy.
    -----------------------------------------------------------------------------------------------------
    All remaining 480+ IEEE-CIS features (V-features, D-features, C-features) follow the missingness baseline 
    in PreprocessingService (imputed to NaN and processed via LightGBM's native missing-value split algorithm, 
    matching the training protocol).
    """
    
    # 1 USD ≈ 83.0 INR (Fixed unit-compatibility baseline)
    INR_TO_USD_RATE = 1.0 / 83.0

    @classmethod
    def to_canonical_transaction(
        cls, 
        amount_paise: int, 
        payment_data: Optional[Dict[str, Any]] = None, 
        customer_data: Optional[Dict[str, Any]] = None
    ) -> TransactionInput:
        payment_data = payment_data or {}
        customer_data = customer_data or {}

        # 1. Convert amount: Use explicit customer/preset amount if present, else convert paise -> INR -> USD
        amount_inr = amount_paise / 100.0
        if customer_data.get("TransactionAmt"):
            amount_usd = float(customer_data["TransactionAmt"])
        else:
            amount_usd = round(amount_inr * cls.INR_TO_USD_RATE, 2)
            if amount_usd < 1.0:
                amount_usd = 1.0

        # 2. Product type proxy mapping
        product_cd = customer_data.get("ProductCD") or ("C" if payment_data.get("method") == "card" else "W")

        # 3. Card entity extraction
        card_obj = payment_data.get("card") or {}
        card4 = (customer_data.get("card4") or card_obj.get("network") or "visa").lower()
        card6 = (customer_data.get("card6") or card_obj.get("type") or "credit").lower()
        
        # 4. Email parsing
        email = customer_data.get("email") or payment_data.get("email") or "customer@gmail.com"
        email_domain = customer_data.get("P_emaildomain") or (email.split("@")[-1] if "@" in email else "gmail.com")

        # 5. Derived Card ID: Preset ID takes priority over test gateway placeholder
        last4 = card_obj.get("last4")
        if customer_data.get("card1"):
            card1_id = int(customer_data.get("card1"))
        elif last4 and last4.isdigit():
            card1_id = int(last4) * 10
        else:
            card1_id = 13926

        # 6. Additional Features from preset
        additional_features = customer_data.get("additional_features", {})

        logger.info(
            f"Adapted Razorpay Payment -> INR: ₹{amount_inr:.2f} -> USD: ${amount_usd:.2f} | "
            f"Network: {card4} | Type: {card6} | Domain: {email_domain} | Card1: {card1_id} | "
            f"AdditionalFeatures: {len(additional_features)}"
        )

        return TransactionInput(
            TransactionAmt=amount_usd,
            ProductCD=product_cd,
            card1=card1_id,
            card4=card4,
            card6=card6,
            addr1=customer_data.get("addr1", 315.0),
            addr2=customer_data.get("addr2", 87.0),
            P_emaildomain=email_domain,
            R_emaildomain=customer_data.get("R_emaildomain", email_domain),
            DeviceType=customer_data.get("device_type", "desktop"),
            DeviceInfo=payment_data.get("user_agent", "Mozilla/5.0"),
            additional_features=additional_features
        )

razorpay_adapter = RazorpayTransactionAdapter()
