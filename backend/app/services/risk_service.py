from app.core.config import settings
from app.schemas.prediction import RiskAssessment, DecisionAction

class RiskService:
    def evaluate_risk(self, raw_prob: float, calibrated_prob: float) -> tuple[RiskAssessment, DecisionAction]:
        """
        Maps calibrated probability to Risk Assessment (0-100 score, risk level)
        and Decision Action (APPROVE, REVIEW, BLOCK) following the policy in Notebooks 4 & 5.
        """
        risk_score = round(calibrated_prob * 100.0, 2)
        
        if calibrated_prob < settings.TAU_REVIEW:
            risk_level = "LOW"
            action = "APPROVE"
            decision = "LEGITIMATE"
            rule = "Calibrated probability < 0.25 (Frictionless Auto-Approval)"
        elif calibrated_prob < settings.TAU_BLOCK:
            risk_level = "HIGH" if calibrated_prob >= 0.50 else "MEDIUM"
            action = "REVIEW"
            decision = "SUSPICIOUS"
            rule = "0.25 <= Calibrated probability < 0.75 (Triage to Analyst Queue)"
        else:
            risk_level = "CRITICAL"
            action = "BLOCK"
            decision = "FRAUD"
            rule = "Calibrated probability >= 0.75 (Automated High-Precision Decline, 87.35% precision)"

        risk = RiskAssessment(
            raw_probability=round(raw_prob, 4),
            calibrated_probability=round(calibrated_prob, 4),
            risk_score=risk_score,
            risk_level=risk_level
        )

        decision_obj = DecisionAction(
            decision=decision,
            action=action,
            policy_rule=rule
        )

        return risk, decision_obj

risk_service = RiskService()
