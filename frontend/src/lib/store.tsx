"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode, Dispatch } from "react";
import type { PredictionResponse } from "@/lib/api";

export interface CaseEntry {
  id: string;
  prediction: PredictionResponse;
  status: "open" | "review" | "blocked" | "resolved";
  createdAt: string;
  amount: number;
  productCD: string;
}

interface AppState {
  cases: CaseEntry[];
  activityLog: PredictionResponse[];
  currentPrediction: PredictionResponse | null;
}

type Action =
  | { type: "INIT_STATE"; state: AppState }
  | { type: "SET_PREDICTION"; payload: PredictionResponse }
  | { type: "ADD_PREDICTION"; prediction: PredictionResponse; amount: number; productCD: string }
  | { type: "UPDATE_CASE_STATUS"; id: string; status: CaseEntry["status"] };

const defaultSampleCases: CaseEntry[] = [
  {
    id: "RG-1847",
    prediction: {
      transaction_id: "a8f3b29c",
      model: { name: "PISTA-Tuned-LightGBM-Engine", version: "1.0.0", framework: "LightGBM", role: "PRODUCTION_ACTIVE" },
      risk: { raw_probability: 0.9412, calibrated_probability: 0.9472, risk_score: 94.72, risk_level: "CRITICAL" },
      decision: { decision: "FRAUD", action: "BLOCK", policy_rule: "Calibrated probability >= 0.75 (Automated High-Precision Decline)" },
      explanation: { summary: "Elevated transaction velocity across multiple card proxies", top_factors: [] },
      telemetry: { inference_latency_ms: 0.85, total_latency_ms: 14.2 }
    },
    status: "blocked",
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    amount: 999.99,
    productCD: "C"
  }
];

const initialState: AppState = {
  cases: defaultSampleCases,
  activityLog: defaultSampleCases.map(c => c.prediction),
  currentPrediction: null,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "INIT_STATE":
      return action.state;
    case "SET_PREDICTION":
      return {
        ...state,
        currentPrediction: action.payload,
        activityLog: [action.payload, ...state.activityLog].slice(0, 100),
      };
    case "ADD_PREDICTION": {
      const newCase: CaseEntry = {
        id: `RG-${String(state.cases.length + 1848).padStart(4, "0")}`,
        prediction: action.prediction,
        status:
          action.prediction.decision.action === "BLOCK"
            ? "blocked"
            : action.prediction.decision.action === "REVIEW"
            ? "review"
            : "resolved",
        createdAt: new Date().toISOString(),
        amount: action.amount,
        productCD: action.productCD,
      };
      return {
        ...state,
        currentPrediction: action.prediction,
        cases: [newCase, ...state.cases],
        activityLog: [action.prediction, ...state.activityLog].slice(0, 100),
      };
    }
    case "UPDATE_CASE_STATUS": {
      return {
        ...state,
        cases: state.cases.map((c) =>
          c.id === action.id ? { ...c, status: action.status } : c
        ),
      };
    }
    default:
      return state;
  }
}

const AppContext = createContext<{ state: AppState; dispatch: Dispatch<Action> } | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
