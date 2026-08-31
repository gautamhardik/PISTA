"use client";

import { useState } from "react";
import { ParticleField } from "@/components/visuals/ParticleField";
import {
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Layers,
  GitBranch,
  Terminal,
  ShieldAlert,
  Award,
  Sliders,
  Sparkles,
  TrendingDown,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ModelGovernancePage() {
  const [tauReview, setTauReview] = useState<number>(0.25);
  const [tauBlock, setTauBlock] = useState<number>(0.75);

  // Dynamic simulation estimates based on empirical 118,534 validation cohort
  const approveRate = (Math.max(70.0, Math.min(96.5, 75.0 + (tauReview - 0.05) * 45.0))).toFixed(1);
  const blockRate = (Math.max(1.5, Math.min(8.5, 2.0 + (1.0 - tauBlock) * 12.0))).toFixed(1);
  const reviewRate = Math.max(1.0, (100 - parseFloat(approveRate) - parseFloat(blockRate))).toFixed(1);
  const fraudCatchRate = (Math.max(82.0, Math.min(99.4, 91.5 + (0.35 - tauReview) * 20.0))).toFixed(1);

  const resetThresholds = () => {
    setTauReview(0.25);
    setTauBlock(0.75);
  };

  return (
    <div className="relative min-h-screen px-6 lg:px-16 py-10 max-w-6xl mx-auto overflow-hidden">
      <ParticleField mode="telemetry" className="opacity-35" />

      {/* Atmospheric dynamic gradient spotlights */}
      <div className="absolute top-0 right-1/3 w-[600px] h-[350px] bg-gradient-to-bl from-[#3395ff]/15 via-[#6366f1]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="cursor-default group">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#3395ff]/15 text-[#3395ff] border border-[#3395ff]/30 font-bold uppercase tracking-wider group-hover:bg-[#3395ff]/25 group-hover:shadow-[0_0_12px_rgba(51,149,255,0.35)] transition-all">
                Model Governance & Spec
              </span>
              <span className="text-xs font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors">• LightGBM Risk Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display group-hover:text-[#C7F36B] transition-colors">
              Model Architecture & Governance
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="px-3 py-2 rounded-xl text-xs font-mono uppercase bg-[#C7F36B]/10 border border-[#C7F36B]/30 text-[#C7F36B] font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(199,243,107,0.15)] hover:bg-[#C7F36B]/20 hover:scale-105 transition-all cursor-default">
              <Award className="w-3.5 h-3.5" />
              PRODUCTION ACTIVE
            </span>
          </div>
        </div>

        {/* Model Lineage Architecture Visual Flow */}
        <div className="card-surface p-6 backdrop-blur-2xl bg-[#0f131a]/85 border-white/[0.08]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C7F36B] font-bold block mb-4">
            Production Model Lineage Pipeline
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#3395ff]/30 hover:-translate-y-0.5 transition-all group cursor-default">
              <span className="text-zinc-500 group-hover:text-zinc-300 block text-[10px] font-semibold transition-colors">01 / DATASET</span>
              <span className="text-white group-hover:text-[#3395ff] font-bold block mt-1 font-heading text-sm transition-colors">IEEE-CIS Fraud</span>
              <span className="text-zinc-400 group-hover:text-zinc-200 text-[11px] transition-colors">590,540 rows</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#3395ff]/30 hover:-translate-y-0.5 transition-all group cursor-default">
              <span className="text-zinc-500 group-hover:text-zinc-300 block text-[10px] font-semibold transition-colors">02 / FEATURES</span>
              <span className="text-white group-hover:text-[#3395ff] font-bold block mt-1 font-heading text-sm transition-colors">492 Dimensions</span>
              <span className="text-zinc-400 group-hover:text-zinc-200 text-[11px] transition-colors">Single-pass vector</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#3395ff]/30 hover:-translate-y-0.5 transition-all group cursor-default">
              <span className="text-zinc-500 group-hover:text-zinc-300 block text-[10px] font-semibold transition-colors">03 / BOOSTER</span>
              <span className="text-white group-hover:text-[#3395ff] font-bold block mt-1 font-heading text-sm transition-colors">PISTA LightGBM</span>
              <span className="text-zinc-400 group-hover:text-zinc-200 text-[11px] transition-colors">Active Model</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#C7F36B]/30 hover:-translate-y-0.5 transition-all group cursor-default">
              <span className="text-[#C7F36B] block text-[10px] font-semibold">04 / CALIBRATION</span>
              <span className="text-[#C7F36B] group-hover:drop-shadow-[0_0_10px_rgba(199,243,107,0.7)] font-bold block mt-1 font-heading text-sm transition-all">Isotonic Mapping</span>
              <span className="text-zinc-400 group-hover:text-zinc-200 text-[11px] transition-colors">Brier Score: 0.0234</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#C7F36B]/10 border border-[#C7F36B]/30 hover:scale-[1.02] transition-all cursor-default">
              <span className="text-[#C7F36B] block text-[10px] font-semibold">05 / DECISIONING</span>
              <span className="text-white font-bold block mt-1 font-heading text-sm">Tri-State Routing</span>
              <span className="text-zinc-300 text-[11px]">Frictionless Triage</span>
            </div>
          </div>
        </div>

        {/* Interactive Operating Policy Simulator Workbench */}
        <div className="card-surface p-6 backdrop-blur-2xl border-[#3395ff]/30 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.06]">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#3395ff]" />
                <h2 className="text-base font-bold text-white font-heading">
                  Interactive Policy Threshold Studio
                </h2>
              </div>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Simulate real-time operational trade-offs between automated pass-through and manual triage load.
              </p>
            </div>

            <button
              onClick={resetThresholds}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-zinc-300 hover:text-white border border-white/[0.08] transition-all flex items-center gap-1.5 self-start cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
            {/* Sliders */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-emerald-400 font-bold">Review Threshold (τ_review)</span>
                  <span className="text-white font-bold bg-white/[0.06] px-2 py-0.5 rounded">
                    {(tauReview * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.50"
                  step="0.01"
                  value={tauReview}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setTauReview(val);
                    if (val >= tauBlock) setTauBlock(val + 0.05);
                  }}
                  className="w-full accent-[#10b981] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                  <span>5% (Aggressive Review)</span>
                  <span>50% (High Pass-Through)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-rose-400 font-bold">Block Threshold (τ_block)</span>
                  <span className="text-white font-bold bg-white/[0.06] px-2 py-0.5 rounded">
                    {(tauBlock * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.50"
                  max="0.95"
                  step="0.01"
                  value={tauBlock}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setTauBlock(val);
                    if (val <= tauReview) setTauReview(val - 0.05);
                  }}
                  className="w-full accent-[#f43f5e] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                  <span>50% (Strict Hard Rejection)</span>
                  <span>95% (Lenient Block)</span>
                </div>
              </div>
            </div>

            {/* Simulated Live Distribution Output */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col justify-between">
                <span className="text-zinc-400 text-[10px] uppercase font-bold">Frictionless Approval</span>
                <p className="text-2xl font-bold text-emerald-400 my-1 font-mono">{approveRate}%</p>
                <span className="text-[10px] text-zinc-400 font-sans">Zero merchant friction</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex flex-col justify-between">
                <span className="text-zinc-400 text-[10px] uppercase font-bold">Manual Triage Load</span>
                <p className="text-2xl font-bold text-amber-400 my-1 font-mono">{reviewRate}%</p>
                <span className="text-[10px] text-zinc-400 font-sans">Routed to investigators</span>
              </div>

              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 flex flex-col justify-between">
                <span className="text-zinc-400 text-[10px] uppercase font-bold">Hard Automated Block</span>
                <p className="text-2xl font-bold text-rose-400 my-1 font-mono">{blockRate}%</p>
                <span className="text-[10px] text-zinc-400 font-sans">Instant rejection</span>
              </div>

              <div className="p-4 rounded-xl bg-[#3395ff]/10 border border-[#3395ff]/25 flex flex-col justify-between">
                <span className="text-zinc-400 text-[10px] uppercase font-bold">Expected Fraud Catch</span>
                <p className="text-2xl font-bold text-[#3395ff] my-1 font-mono">{fraudCatchRate}%</p>
                <span className="text-[10px] text-zinc-400 font-sans">Chargeback suppression</span>
              </div>
            </div>
          </div>
        </div>

        {/* Champion vs Challenger Benchmarks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Champion */}
          <div className="card-surface p-6 backdrop-blur-2xl bg-[#0f131a]/85 border-[#C7F36B]/40 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#C7F36B]/15 border border-[#C7F36B]/30 flex items-center justify-center">
                  <Award className="w-4 h-4 text-[#C7F36B]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-heading">PISTA LightGBM Risk Engine</h3>
                  <span className="text-[10px] font-mono text-zinc-400">Calibrated LightGBM GBDT pipeline (v1.0.0)</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#C7F36B] text-[#07080a] font-bold shadow-[0_0_12px_rgba(199,243,107,0.4)]">
                PRODUCTION ACTIVE
              </span>
            </div>

            <p className="text-xs text-zinc-300 mb-5 leading-relaxed font-sans">
              Optimized gradient booster with leaf-wise tree growth, balanced logloss, and integrated Isotonic probability calibrator.
            </p>

            <div className="grid grid-cols-3 gap-2 font-mono text-xs p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div>
                <span className="text-zinc-500 block text-[10px]">PR-AUC</span>
                <span className="text-[#C7F36B] font-bold text-sm">0.5450</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">ROC-AUC</span>
                <span className="text-white font-bold text-sm">0.9130</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">Inference</span>
                <span className="text-emerald-400 font-bold text-sm">&lt; 1.0 ms</span>
              </div>
            </div>
          </div>

          {/* Challenger Ensemble */}
          <div className="card-surface p-6 backdrop-blur-2xl bg-[#0f131a]/85 border-white/[0.08] shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                  <GitBranch className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-heading">Heterogeneous Tri-Blend</h3>
                  <span className="text-[10px] font-mono text-zinc-400">Challenger: LightGBM + XGBoost + CatBoost</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-white/[0.05] text-zinc-400 border border-white/[0.1]">
                BENCHMARKED
              </span>
            </div>

            <p className="text-xs text-zinc-400 mb-5 leading-relaxed font-sans">
              Three-way stacked blend. Retained for governance validation but bypassed for live transactions due to higher latency overhead.
            </p>

            <div className="grid grid-cols-3 gap-2 font-mono text-xs p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div>
                <span className="text-zinc-500 block text-[10px]">PR-AUC</span>
                <span className="text-white font-bold text-sm">0.5482</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">ROC-AUC</span>
                <span className="text-white font-bold text-sm">0.9142</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">Inference</span>
                <span className="text-amber-400 font-bold text-sm">4.20 ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
