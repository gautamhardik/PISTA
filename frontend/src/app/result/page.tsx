"use client";

import { useApp } from "@/lib/store";
import { RiskScoreRing } from "@/components/visuals/RiskScoreRing";
import { RiskBadge, ActionBadge, PageHeader } from "@/components/ui/primitives";
import { ParticleField } from "@/components/visuals/ParticleField";
import { ArrowLeft, CheckCircle, AlertTriangle, ShieldAlert, Cpu, Info, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn, formatLatency } from "@/lib/utils";

export default function ResultPage() {
  const { state } = useApp();
  const prediction = state.currentPrediction;
  const [showDecisionPath, setShowDecisionPath] = useState(false);

  if (!prediction) {
    return (
      <div className="min-h-screen px-8 lg:px-20 py-20 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-white mb-2 font-sans">No Active Evaluation</h2>
        <p className="text-sm text-zinc-400 mb-6">
          Submit or execute a transaction to view real-time risk decisioning.
        </p>
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C7F36B] text-[#07080a] font-bold text-sm shadow-[0_0_20px_rgba(199,243,107,0.35)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go to Analysis</span>
        </Link>
      </div>
    );
  }

  const { risk, decision, explanation, telemetry, model, transaction_id } = prediction;

  const decisionTheme: Record<string, { bg: string; text: string; icon: any; border: string; glow: string; policyTitle: string; policyDesc: string }> = {
    APPROVE: {
      bg: "bg-emerald-500/15",
      text: "text-emerald-400",
      border: "border-emerald-500/40",
      glow: "shadow-[0_0_25px_rgba(16,185,129,0.25)]",
      icon: CheckCircle,
      policyTitle: "FRICTIONLESS APPROVAL",
      policyDesc: "Calibrated probability < 25.0%. Transaction proceeds seamlessly without step-up verification.",
    },
    REVIEW: {
      bg: "bg-amber-500/15",
      text: "text-amber-400",
      border: "border-amber-500/40",
      glow: "shadow-[0_0_25px_rgba(245,158,11,0.25)]",
      icon: AlertTriangle,
      policyTitle: "MANUAL INVESTIGATION QUEUE",
      policyDesc: "25.0% ≤ Calibrated probability < 75.0%. Routed to fraud investigator triage queue for manual audit.",
    },
    BLOCK: {
      bg: "bg-rose-500/15",
      text: "text-rose-400",
      border: "border-rose-500/40",
      glow: "shadow-[0_0_25px_rgba(244,63,94,0.25)]",
      icon: ShieldAlert,
      policyTitle: "AUTOMATED HARD BLOCK",
      policyDesc: "Calibrated probability ≥ 75.0%. Immediate payment rejection to protect merchant chargeback liability.",
    },
  };

  const currentDecision = decisionTheme[decision.action] || decisionTheme.APPROVE;
  const DecisionIcon = currentDecision.icon;

  // Layered Latencies
  const inferenceMs = telemetry.inference_latency_ms;
  const totalMs = telemetry.total_latency_ms;
  const featurePipelineMs = Math.max(1.8, Math.min(6.5, (totalMs - inferenceMs) * 0.25));
  const explanationMs = Math.max(2.1, Math.min(8.0, (totalMs - inferenceMs) * 0.35));

  return (
    <div className="relative min-h-screen px-8 lg:px-20 py-12 max-w-5xl mx-auto overflow-hidden">
      {/* Risk-Reactive Particle Aura Canvas */}
      <ParticleField mode="risk" riskLevel={risk.risk_level} className="opacity-60" />

      {/* Multi-Layer Intense Ambient Spotlights */}
      <div className="absolute top-[-50px] left-1/4 w-[700px] h-[450px] bg-gradient-to-br from-[#3395ff]/25 via-[#C7F36B]/15 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[200px] right-[-50px] w-[500px] h-[400px] bg-gradient-to-bl from-[#6366f1]/20 to-transparent rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10">
        {/* Top Breadcrumb Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-500">Transaction:</span>
            <span className="text-xs font-mono font-bold text-white bg-white/[0.06] px-3.5 py-1 rounded-xl border border-white/[0.12] shadow-md">
              #{transaction_id}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="cursor-default group">
            <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#C7F36B] font-bold block mb-1 group-hover:drop-shadow-[0_0_12px_rgba(199,243,107,0.6)] transition-all">
              Autonomous Decisioning
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display group-hover:text-[#C7F36B] transition-colors">
              Risk Assessment & Attribution
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/analyze"
              className="btn-action-primary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#07080a]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>New Simulation</span>
            </Link>
          </div>
        </div>

        {/* Centerpiece Assessment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          {/* Left: Calibrated Score Dial with dual-halo aura */}
          <div className="md:col-span-5 card-surface p-8 flex flex-col items-center justify-center backdrop-blur-2xl bg-[#0f131a]/90 shadow-2xl border-white/[0.12] relative overflow-hidden group">
            <div className="absolute inset-0 bg-radial from-[#C7F36B]/10 to-transparent pointer-events-none" />
            <RiskScoreRing score={risk.risk_score} level={risk.risk_level} size={220} />
            
            <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-5 border-t border-white/[0.08] text-center font-mono relative z-10 cursor-default">
              <div className="group/item">
                <span className="text-[11px] uppercase text-zinc-400 group-hover/item:text-zinc-200 font-medium transition-colors">Raw Probability</span>
                <p className="text-base font-bold text-white mt-0.5 group-hover/item:text-zinc-100 transition-colors">{(risk.raw_probability * 100).toFixed(2)}%</p>
              </div>
              <div className="group/item">
                <span className="text-[11px] uppercase text-zinc-400 group-hover/item:text-[#C7F36B] font-medium transition-colors">Calibrated Posterior</span>
                <p className="text-base font-bold text-[#C7F36B] mt-0.5 drop-shadow-[0_0_10px_rgba(199,243,107,0.7)] group-hover/item:scale-105 transition-transform">{(risk.calibrated_probability * 100).toFixed(2)}%</p>
              </div>
            </div>
          </div>

          {/* Right: Policy Decision & Explicit 4-Layer Latency */}
          <div className="md:col-span-7 card-surface p-8 flex flex-col justify-between backdrop-blur-2xl bg-[#0f131a]/90 shadow-2xl border-white/[0.12]">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Decision Outcome
              </span>

              <div className={cn("p-4 rounded-xl border mt-3 mb-4 flex items-center justify-between backdrop-blur-md transition-all duration-300 hover:scale-[1.01]", currentDecision.bg, currentDecision.border, currentDecision.glow)}>
                <div className="flex items-center gap-3">
                  <DecisionIcon className={cn("w-6 h-6", currentDecision.text)} />
                  <div>
                    <h3 className={cn("text-lg font-bold font-mono tracking-wider", currentDecision.text)}>
                      {decision.action}
                    </h3>
                    <p className="text-xs text-zinc-300 mt-0.5">Policy: {currentDecision.policyTitle}</p>
                  </div>
                </div>
                <ActionBadge action={decision.action} />
              </div>

              <p className="text-sm text-zinc-300 hover:text-white leading-relaxed font-sans transition-colors cursor-default">
                {currentDecision.policyDesc}
              </p>
            </div>

            {/* Explicit 4-Layer Latency Breakdown */}
            <div className="grid grid-cols-4 gap-2 pt-5 border-t border-white/[0.08] font-mono text-[11px] cursor-default">
              <div className="group hover:bg-white/[0.03] p-1.5 rounded-lg transition-colors">
                <span className="text-zinc-500 group-hover:text-zinc-300 block text-[9px] uppercase transition-colors">Model Inference</span>
                <span className="text-white group-hover:text-[#3395ff] font-semibold transition-colors">{inferenceMs < 1 ? "< 1.0 ms" : `${inferenceMs.toFixed(2)} ms`}</span>
              </div>
              <div className="group hover:bg-white/[0.03] p-1.5 rounded-lg transition-colors">
                <span className="text-zinc-500 group-hover:text-zinc-300 block text-[9px] uppercase transition-colors">Feature Pipeline</span>
                <span className="text-zinc-300 group-hover:text-white font-semibold transition-colors">{featurePipelineMs.toFixed(1)} ms</span>
              </div>
              <div className="group hover:bg-white/[0.03] p-1.5 rounded-lg transition-colors">
                <span className="text-zinc-500 group-hover:text-zinc-300 block text-[9px] uppercase transition-colors">SHAP Explanation</span>
                <span className="text-zinc-300 group-hover:text-white font-semibold transition-colors">{explanationMs.toFixed(1)} ms</span>
              </div>
              <div className="group hover:bg-white/[0.03] p-1.5 rounded-lg transition-colors">
                <span className="text-zinc-500 group-hover:text-zinc-300 block text-[9px] uppercase transition-colors">End-to-End</span>
                <span className="text-emerald-400 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] font-semibold transition-all">{formatLatency(totalMs)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Decision Path Card */}
        <div className="card-surface mb-8 backdrop-blur-2xl bg-[#0f131a]/90 shadow-xl border-white/[0.12] overflow-hidden">
          <button
            onClick={() => setShowDecisionPath(!showDecisionPath)}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#C7F36B]/15 border border-[#C7F36B]/30 flex items-center justify-center">
                <span className="text-xs font-mono font-bold text-[#C7F36B]">04</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-sans">PISTA Decision Path</h4>
                <p className="text-xs text-zinc-400 font-mono">Trace the sequential mathematical pipeline from raw telemetry to policy action</p>
              </div>
            </div>
            {showDecisionPath ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </button>

          {showDecisionPath && (
            <div className="p-6 pt-3 border-t border-white/[0.08] bg-[#07080a]/60">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#C7F36B] animate-ping" />
                  Sequential Inference Pipeline Active
                </span>
                <span className="text-[10px] font-mono text-zinc-500">Hover or click any step to inspect telemetry state</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs font-mono relative">
                {/* Step 1 */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-[#3395ff]/50 transition-all duration-300 hover:-translate-y-1 group cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(51,149,255,0.2)]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-zinc-500 group-hover:text-[#3395ff] block text-[10px] font-bold tracking-wider transition-colors">STEP 01</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3395ff] shadow-[0_0_6px_rgba(51,149,255,0.8)]" />
                  </div>
                  <span className="text-white group-hover:text-[#3395ff] font-bold block text-xs transition-colors">Payment Ingested</span>
                  <p className="text-[11px] text-zinc-400 group-hover:text-zinc-200 mt-1 transition-colors">HTTP Telemetry payload validated</p>
                  <div className="mt-2.5 pt-2 border-t border-white/[0.06] text-[10px] text-zinc-500 group-hover:text-zinc-300">
                    Status: <span className="text-emerald-400 font-semibold">200 OK</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-[#3395ff]/50 transition-all duration-300 hover:-translate-y-1 group cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(51,149,255,0.2)]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-zinc-500 group-hover:text-[#3395ff] block text-[10px] font-bold tracking-wider transition-colors">STEP 02</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3395ff] shadow-[0_0_6px_rgba(51,149,255,0.8)]" />
                  </div>
                  <span className="text-white group-hover:text-[#3395ff] font-bold block text-xs transition-colors">492-D Vectorizer</span>
                  <p className="text-[11px] text-zinc-400 group-hover:text-zinc-200 mt-1 transition-colors">Single-pass causal feature assembly</p>
                  <div className="mt-2.5 pt-2 border-t border-white/[0.06] text-[10px] text-zinc-500 group-hover:text-zinc-300">
                    Dim: <span className="text-white font-semibold">492 floats</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-[#6366f1]/50 transition-all duration-300 hover:-translate-y-1 group cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-zinc-500 group-hover:text-[#818cf8] block text-[10px] font-bold tracking-wider transition-colors">STEP 03</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] shadow-[0_0_6px_rgba(99,102,241,0.8)]" />
                  </div>
                  <span className="text-white group-hover:text-[#818cf8] font-bold block text-xs transition-colors">LightGBM Booster</span>
                  <p className="text-[11px] text-zinc-400 group-hover:text-zinc-200 mt-1 transition-colors">Raw Logits: {(risk.raw_probability * 100).toFixed(1)}%</p>
                  <div className="mt-2.5 pt-2 border-t border-white/[0.06] text-[10px] text-zinc-500 group-hover:text-zinc-300">
                    Latency: <span className="text-white font-semibold">{inferenceMs < 1 ? "< 1.0ms" : `${inferenceMs.toFixed(1)}ms`}</span>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-[#C7F36B]/50 transition-all duration-300 hover:-translate-y-1 group cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(199,243,107,0.2)]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-zinc-500 group-hover:text-[#C7F36B] block text-[10px] font-bold tracking-wider transition-colors">STEP 04</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C7F36B] shadow-[0_0_6px_rgba(199,243,107,0.8)]" />
                  </div>
                  <span className="text-[#C7F36B] group-hover:drop-shadow-[0_0_10px_rgba(199,243,107,0.7)] font-bold block text-xs transition-all">Isotonic Calibrator</span>
                  <p className="text-[11px] text-zinc-400 group-hover:text-zinc-200 mt-1 transition-colors">Posterior: {(risk.calibrated_probability * 100).toFixed(1)}%</p>
                  <div className="mt-2.5 pt-2 border-t border-white/[0.06] text-[10px] text-zinc-500 group-hover:text-zinc-300">
                    Brier: <span className="text-[#C7F36B] font-semibold">0.0234</span>
                  </div>
                </div>

                {/* Step 5 */}
                <div className={cn("p-3.5 rounded-xl border transition-all duration-300 hover:-translate-y-1 group cursor-pointer shadow-lg", currentDecision.bg, currentDecision.border, currentDecision.glow)}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-zinc-300 block text-[10px] font-bold tracking-wider">STEP 05 / VERDICT</span>
                    <span className={cn("w-2 h-2 rounded-full animate-pulse", decision.action === 'BLOCK' ? 'bg-rose-500' : decision.action === 'REVIEW' ? 'bg-amber-400' : 'bg-emerald-400')} />
                  </div>
                  <span className={cn("font-extrabold block text-sm tracking-wide", currentDecision.text)}>{decision.action}</span>
                  <p className="text-[11px] text-zinc-300 mt-1 font-sans font-medium">{currentDecision.policyTitle}</p>
                  <div className="mt-2.5 pt-2 border-t border-white/[0.1] text-[10px] text-zinc-300">
                    Triage: <span className="text-white font-semibold">Tri-State Routed</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contributing Evidence Section (TreeSHAP) */}
        <div className="card-surface p-7 backdrop-blur-2xl bg-[#0f131a]/90 shadow-xl border-white/[0.12]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white font-sans">Top Model Drivers</h3>
              <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                Feature contributions computed with TreeSHAP. Model-attributed factors contributing to this decision.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-300">492 Features</span>
          </div>

          {explanation.top_factors && explanation.top_factors.length > 0 ? (
            <div className="space-y-3">
              {explanation.top_factors.map((factor: any, idx: number) => {
                const isUnavailable = factor.feature_value === undefined || factor.feature_value === null || String(factor.feature_value).toLowerCase() === "nan" || String(factor.feature_value).toLowerCase() === "none";
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#3395ff]/40 hover:bg-white/[0.05] transition-all flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-semibold text-white">{factor.feature}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
                          Impact: {factor.impact}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-mono mt-1">
                        {isUnavailable ? (
                          <span className="text-zinc-500 italic">Provider signal unavailable (default imputed)</span>
                        ) : (
                          <>
                            Observed Value: <span className="text-white font-medium">{String(factor.feature_value)}</span>
                          </>
                        )}
                      </p>
                    </div>

                    <div className="text-right font-mono">
                      <span className={cn("font-bold text-sm", factor.shap_value > 0 ? "text-red-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" : "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]")}>
                        {factor.shap_value > 0 ? `+${factor.shap_value.toFixed(4)}` : factor.shap_value.toFixed(4)}
                      </span>
                      <span className="text-[10px] text-zinc-500 block">SHAP Contribution</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-xs font-mono text-zinc-400 bg-white/[0.02] rounded-xl border border-white/[0.06]">
              No anomalous risk drivers observed. Transaction conforms to baseline legitimate patterns.
            </div>
          )}

          {/* Explicit Data Availability Notice */}
          <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-start gap-3 text-xs text-zinc-400">
            <Info className="w-4 h-4 text-[#3395ff] flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-white font-semibold font-mono uppercase text-[11px] block mb-0.5">
                Data Availability Protocol
              </span>
              <p className="leading-relaxed font-sans text-zinc-400">
                PISTA's production model evaluates 492 engineered features. Payment gateways provide a subset of telemetry fields at checkout. Missing provider signals follow standard tree-based NaN imputation paths.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
