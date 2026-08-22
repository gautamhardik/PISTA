/**
 * Typed API Client for RiskGuard Backend & Razorpay Test Integration
 */

export interface TransactionInput {
  TransactionAmt: number;
  ProductCD?: string;
  card1?: number;
  card2?: number;
  card3?: number;
  card4?: string;
  card5?: number;
  card6?: string;
  addr1?: number;
  addr2?: number;
  dist1?: number;
  dist2?: number;
  P_emaildomain?: string;
  R_emaildomain?: string;
  DeviceType?: string;
  DeviceInfo?: string;
  additional_features?: Record<string, any>;
}

export interface RiskFactor {
  feature: string;
  shap_value: number;
  impact: "HIGH" | "MEDIUM" | "LOW";
  feature_value?: any;
}

export interface PredictionResponse {
  transaction_id: string;
  model: {
    name: string;
    version: string;
    framework: string;
    role: string;
  };
  risk: {
    raw_probability: number;
    calibrated_probability: number;
    risk_score: number;
    risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  };
  decision: {
    decision: "LEGITIMATE" | "SUSPICIOUS" | "FRAUD";
    action: "APPROVE" | "REVIEW" | "BLOCK";
    policy_rule: string;
  };
  explanation: {
    summary: string;
    top_factors: RiskFactor[];
  };
  telemetry: {
    inference_latency_ms: number;
    total_latency_ms: number;
  };
}

export interface CaseItem {
  id: string;
  transaction_id: string;
  razorpay_payment_id?: string;
  amount: number;
  risk_score: number;
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  decision: string;
  action: "APPROVE" | "REVIEW" | "BLOCK";
  status: "open" | "review" | "blocked" | "resolved";
  resolution?: string;
  investigator_note?: string;
  resolved_at?: string;
  created_at: string;
}

export interface ActivityItem {
  transaction_id: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  risk: {
    raw_probability: number;
    calibrated_probability: number;
    risk_score: number;
    risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  };
  decision: {
    decision: string;
    action: "APPROVE" | "REVIEW" | "BLOCK";
    policy_rule: string;
  };
  explanation: {
    summary: string;
    top_factors: RiskFactor[];
  };
  telemetry: {
    inference_latency_ms: number;
    total_latency_ms: number;
  };
  model: {
    name: string;
    version: string;
  };
  created_at: string;
}

export interface RazorpayOrderResponse {
  order_id: string;
  key_id: string;
  amount_paise: number;
  amount_inr: number;
  currency: string;
  receipt: string;
}

export interface AnalyticsSummaryResponse {
  status: string;
  total_validation_traffic: number;
  total_frauds_identified: number;
  queues: Array<{
    risk_band: string;
    tx_volume: number;
    traffic_share_pct: number;
    fraud_count: number;
    empirical_fraud_rate_pct: number;
    fraud_capture_share_pct: number;
    total_dollar_volume: number;
  }>;
}

export interface LiveAnalyticsResponse {
  status: string;
  today_transactions: number;
  today_approved: number;
  today_review: number;
  today_blocked: number;
  total_cases: number;
  avg_risk_score: number;
  avg_latency_ms: number;
}

export interface ModelMetadataResponse {
  champion: {
    model_name: string;
    model_version: string;
    framework: string;
    total_features: number;
    validation_metrics: Record<string, number>;
    challenger_metrics: Record<string, any>;
    decision_policy: Record<string, any>;
    status: string;
  };
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
}

export interface ReadinessResponse {
  status: string;
  model_loaded: boolean;
  feature_count: number;
  calibrator_loaded: boolean;
  champion_model: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`API error ${res.status}: ${errorBody}`);
  }

  return res.json();
}

export const api = {
  predict: (input: TransactionInput) =>
    request<PredictionResponse>("/api/v1/predict", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  createRazorpayOrder: (amountInr: number) =>
    request<RazorpayOrderResponse>("/api/v1/payments/razorpay/order", {
      method: "POST",
      body: JSON.stringify({ amount_inr: amountInr }),
    }),

  verifyRazorpayPayment: (params: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    customer_metadata?: Record<string, any>;
  }) =>
    request<PredictionResponse>("/api/v1/payments/razorpay/verify", {
      method: "POST",
      body: JSON.stringify(params),
    }),

  cases: () => request<CaseItem[]>("/api/v1/cases"),
  caseAudit: (caseId: string) => request<Array<{
    id: number;
    case_id: string;
    event_type: string;
    previous_status?: string;
    new_status?: string;
    actor: string;
    reason?: string;
    note?: string;
    created_at: string;
  }>>(`/api/v1/cases/${caseId}/audit`),

  updateCaseStatus: (caseId: string, status: string, resolution?: string, note?: string) =>
    request<{ status: string; case_id: string; new_status: string }>(`/api/v1/cases/${caseId}/status`, {
      method: "PATCH",
      body: JSON.stringify({
        status,
        resolution,
        investigator_note: note,
      }),
    }),

  activity: () => request<ActivityItem[]>("/api/v1/activity"),

  model: () => request<ModelMetadataResponse>("/api/v1/model"),
  analytics: () => request<AnalyticsSummaryResponse>("/api/v1/analytics/summary"),
  liveAnalytics: (timeframe: string = "today") => request<LiveAnalyticsResponse & { p95_latency_ms: number; mean_latency_ms: number }>(`/api/v1/analytics/live?timeframe=${timeframe}`),
  health: () => request<HealthResponse>("/health"),
  readiness: () => request<ReadinessResponse>("/api/v1/health"),
};
