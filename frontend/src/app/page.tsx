"use client";

import Link from "next/link";
import { LivingSignalNetwork } from "@/components/visuals/LivingSignalNetwork";
import { PistaLogo, PistaMonolithEmblem } from "@/components/ui/PistaLogo";
import { ArrowRight, Sparkles, Shield, Cpu, Activity, BarChart3, Zap, Terminal, Layers, ArrowUpRight, Play } from "lucide-react";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [pulseCount, setPulseCount] = useState(118534);
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07080a] text-white">
      {/* Living Mathematical Signal Network with Enhanced Interactive Flow */}
      <LivingSignalNetwork className="opacity-90" />

      {/* Atmospheric dynamic gradient spotlights */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-gradient-to-br from-[#3395ff]/15 via-[#6366f1]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[450px] h-[450px] bg-gradient-to-tl from-[#C7F36B]/12 via-emerald-500/08 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Viewport: Pure Unboxed Brand Centerpiece on the Left */}
      <section className="relative z-10 min-h-[88vh] flex flex-col justify-center px-8 lg:px-20 max-w-5xl mx-auto pt-14 pb-12">
        
        {/* Top Brand Identity Block: Official Cormorant Garamond Luxury Wordmark + Standalone Unboxed Logo */}
        <div className="flex items-center gap-7 mb-10 pb-6 border-b border-white/[0.06] group cursor-default">
          <PistaLogo size={105} glow interactive className="drop-shadow-[0_0_36px_rgba(199,243,107,0.4)] flex-shrink-0 group-hover:scale-105 transition-transform duration-300" />
          
          <div className="flex flex-col justify-center gap-1.5">
            <div className="flex items-center gap-4">
              <span className="text-5xl sm:text-6xl lg:text-7xl text-white leading-none font-cormorant italic font-bold tracking-[0.12em] select-none transition-all duration-300 group-hover:text-[#C7F36B] group-hover:drop-shadow-[0_0_24px_rgba(199,243,107,0.5)]">
                PISTA
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#C7F36B]/15 text-[#C7F36B] border border-[#C7F36B]/35 tracking-widest uppercase shadow-[0_0_12px_rgba(199,243,107,0.15)] transition-all duration-200 group-hover:bg-[#C7F36B]/25 group-hover:shadow-[0_0_20px_rgba(199,243,107,0.4)]">
                ORIGIN
              </span>
            </div>
            <span className="text-xs sm:text-sm font-mono text-zinc-400 group-hover:text-zinc-200 uppercase tracking-[0.24em] font-semibold transition-colors duration-200">
              Payment Intelligence & Security Telemetry Architecture
            </span>
          </div>
        </div>

        {/* Live Telemetry Pill */}
        <div className="flex items-center gap-3 mb-8 cursor-default group">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3395ff]/10 border border-[#3395ff]/25 text-[#3395ff] text-[11px] font-mono font-semibold backdrop-blur-md transition-all duration-300 group-hover:bg-[#3395ff]/20 group-hover:border-[#3395ff]/50 group-hover:shadow-[0_0_16px_rgba(51,149,255,0.3)]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#3395ff] animate-ping" />
            <span>Telemetry Active: {pulseCount.toLocaleString()} events</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-300 uppercase tracking-widest transition-colors">
            • IEEE-CIS Calibrated
          </span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-[76px] font-extrabold tracking-[-0.035em] text-white leading-[1.06] mb-6 font-heading select-none">
          <span className="transition-all duration-300 hover:text-[#C7F36B] hover:drop-shadow-[0_0_28px_rgba(199,243,107,0.55)] cursor-default inline-block">
            Every transaction
          </span>{" "}
          <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 hover-gradient-expand cursor-default">
            leaves clues.
          </span>
        </h1>

        {/* Hero Description */}
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl font-sans leading-relaxed mb-10 transition-all duration-300 hover:text-zinc-100 hover:translate-x-1 cursor-default">
          PISTA turns payment telemetry into real-time signals, calibrated risk scores, and explainable TreeSHAP attributions—delivering instant autonomous decisions with zero friction.
        </p>

        {/* Hero Actions */}
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/analyze"
            className="btn-action-primary inline-flex items-center gap-3 px-8 py-4 rounded-xl text-[#07080a] font-bold text-sm cursor-pointer group"
          >
            <span>Launch Live Analyzer</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

          <Link
            href="/activity"
            className="inline-flex items-center gap-2.5 px-6 py-4 rounded-xl bg-[#0E1217] border border-white/[0.1] hover:border-[#3395ff]/40 hover:bg-[#131922] text-zinc-200 font-medium text-sm transition-all backdrop-blur-xl group cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(51,149,255,0.2)]"
          >
            <Activity className="w-4 h-4 text-[#3395ff] transition-transform group-hover:scale-110" />
            <span>Live Stream Feed</span>
          </Link>

          <Link
            href="/cases"
            className="inline-flex items-center gap-2 px-5 py-4 rounded-xl bg-transparent border border-white/[0.08] hover:border-white/[0.2] text-zinc-400 hover:text-white font-medium text-sm transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>Investigation Studio</span>
          </Link>
        </div>
      </section>

      {/* Section 2: Interactive Decision Architecture Workbench */}
      <section className="relative z-10 px-8 lg:px-20 py-20 max-w-6xl mx-auto border-t border-white/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="cursor-default group">
            <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#C7F36B] font-semibold block mb-2 transition-all group-hover:drop-shadow-[0_0_12px_rgba(199,243,107,0.5)]">
              Autonomous Intelligence Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display transition-colors group-hover:text-zinc-100">
              From Signal to Instant Verdict
            </h2>
          </div>
          <p className="text-xs font-mono text-zinc-400 hover:text-zinc-200 max-w-xs leading-relaxed transition-colors cursor-default">
            Sub-millisecond LightGBM scoring across 492 engineered feature dimensions with explainable TreeSHAP drivers.
          </p>
        </div>

        {/* 4 Interactive Kinetic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onMouseEnter={() => setActiveTab(0)}
            className="card-surface p-6 cursor-pointer group hover:border-[#C7F36B]/40 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-lg bg-[#C7F36B]/10 border border-[#C7F36B]/25 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#C7F36B]/20 transition-all">
              <Zap className="w-4 h-4 text-[#C7F36B]" />
            </div>
            <span className="text-[10px] font-mono text-zinc-500 group-hover:text-[#C7F36B] block mb-2 font-semibold tracking-wider transition-colors">01 / TELEMETRY</span>
            <h3 className="text-base font-bold text-white group-hover:text-[#C7F36B] mb-2 font-heading transition-colors">492 Features</h3>
            <p className="text-xs text-zinc-400 group-hover:text-zinc-200 leading-relaxed font-sans transition-colors">
              Monetary behavior, card attributes, identity match signals, email risk, and hardware fingerprinting.
            </p>
          </div>

          <div 
            onMouseEnter={() => setActiveTab(1)}
            className="card-surface p-6 cursor-pointer group hover:border-[#3395ff]/40 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-lg bg-[#3395ff]/10 border border-[#3395ff]/25 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#3395ff]/20 transition-all">
              <Cpu className="w-4 h-4 text-[#3395ff]" />
            </div>
            <span className="text-[10px] font-mono text-zinc-500 group-hover:text-[#3395ff] block mb-2 font-semibold tracking-wider transition-colors">02 / INFERENCE</span>
            <h3 className="text-base font-bold text-white group-hover:text-[#3395ff] mb-2 font-heading transition-colors">Calibrated Risk</h3>
            <p className="text-xs text-zinc-400 group-hover:text-zinc-200 leading-relaxed font-sans transition-colors">
              LightGBM booster evaluated at sub-millisecond speeds followed by isotonic probability calibration.
            </p>
          </div>

          <div 
            onMouseEnter={() => setActiveTab(2)}
            className="card-surface p-6 cursor-pointer group hover:border-[#6366f1]/40 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-lg bg-[#6366f1]/10 border border-[#6366f1]/25 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#6366f1]/20 transition-all">
              <Sparkles className="w-4 h-4 text-[#6366f1]" />
            </div>
            <span className="text-[10px] font-mono text-zinc-500 group-hover:text-[#818cf8] block mb-2 font-semibold tracking-wider transition-colors">03 / EXPLAINABILITY</span>
            <h3 className="text-base font-bold text-white group-hover:text-[#818cf8] mb-2 font-heading transition-colors">TreeSHAP Drivers</h3>
            <p className="text-xs text-zinc-400 group-hover:text-zinc-200 leading-relaxed font-sans transition-colors">
              Exact feature contribution vectors detailing why a payment was deemed safe, suspicious, or fraudulent.
            </p>
          </div>

          <div 
            onMouseEnter={() => setActiveTab(3)}
            className="card-surface p-6 cursor-pointer group hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[10px] font-mono text-zinc-500 group-hover:text-emerald-400 block mb-2 font-semibold tracking-wider transition-colors">04 / POLICY</span>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 mb-2 font-heading transition-colors">Tri-State Routing</h3>
            <p className="text-xs text-zinc-400 group-hover:text-zinc-200 leading-relaxed font-sans transition-colors">
              Autonomous tri-state policy: Frictionless APPROVE, Investigator REVIEW triage, or automated BLOCK.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Empirical Validation Benchmark & Live App Metrics */}
      <section className="relative z-10 px-8 lg:px-20 py-20 max-w-6xl mx-auto border-t border-white/[0.06]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 cursor-default group">
            <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-400 group-hover:text-white font-semibold transition-colors">
              Empirical Benchmark (118,534 Held-Out Validation Cohort)
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#C7F36B]/15 text-[#C7F36B] border border-[#C7F36B]/30 font-bold group-hover:bg-[#C7F36B]/30 group-hover:shadow-[0_0_12px_rgba(199,243,107,0.35)] transition-all">
              VERIFIED
            </span>
          </div>
          <Link href="/analytics" className="inline-flex items-center gap-1 text-xs font-mono text-[#C7F36B] hover:text-[#d4f882] transition-colors group">
            <span className="group-hover:underline">Explore Analytics</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-surface p-6 group hover:border-[#C7F36B]/50 hover:-translate-y-1 transition-all duration-300 cursor-default">
            <span className="text-[10px] font-mono uppercase text-zinc-500 group-hover:text-zinc-300 tracking-wider transition-colors">PR-AUC (Primary Metric)</span>
            <p className="text-3xl font-bold font-mono text-[#C7F36B] my-2 group-hover:scale-105 group-hover:drop-shadow-[0_0_16px_rgba(199,243,107,0.6)] transition-all origin-left">
              0.5450
            </p>
            <span className="text-[11px] text-zinc-400 group-hover:text-zinc-200 font-sans transition-colors">Held-out IEEE-CIS cohort</span>
          </div>

          <div className="card-surface p-6 group hover:border-[#3395ff]/50 hover:-translate-y-1 transition-all duration-300 cursor-default">
            <span className="text-[10px] font-mono uppercase text-zinc-500 group-hover:text-zinc-300 tracking-wider transition-colors">ROC-AUC</span>
            <p className="text-3xl font-bold font-mono text-white group-hover:text-[#3395ff] my-2 group-hover:scale-105 group-hover:drop-shadow-[0_0_16px_rgba(51,149,255,0.6)] transition-all origin-left">
              0.9130
            </p>
            <span className="text-[11px] text-zinc-400 group-hover:text-zinc-200 font-sans transition-colors">Global discrimination</span>
          </div>

          <div className="card-surface p-6 group hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 cursor-default">
            <span className="text-[10px] font-mono uppercase text-zinc-500 group-hover:text-zinc-300 tracking-wider transition-colors">Inference Latency</span>
            <p className="text-3xl font-bold font-mono text-emerald-400 my-2 group-hover:scale-105 group-hover:drop-shadow-[0_0_16px_rgba(16,185,129,0.6)] transition-all origin-left">
              &lt; 1.0 ms
            </p>
            <span className="text-[11px] text-zinc-400 group-hover:text-zinc-200 font-sans transition-colors">Sub-millisecond booster</span>
          </div>

          <div className="card-surface p-6 group hover:border-[#6366f1]/50 hover:-translate-y-1 transition-all duration-300 cursor-default">
            <span className="text-[10px] font-mono uppercase text-zinc-500 group-hover:text-zinc-300 tracking-wider transition-colors">Engineered Features</span>
            <p className="text-3xl font-bold font-mono text-white group-hover:text-[#818cf8] my-2 group-hover:scale-105 group-hover:drop-shadow-[0_0_16px_rgba(99,102,241,0.6)] transition-all origin-left">
              492
            </p>
            <span className="text-[11px] text-zinc-400 group-hover:text-zinc-200 font-sans transition-colors">Causal feature store</span>
          </div>
        </div>
      </section>
    </div>
  );
}
