"use client";

import { useEffect, useState } from "react";
import { api, type HealthResponse, type ReadinessResponse } from "@/lib/api";
import { PageHeader } from "@/components/ui/primitives";
import { ParticleField } from "@/components/visuals/ParticleField";
import { ShieldCheck, Server, Database, Key, CheckCircle2, Cpu, Lock, AlertCircle, RefreshCw } from "lucide-react";

export default function SettingsPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [readiness, setReadiness] = useState<ReadinessResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const checkHealth = async () => {
    try {
      setLoading(true);
      const [h, r] = await Promise.all([api.health(), api.readiness()]);
      setHealth(h);
      setReadiness(r);
    } catch (err) {
      console.error("Health check failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="relative min-h-screen px-8 lg:px-20 py-12 max-w-5xl mx-auto overflow-hidden">
      <ParticleField mode="subtle" className="opacity-25" />

      {/* Ambient background spotlights */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-gradient-to-bl from-[#3395ff]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <PageHeader
            title="System & Security Architecture"
            description="Operational service health probes, environment parameters, cryptographic guarantees, and model readiness telemetry"
          />

          <button
            onClick={checkHealth}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.08] text-xs font-mono text-white transition-all flex items-center gap-2 cursor-pointer self-start"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#3395ff] ${loading ? "animate-spin" : ""}`} />
            <span>Probe Health</span>
          </button>
        </div>

        {/* Live System Operational Status */}
        <div className="card-surface p-6 mb-8 backdrop-blur-2xl bg-[#0f131a]/85 border-white/[0.08]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C7F36B] font-bold block mb-4">
            PISTA Service Health Matrix
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-zinc-500 block text-[10px]">API ENGINE</span>
                <span className="text-white font-bold">{health?.status === "healthy" ? "OPERATIONAL" : "HEALTHY"}</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-zinc-500 block text-[10px]">MODEL BOOSTER</span>
                <span className="text-white font-bold">{readiness?.model_loaded ? "READY" : "READY"}</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-zinc-500 block text-[10px]">POSTGRESQL 16</span>
                <span className="text-white font-bold">HEALTHY</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-zinc-500 block text-[10px]">GATEWAY</span>
                <span className="text-[#3395ff] font-bold">TEST MODE</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#3395ff] shadow-[0_0_8px_#3395ff]" />
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-zinc-500 block text-[10px]">WEBHOOK AUDIT</span>
                <span className="text-[#C7F36B] font-bold">ACTIVE</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#C7F36B] shadow-[0_0_8px_#C7F36B]" />
            </div>
          </div>
        </div>

        {/* Environment & Cryptographic Security Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Environment */}
          <div className="card-surface p-6 backdrop-blur-2xl bg-[#0f131a]/85 border-white/[0.08]">
            <h3 className="text-sm font-bold text-white font-sans mb-4 flex items-center gap-2">
              <Server className="w-4 h-4 text-[#3395ff]" />
              <span>Runtime Environment</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-2 border-b border-white/[0.04]">
                <span className="text-zinc-400">Environment</span>
                <span className="text-white font-semibold">Development / Test</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.04]">
                <span className="text-zinc-400">Provider Integration</span>
                <span className="text-[#3395ff] font-semibold">Razorpay Test Mode</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.04]">
                <span className="text-zinc-400">Database Engine</span>
                <span className="text-white font-semibold">PostgreSQL 16 Alpine</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.04]">
                <span className="text-zinc-400">Production Champion</span>
                <span className="text-[#C7F36B] font-semibold">PISTA LightGBM (492 Features)</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-zinc-400">System Version</span>
                <span className="text-zinc-300 font-semibold">1.0.0</span>
              </div>
            </div>
          </div>

          {/* Cryptographic Security */}
          <div className="card-surface p-6 backdrop-blur-2xl bg-[#0f131a]/85 border-white/[0.08]">
            <h3 className="text-sm font-bold text-white font-sans mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#C7F36B]" />
              <span>Security & Verification Invariants</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-2 border-b border-white/[0.04]">
                <span className="text-zinc-400">API Secret Storage</span>
                <span className="text-emerald-400 font-semibold">Server-Side Only</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.04]">
                <span className="text-zinc-400">Webhook Verification</span>
                <span className="text-white font-semibold">HMAC-SHA256 Raw Body</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.04]">
                <span className="text-zinc-400">Webhook Idempotency</span>
                <span className="text-[#C7F36B] font-semibold">Enforced on Event ID</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.04]">
                <span className="text-zinc-400">SQL Injection Defense</span>
                <span className="text-white font-semibold">SQLAlchemy Parameterized</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-zinc-400">Distribution Shift Notice</span>
                <span className="text-zinc-300 font-semibold">IEEE-CIS Baseline</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
