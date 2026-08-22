import numpy as np
import polars as pl
import pandas as pd
from typing import Dict, Any
from app.schemas.transaction import TransactionInput
from app.services.model_service import model_service
from app.core.logging import logger

class PreprocessingService:
    def transform_transaction(self, txn: TransactionInput) -> pd.DataFrame:
        """
        Transforms raw transaction input into exact 492-feature representation
        matching the training pipeline in Notebook 2 using vectorized single-pass dictionary assembly.
        """
        data = txn.model_dump()
        additional = data.pop("additional_features", {}) or {}
        data.update(additional)

        # 1. Base values extraction
        amt = float(data.get("TransactionAmt", 0.0) or 0.0)
        amt_log1p = float(np.log1p(amt))
        amt_cents = float(amt - np.floor(amt))
        amt_is_round = int(amt_cents == 0.0)

        card1 = str(data.get("card1") or "missing")
        card2 = str(data.get("card2") or "missing")
        card3 = str(data.get("card3") or "missing")
        card4 = str(data.get("card4") or "missing")
        card5 = str(data.get("card5") or "missing")
        card6 = str(data.get("card6") or "missing")
        addr1 = str(data.get("addr1") or "missing")
        addr2 = str(data.get("addr2") or "missing")
        prod = str(data.get("ProductCD") or "W")
        p_email = str(data.get("P_emaildomain") or "missing")
        r_email = str(data.get("R_emaildomain") or "missing")
        dev = str(data.get("DeviceType") or "unknown")

        both_emails = int((p_email != "missing") and (r_email != "missing"))

        # 2. Engineered feature dictionary
        features: Dict[str, Any] = {
            "fe_amt_log1p": amt_log1p,
            "fe_amt_cents": amt_cents,
            "fe_amt_is_round": amt_is_round,
            "proxy_card1_card2": f"{card1}_{card2}",
            "proxy_card1_addr1": f"{card1}_{addr1}",
            "proxy_card_full": f"{card1}_{card2}_{card3}_{card4}_{card5}_{card6}",
            "proxy_card1_email": f"{card1}_{p_email}",
            "proxy_card1_device": f"{card1}_{dev}",
            "proxy_card1_prod": f"{card1}_{prod}",
            "proxy_addr1_addr2": f"{addr1}_{addr2}",
            "fe_addr_dist1_isna": int(data.get("dist1") is None),
            "fe_addr_dist2_isna": int(data.get("dist2") is None),
            "fe_addr_addr1_isna": int(data.get("addr1") is None),
            "fe_addr_addr2_isna": int(data.get("addr2") is None),
            "fe_nov_email_both_present": both_emails,
            "fe_nov_email_match": int(both_emails and (p_email == r_email)),
            "fe_nov_email_mismatch": int(both_emails and (p_email != r_email)),
            "fe_inter_amt_x_prod_c": float(amt_log1p * int(prod == "C")),
        }

        # Merge raw features into dictionary
        features.update(data)

        # 3. Vectorized single-pass array creation in exact 492 feature order
        # Default missing columns to np.nan directly without fragmentation
        row_values = {col: features.get(col, np.nan) for col in model_service.feature_order}
        
        return pd.DataFrame([row_values], columns=model_service.feature_order)

preprocessing_service = PreprocessingService()
