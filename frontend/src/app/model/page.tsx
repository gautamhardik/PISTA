"use client";

import { PageHeader } from "@/components/ui/primitives";
import { ParticleField } from "@/components/visuals/ParticleField";
import { Cpu, ShieldCheck, CheckCircle2, Layers, GitBranch, Terminal, ShieldAlert, Award } from "lucide-react";

export default function ModelGovernancePage() {
  return (
    <div className="relative min-h-screen px-8 lg:px-20 py-12 max-w-5xl mx-auto overflow-hidden">
      <ParticleField mode="telemetry" className="opacity-35" />

      {/* Ambient background spotlights */}
      <div className="absolute top-0 right-1/3 w-[600px] h-[350px] bg-gradient-to-bl from-[#3395ff]/15 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10">
        <PageHeader
          title="Model Architecture & Governance"
          description="Production champion specifications, mathematical lineage, probability calibration, and champion-challenger benchmarks"
        />

        {/* Model Lineage Architecture Visual Flow */}
        <div className="card-surface p-6 mb-8 backdrop-blur-2xl bg-[#0f131a]/85 border-white/[0.08]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C7F36B] font-bold block mb-4">
            Production Model Lineage
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <span className="text-zinc-500 block text-[10px]">01 / DATASET</span>
              <span className="text-white font-bold block mt-1">IEEE-CIS Fraud</span>
              <span className="text-zinc-400 text-[11px]">590,540 rows</span>
            </div>
            <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <span className="text-zinc-500 block text-[10px]">02 / FEATURES</span>
              <span className="text-white font-bold block mt-1">492 Dimensions</span>
              <span className="text-zinc-400 text-[11px]">Single-pass vector</span>
            </div>
            <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <span className="text-zinc-500 block text-[10px]">03 / MODEL</span>
              <span className="text-white font-bold block mt-1">PISTA LightGBM</span>
              <span className="text-zinc-400 text-[11px]">Champion (v1.0.0)</span>
            </div>
            <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <span className="text-zinc-500 block text-[10px]">04 / CALIBRATION</span>
              <span className="text-[#C7F36B] font-bold block mt-1">Probability Calibration</span>
              <span className="text-zinc-400 text-[11px]">Isotonic Regressor (Brier 0.0234)</span>
            </div>
            <div className="p-3.5 rounded-lg bg-[#C7F36B]/10 border border-[#C7F36B]/30">
              <span className="text-[#C7F36B] block text-[10px]">05 / POLICY</span>
              <span className="text-white font-bold block mt-1">Tri-State Routing</span>
              <span className="text-zinc-300 text-[11px]">Approve / Review / Block</span>
            </div>
          </div>
        </div>

        {/* Champion / Challenger Governance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Active Champion */}
          <div className="card-surface p-6 backdrop-blur-2xl bg-[#0f131a]/85 border-[#C7F36B]/40 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#C7F36B]/15 border border-[#C7F36B]/30 flex items-center justify-center">
                  <Award className="w-4 h-4 text-[#C7F36B]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-sans">PISTA LightGBM Champion</h3>
                  <span className="text-[10px] font-mono text-zinc-400">Calibrated LightGBM production pipeline (v1.0.0)</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#C7F36B] text-[#07080a] font-bold shadow-[0_0_10px_rgba(199,243,107,0.4)]">
                PRODUCTION ACTIVE
              </span>
            </div>

            <p className="text-xs text-zinc-300 mb-5 leading-relaxed font-sans">
              Optimized booster with categorical leaf splits, weighted binary logloss, and integrated Isotonic probability calibrator.
            </p>

            <div className="grid grid-cols-3 gap-2 font-mono text-xs p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <div>
                <span className="text-zinc-500 block text-[10px]">PR-AUC</span>
                <span className="text-[#C7F36B] font-bold">0.5450</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">ROC-AUC</span>
                <span className="text-white font-bold">0.9130</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">Inference</span>
                <span className="text-emerald-400 font-bold">&lt; 1.0 ms</span>
              </div>
            </div>
          </div>

          {/* Challenger Ensemble */}
          <div className="card-surface p-6 backdrop-blur-2xl bg-[#0f131a]/85 border-white/[0.08] shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                  <GitBranch className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-sans">Heterogeneous Blend</h3>
                  <span className="text-[10px] font-mono text-zinc-400">Challenger: LightGBM + XGBoost + CatBoost</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-white/[0.05] text-zinc-400 border border-white/[0.1]">
                BENCHMARKED
              </span>
            </div>

            <p className="text-xs text-zinc-400 mb-5 leading-relaxed font-sans">
              Three-way stacked blend. Retained for governance validation but bypassed for real-time production due to latency trade-offs.
            </p>

            <div className="grid grid-cols-3 gap-2 font-mono text-xs p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <div>
                <span className="text-zinc-500 block text-[10px]">PR-AUC</span>
                <span className="text-white font-bold">0.5413</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">ROC-AUC</span>
                <span className="text-white font-bold">0.9118</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">Inference</span>
                <span className="text-zinc-300 font-bold">4.20 ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operating Policy Thresholds Card */}
        <div className="card-surface p-6 backdrop-blur-2xl bg-[#0f131a]/85 border-white/[0.08]">
          <h3 className="text-sm font-bold text-white font-sans mb-3">Tri-State Policy Routing Matrix</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-emerald-400 font-bold block mb-1">APPROVE (Low Risk)</span>
              <p className="text-zinc-300 text-[11px]">Calibrated probability &lt; 25.0%</p>
              <span className="text-zinc-500 text-[10px] mt-2 block">Frictionless automated clearance</span>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <span className="text-amber-400 font-bold block mb-1">REVIEW (Medium Risk)</span>
              <p className="text-zinc-300 text-[11px]">25.0% ≤ Calibrated probability &lt; 75.0%</p>
              <span className="text-zinc-500 text-[10px] mt-2 block">Manual investigator triage queue</span>
            </div>
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
              <span className="text-rose-400 font-bold block mb-1">BLOCK (Critical Risk)</span>
              <p className="text-zinc-300 text-[11px]">Calibrated probability ≥ 75.0%</p>
              <span className="text-zinc-500 text-[10px] mt-2 block">Instant hard automated rejection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
