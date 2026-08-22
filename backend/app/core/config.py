import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "RiskGuard Production Fraud Decision API"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Base directories (backend/app/core -> backend)
    APP_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    BASE_DIR: str = os.path.dirname(APP_DIR)
    ARTIFACTS_DIR: str = os.path.join(BASE_DIR, "artifacts")
    CHAMPION_DIR: str = os.path.join(ARTIFACTS_DIR, "champion")
    CHALLENGER_DIR: str = os.path.join(ARTIFACTS_DIR, "challenger")
    
    # Model Artifact Paths
    MODEL_PATH: str = os.path.join(CHAMPION_DIR, "model.joblib")
    FEATURE_SCHEMA_PATH: str = os.path.join(CHAMPION_DIR, "feature_schema.json")
    CALIBRATOR_PATH: str = os.path.join(CHAMPION_DIR, "calibrator.joblib")
    METADATA_PATH: str = os.path.join(CHAMPION_DIR, "metadata.json")
    CHALLENGER_BUNDLE_PATH: str = os.path.join(CHALLENGER_DIR, "ensemble_bundle.joblib")
    
    # Operational Thresholds (Locked from Notebook 4 & 5)
    TAU_REVIEW: float = 0.25
    TAU_BLOCK: float = 0.75
    
    # Razorpay Test Mode Credentials
    RAZORPAY_KEY_ID: str = "rzp_test_TShUcPwAvvFwoz"
    RAZORPAY_KEY_SECRET: str = "JrJZ6NqeH9QvysbWxVoTjxGi"
    RAZORPAY_WEBHOOK_SECRET: str = "rzp_webhook_secret_riskguard_2026"
    
    # Database
    DATABASE_URL: str = "sqlite:///./riskguard_production.db"

    model_config = SettingsConfigDict(
        env_file=os.path.join(BASE_DIR, ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
