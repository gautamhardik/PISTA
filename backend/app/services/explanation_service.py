import pandas as pd
import numpy as np
import shap
from app.services.model_service import model_service
from app.schemas.prediction import Explanation, TopRiskFactor
from app.core.logging import logger

FEATURE_HUMAN_NAMES = {
    'C13': 'Elevated Historical Transaction Velocity (C13 Counter)',
    'card6': 'Card Category Risk Profile (card6)',
    'V258': 'Vesta Real-Time Behavioral Signature (V258 Score)',
    'C14': 'Multi-Day Velocity Accumulator (C14 Counter)',
    'C1': 'Card Frequency Cluster Size (C1 Counter)',
    'TransactionAmt': 'Transaction Dollar Amount Deviation',
    'fe_stat_amt_to_card1_addr1_mean_ratio': 'Relative Spending Ratio vs Card/Address Baseline',
    'fe_stat_amt_to_hist_mean_ratio': 'Relative Spending Ratio vs Entity Baseline',
    'addr1': 'Geographic Region / Zip Billing Consistency',
    'P_emaildomain': 'Purchaser Email Domain Risk Rating'
}

class ExplanationService:
    def __init__(self):
        self.explainer = None

    def initialize(self):
        if model_service.model is not None and self.explainer is None:
            try:
                self.explainer = shap.TreeExplainer(model_service.model)
                logger.info("SHAP TreeExplainer initialized for Champion LightGBM.")
            except Exception as e:
                logger.warning(f"Could not initialize TreeExplainer: {e}")

    def explain_transaction(self, df_features: pd.DataFrame, risk_level: str) -> Explanation:
        """
        Computes ultra-fast local SHAP attributions using LightGBM's native C++
        pred_contrib engine with fallback to TreeExplainer.
        """
        top_factors = []
        summary = f"Transaction evaluated as {risk_level} risk."

        if model_service.model is not None:
            try:
                df_eval = df_features[model_service.feature_order].copy()
                for col in getattr(model_service, "categorical_cols", []):
                    if col in df_eval.columns:
                        df_eval[col] = df_eval[col].astype('category')
                for col in df_eval.select_dtypes(include=['object']).columns:
                    df_eval[col] = df_eval[col].astype('category')

                # 1. Ultra-fast native C++ TreeSHAP contribution (<0.5ms)
                try:
                    contribs = model_service.model.predict(df_eval, pred_contrib=True)
                    if contribs.ndim == 2:
                        sv = contribs[0, :-1] # Exclude baseline offset at index -1
                    else:
                        sv = contribs[:-1]
                except Exception:
                    # Fallback to TreeExplainer
                    self.initialize()
                    if self.explainer is not None:
                        shap_values = self.explainer.shap_values(df_eval)
                        if isinstance(shap_values, list) and len(shap_values) > 1:
                            sv = shap_values[1][0]
                        elif isinstance(shap_values, np.ndarray) and shap_values.ndim == 2:
                            sv = shap_values[0]
                        else:
                            sv = np.zeros(len(model_service.feature_order))
                    else:
                        sv = np.zeros(len(model_service.feature_order))

                top_idx = np.argsort(np.abs(sv))[::-1][:5]
                for idx in top_idx:
                    fname = model_service.feature_order[idx]
                    val = sv[idx]
                    human_desc = FEATURE_HUMAN_NAMES.get(fname, f"Feature {fname}")
                    impact = "HIGH" if abs(val) > 0.3 else ("MEDIUM" if abs(val) > 0.1 else "LOW")
                    obs_val = df_features[fname].iloc[0] if fname in df_features.columns else None
                    top_factors.append(TopRiskFactor(
                        feature=human_desc,
                        impact=impact,
                        shap_value=round(float(val), 4),
                        feature_value=str(obs_val) if obs_val is not None and not (isinstance(obs_val, float) and np.isnan(obs_val)) else "None"
                    ))

                if risk_level in ["HIGH", "CRITICAL"]:
                    summary = f"Transaction flagged as {risk_level} risk due to {top_factors[0].feature}."
                else:
                    summary = "Transaction verified as legitimate with normal behavioral patterns."
            except Exception as e:
                logger.warning(f"SHAP explanation computation bypassed: {e}")

        return Explanation(summary=summary, top_factors=top_factors)

explanation_service = ExplanationService()

