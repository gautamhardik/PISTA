"use client";

import Link from "next/link";
import { LivingSignalNetwork } from "@/components/visuals/LivingSignalNetwork";
import { ArrowRight, Sparkles, Shield, Cpu, Activity, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07080a] text-white">
      {/* Living Mathematical Signal Network */}
      <LivingSignalNetwork className="opacity-90" />

      {/* Hero Viewport (Full Screen Breathing Room) */}
      <section className="relative z-10 min-h-[92vh] flex flex-col justify-center px-8 lg:px-24 max-w-5xl mx-auto pt-16 pb-12">
        {/* Brand Kicker with Refined Geometry */}
        <div className="flex items-center gap-3.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#0E1012] border border-white/[0.12] flex items-center justify-center shadow-md">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 3H14C17.3137 3 20 5.68629 20 9C20 12.3137 17.3137 15 14 15H10V21H6V3Z"
                stroke="#C7F36B"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="9" r="1.5" fill="#C7F36B" />
            </svg>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-bold tracking-[0.2em] font-mono text-white">PISTA</span>
            <span className="w-1 h-1 rounded-full bg-[#C7F36B]" />
            <span className="text-[11px] uppercase tracking-[0.22em] font-mono text-zinc-400 font-medium">
              Transaction Intelligence
            </span>
          </div>
        </div>

        {/* Hero Headline: The Iconic Brand Statement */}
        <h1 className="text-5xl sm:text-7xl lg:text-[84px] font-extrabold tracking-[-0.035em] text-white leading-[1.04] mb-8 max-w-4xl font-sans">
          Every transaction leaves clues.
        </h1>

        {/* Hero Description: Crisp, confident, expansive */}
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl font-normal leading-relaxed mb-12">
          PISTA turns payment telemetry into meaningful signals, calibrated risk, and explainable evidence—so you can understand the decision before you act.
        </p>

        {/* Hero Actions: Sharp, localized, expensive material */}
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/analyze"
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-xl bg-[#C7F36B] hover:bg-[#b8e858] text-[#07080a] font-bold text-sm transition-all transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(199,243,107,0.28)] hover:shadow-[0_0_28px_rgba(199,243,107,0.45)] cursor-pointer"
          >
            <span>Analyze a transaction</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/model"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#0E1012] border border-white/[0.1] hover:border-white/[0.22] hover:bg-[#14171A] text-zinc-200 font-medium text-sm transition-all backdrop-blur-xl cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C7F36B]" />
            <span>See how PISTA decides</span>
          </Link>
        </div>
      </section>

      {/* Section 2: The Decision Architecture Pipeline */}
      <section className="relative z-10 px-8 lg:px-24 py-24 max-w-5xl mx-auto border-t border-white/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C7F36B] font-semibold block mb-2">
              From Signal to Decision
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
              Autonomous Intelligence Pipeline
            </h2>
          </div>
          <p className="text-xs font-mono text-zinc-400 max-w-xs">
            Sub-millisecond LightGBM inference across 492 engineered feature dimensions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-[#0E1012] border border-white/[0.08] hover:border-white/[0.18] transition-all">
            <span className="text-[10px] font-mono text-zinc-500 block mb-3 font-semibold">01 / SIGNAL</span>
            <h3 className="text-sm font-bold text-white mb-1.5 font-sans">Feature Engineering</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              492 engineered dimensions spanning monetary behavior, card attributes, identity signals, email domains, and device telemetry.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0E1012] border border-white/[0.08] hover:border-white/[0.18] transition-all">
            <span className="text-[10px] font-mono text-zinc-500 block mb-3 font-semibold">02 / RISK</span>
            <h3 className="text-sm font-bold text-white mb-1.5 font-sans">Calibrated Score</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              LightGBM fraud scoring followed by isotonic calibration to produce calibrated probability estimates.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0E1012] border border-white/[0.08] hover:border-white/[0.18] transition-all">
            <span className="text-[10px] font-mono text-zinc-500 block mb-3 font-semibold">03 / WHY</span>
            <h3 className="text-sm font-bold text-white mb-1.5 font-sans">Model Drivers</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              TreeSHAP feature contributions showing the strongest model-attributed signals behind each decision.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0E1012] border border-white/[0.08] hover:border-white/[0.18] transition-all">
            <span className="text-[10px] font-mono text-zinc-500 block mb-3 font-semibold">04 / DECISION</span>
            <h3 className="text-sm font-bold text-white mb-1.5 font-sans">Policy Action</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Tri-state policy routing: automated APPROVE, manual REVIEW, or automated BLOCK.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Empirical Validation Benchmark */}
      <section className="relative z-10 px-8 lg:px-24 py-20 max-w-5xl mx-auto border-t border-white/[0.06]">
        <div className="flex items-center justify-between mb-8">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 font-medium">
            Empirical Benchmark (118,534 Held-Out Validation Cohort)
          </span>
          <Link href="/analytics" className="text-xs font-mono text-[#C7F36B] hover:underline">
            View full benchmark →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-[#0E1012]/80 border border-white/[0.06]">
            <span className="text-[10px] font-mono uppercase text-zinc-500">PR-AUC (Primary)</span>
            <p className="text-2xl font-bold font-mono text-[#C7F36B] my-1.5">0.5450</p>
            <span className="text-[11px] text-zinc-400">Held-out IEEE-CIS cohort</span>
          </div>

          <div className="p-5 rounded-xl bg-[#0E1012]/80 border border-white/[0.06]">
            <span className="text-[10px] font-mono uppercase text-zinc-500">ROC-AUC</span>
            <p className="text-2xl font-bold font-mono text-white my-1.5">0.9130</p>
            <span className="text-[11px] text-zinc-400">Global discrimination</span>
          </div>

          <div className="p-5 rounded-xl bg-[#0E1012]/80 border border-white/[0.06]">
            <span className="text-[10px] font-mono uppercase text-zinc-500">Inference Latency</span>
            <p className="text-2xl font-bold font-mono text-emerald-400 my-1.5">&lt; 1.0 ms</p>
            <span className="text-[11px] text-zinc-400">Sub-millisecond booster</span>
          </div>

          <div className="p-5 rounded-xl bg-[#0E1012]/80 border border-white/[0.06]">
            <span className="text-[10px] font-mono uppercase text-zinc-500">Feature Dimensions</span>
            <p className="text-2xl font-bold font-mono text-white my-1.5">492</p>
            <span className="text-[11px] text-zinc-400">Causal feature store</span>
          </div>
        </div>
      </section>
    </div>
  );
}
