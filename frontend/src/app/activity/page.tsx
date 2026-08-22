"use client";

import { useEffect, useState } from "react";
import { api, type ActivityItem } from "@/lib/api";
import { formatLatency, timeAgo } from "@/lib/utils";
import { RiskBadge, ActionBadge, PageHeader, EmptyState } from "@/components/ui/primitives";
import { Activity as ActivityIcon, Radio, RefreshCw } from "lucide-react";
import { ParticleField } from "@/components/visuals/ParticleField";
import { cn } from "@/lib/utils";

export default function ActivityPage() {
  const [activityLog, setActivityLog] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadActivity() {
    setLoading(true);
    try {
      const data = await api.activity();
      setActivityLog(data);
    } catch (err) {
      console.error("Failed to load activity from PostgreSQL:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadActivity();
  }, []);

  return (
    <div className="relative min-h-screen px-12 lg:px-20 py-12 max-w-5xl overflow-hidden">
      {/* Contextual Live Stream Particle Activity */}
      <ParticleField mode="activity" className="opacity-45" />

      {/* Ambient background spotlights */}
      <div className="absolute top-0 left-1/4 w-[650px] h-[350px] bg-gradient-to-br from-[#10b981]/12 via-[#3395ff]/08 to-transparent rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <PageHeader
            title="Activity Stream"
            description="Persistent operational telemetry of real-time fraud scoring events and policy routing"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={loadActivity}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#3395ff]/40 text-xs font-mono text-zinc-300 hover:text-white transition-all backdrop-blur-md shadow-sm"
            >
              <RefreshCw className={cn("w-3.5 h-3.5 text-[#3395ff]", loading && "animate-spin")} />
              <span>Refresh</span>
            </button>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>PostgreSQL Sync</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="card-surface p-12 text-center text-xs font-mono text-zinc-400">
            <RefreshCw className="w-5 h-5 text-[#3395ff] animate-spin mx-auto mb-3" />
            Hydrating stream events from PostgreSQL 16…
          </div>
        ) : activityLog.length === 0 ? (
          <EmptyState
            title="No activity recorded"
            description="Live decision events will appear here as transactions are analyzed and persisted into PostgreSQL."
          />
        ) : (
          <div className="space-y-3.5">
            {activityLog.map((item, idx) => (
              <div
                key={idx}
                className="card-surface p-5 hover:border-[#3395ff]/40 transition-all flex items-center justify-between backdrop-blur-xl bg-[#0f1217]/90 shadow-lg hover:shadow-[0_0_24px_rgba(51,149,255,0.15)] group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3395ff]/20 to-[#6366f1]/20 border border-[#3395ff]/35 flex items-center justify-center group-hover:scale-105 group-hover:shadow-[0_0_12px_rgba(51,149,255,0.35)] transition-all">
                    <ActivityIcon className="w-4 h-4 text-[#3395ff] drop-shadow-[0_0_6px_rgba(51,149,255,0.8)]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm font-semibold text-white group-hover:text-[#3395ff] transition-colors">
                        #{item.transaction_id}
                      </span>
                      <RiskBadge level={item.risk.risk_level} />
                      <ActionBadge action={item.decision.action} />
                      <span className="text-[11px] text-zinc-500 font-mono">{timeAgo(item.created_at)}</span>
                    </div>
                    <p className="text-xs text-zinc-300 mt-1 line-clamp-1">
                      {item.explanation.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right font-mono">
                  <div>
                    <p className={cn("text-base font-bold tracking-tight",
                      item.risk.risk_level === "CRITICAL" ? "text-red-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]" :
                      item.risk.risk_level === "HIGH" ? "text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]" :
                      item.risk.risk_level === "MEDIUM" ? "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" : "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                    )}>
                      {item.risk.risk_score.toFixed(1)}
                    </p>
                    <p className="text-[11px] text-zinc-400">Risk Score</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs text-zinc-300 font-medium">
                      {formatLatency(item.telemetry.total_latency_ms)}
                    </p>
                    <p className="text-[11px] text-zinc-500">Latency</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
