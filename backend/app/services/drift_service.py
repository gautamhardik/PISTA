import numpy as np
from typing import Dict, List, Any

# Decision-band edges on the calibrated probability scale. They mirror the
# routing policy in risk_service (LOW < 0.25 <= MEDIUM < 0.50 <= HIGH < 0.75 <= CRITICAL).
RISK_BAND_EDGES = [0.0, 0.25, 0.50, 0.75, 1.0]
RISK_BAND_LABELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

# Baseline share of traffic per band, taken from the 118,534-transaction held-out
# validation cohort (output/reports/risk_band_operational_summary.csv, traffic_share_pct).
BASELINE_BAND_SHARE = [0.945012, 0.038706, 0.005146, 0.011136]

# PSI on fewer samples than this is statistically meaningless, so we refuse to report one.
MIN_SAMPLES_FOR_PSI = 30


class ModelDriftObservabilityService:
    """
    Population Stability Index (PSI) monitoring of the live calibrated-score distribution
    against the validation cohort, binned on the same bands the decision policy uses.
    """
    def __init__(self):
        self.bin_edges = RISK_BAND_EDGES
        self.baseline_risk_bins = np.array(BASELINE_BAND_SHARE) / np.sum(BASELINE_BAND_SHARE)

    def calculate_psi(self, live_scores: List[float]) -> Dict[str, Any]:
        """
        Calculates Population Stability Index (PSI) on live risk scores (0-100 scale):
        PSI = sum((Actual% - Expected%) * ln(Actual% / Expected%))
        Thresholds:
        - PSI < 0.10: Stable (No Drift)
        - 0.10 <= PSI < 0.25: Moderate Shift (Monitor closely)
        - PSI >= 0.25: Significant Drift (Trigger automated recalibration)
        """
        sample_count = len(live_scores) if live_scores else 0
        if sample_count < MIN_SAMPLES_FOR_PSI:
            return {
                "psi_score": None,
                "status": "INSUFFICIENT_DATA",
                "drift_detected": False,
                "recommendation": (
                    f"Only {sample_count} scored transactions recorded; "
                    f"PSI needs at least {MIN_SAMPLES_FOR_PSI}."
                ),
                "sample_count": sample_count,
                "min_samples": MIN_SAMPLES_FOR_PSI,
            }

        scores_arr = np.clip(np.array(live_scores, dtype=float) / 100.0, 0.0, 1.0)
        actual_counts, _ = np.histogram(scores_arr, bins=self.bin_edges)
        actual_pct = (actual_counts + 1e-4) / np.sum(actual_counts + 1e-4)
        expected_pct = self.baseline_risk_bins

        # Standard PSI formula
        psi_val = np.sum((actual_pct - expected_pct) * np.log(actual_pct / expected_pct))
        psi_val = max(0.0, round(float(psi_val), 4))

        if psi_val < 0.10:
            status = "STABLE"
            drift_detected = False
            rec = "Model posterior distribution is healthy and stable (PSI < 0.10)."
        elif psi_val < 0.25:
            status = "MODERATE_SHIFT"
            drift_detected = False
            rec = "Moderate distribution drift detected (0.10 <= PSI < 0.25). Monitor incoming traffic."
        else:
            status = "SIGNIFICANT_DRIFT"
            drift_detected = True
            rec = "Severe distribution drift detected (PSI >= 0.25). Champion recalibration recommended."

        return {
            "psi_score": psi_val,
            "status": status,
            "drift_detected": drift_detected,
            "recommendation": rec,
            "sample_count": sample_count,
            "distribution_bins": {
                "bin_edges": self.bin_edges,
                "labels": RISK_BAND_LABELS,
                "actual_distribution": [round(float(x), 4) for x in actual_pct],
                "baseline_distribution": [round(float(x), 4) for x in expected_pct]
            }
        }

drift_service = ModelDriftObservabilityService()
