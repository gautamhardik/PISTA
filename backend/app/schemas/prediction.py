from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class TopRiskFactor(BaseModel):
    feature: str = Field(..., description="Feature name or human-readable explanation")
    impact: str = Field(..., description="Impact severity (HIGH, MEDIUM, LOW)")
    shap_value: float = Field(..., description="Raw SHAP attribution value")
    feature_value: Optional[Any] = Field(None, description="Observed value for this feature")

class ModelInfo(BaseModel):
    name: str = Field("RiskGuard Tuned LightGBM Champion", description="Active production model name")
    version: str = Field("1.0.0", description="Model semantic version")
    framework: str = Field("LightGBM", description="Machine learning framework")
    role: str = Field("PRODUCTION_CHAMPION", description="Operational role in decision engine")

class RiskAssessment(BaseModel):
    raw_probability: float = Field(..., description="Uncalibrated booster output probability")
    calibrated_probability: float = Field(..., description="Isotonic calibrated posterior probability")
    risk_score: float = Field(..., description="Calibrated risk score on 0 to 100 integer scale")
    risk_level: str = Field(..., description="LOW, MEDIUM, HIGH, or CRITICAL")

class DecisionAction(BaseModel):
    decision: str = Field(..., description="FRAUD or LEGITIMATE")
    action: str = Field(..., description="APPROVE, REVIEW, or BLOCK")
    policy_rule: str = Field(..., description="Operational routing justification")

class Explanation(BaseModel):
    summary: str = Field(..., description="Natural language risk summary")
    top_factors: List[TopRiskFactor] = Field(default_factory=list, description="Top ranked SHAP risk factors")

class PerformanceTelemetry(BaseModel):
    inference_latency_ms: float = Field(..., description="Sub-millisecond model inference time")
    total_latency_ms: float = Field(..., description="End-to-end request processing time in ms")

class PredictionResponse(BaseModel):
    transaction_id: str = Field(..., description="Transaction identifier or generated trace UUID")
    model: ModelInfo
    risk: RiskAssessment
    decision: DecisionAction
    explanation: Explanation
    telemetry: PerformanceTelemetry
