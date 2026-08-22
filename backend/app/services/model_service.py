import os, json, joblib
import pandas as pd
import numpy as np
from app.core.config import settings
from app.core.logging import logger

class ModelService:
    def __init__(self):
        self.model = None
        self.calibrator = None
        self.challenger_bundle = None
        self.feature_schema = None
        self.feature_order = []
        self.metadata = {}
        self.is_ready = False

    def load_artifacts(self):
        try:
            logger.info("Loading RiskGuard Champion & Challenger artifacts...")
            
            # 1. Load Champion Model
            if os.path.exists(settings.MODEL_PATH):
                self.model = joblib.load(settings.MODEL_PATH)
                logger.info(f"Loaded Champion Model from {settings.MODEL_PATH}")
            else:
                raise FileNotFoundError(f"Champion model not found at {settings.MODEL_PATH}")

            # 2. Load Feature Schema
            if os.path.exists(settings.FEATURE_SCHEMA_PATH):
                with open(settings.FEATURE_SCHEMA_PATH, "r", encoding="utf-8") as f:
                    self.feature_schema = json.load(f)
                    self.feature_order = self.feature_schema.get("feature_order", [])
                logger.info(f"Loaded {len(self.feature_order)} feature schema definitions.")

            # 3. Load Calibrator
            if os.path.exists(settings.CALIBRATOR_PATH):
                self.calibrator = joblib.load(settings.CALIBRATOR_PATH)
                logger.info(f"Loaded Isotonic Calibrator from {settings.CALIBRATOR_PATH}")

            # 4. Load Metadata
            if os.path.exists(settings.METADATA_PATH):
                with open(settings.METADATA_PATH, "r", encoding="utf-8") as f:
                    self.metadata = json.load(f)
                logger.info(f"Loaded Model Metadata: {self.metadata.get('model_name')}")

            # 5. Load Challenger (Optional / Lazy)
            if os.path.exists(settings.CHALLENGER_BUNDLE_PATH):
                self.challenger_bundle = joblib.load(settings.CHALLENGER_BUNDLE_PATH)
                logger.info("Loaded Challenger Ensemble Bundle.")

            self.is_ready = True
            logger.info("RiskGuard ModelService is fully initialized and READY.")
        except Exception as e:
            logger.error(f"Failed to load RiskGuard model artifacts: {str(e)}")
            self.is_ready = False
            raise e

    def predict_raw(self, df_features: pd.DataFrame) -> float:
        """Run sub-millisecond booster inference on aligned feature dataframe."""
        if not self.is_ready or self.model is None:
            raise RuntimeError("ModelService is not ready to serve predictions.")
        
        # Ensure category dtypes
        df_eval = df_features[self.feature_order].copy()
        for col in df_eval.select_dtypes(include=['object']).columns:
            df_eval[col] = df_eval[col].astype('category')
            
        preds = self.model.predict(df_eval, num_iteration=self.model.best_iteration)
        return float(preds[0])

    def calibrate_probability(self, raw_prob: float) -> float:
        """Pass raw model score through fitted Isotonic Calibrator."""
        if self.calibrator is not None:
            try:
                calibrated = self.calibrator.predict(np.array([raw_prob]))[0]
                return float(np.clip(calibrated, 0.0, 1.0))
            except Exception:
                pass
        return raw_prob

model_service = ModelService()
