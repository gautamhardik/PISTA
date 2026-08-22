import React from "react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                RISK BADGES                                 */
/* -------------------------------------------------------------------------- */

export function RiskBadge({ level }: { level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string }) {
  const styles: Record<string, string> = {
    LOW: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
    MEDIUM: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    HIGH: "bg-orange-500/10 text-orange-400 border-orange-500/25",
    CRITICAL: "bg-rose-500/10 text-rose-400 border-rose-500/25",
  };

  const current = styles[level] || "bg-[#14171A] text-[#969CA5] border-[#24282D]";

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium border tracking-wider uppercase",
        current
      )}
    >
      {level}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                               ACTION BADGES                                */
/* -------------------------------------------------------------------------- */

export function ActionBadge({ action }: { action: "APPROVE" | "REVIEW" | "BLOCK" | string }) {
  const styles: Record<string, string> = {
    APPROVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
    REVIEW: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    BLOCK: "bg-rose-500/10 text-rose-400 border-rose-500/25",
  };

  const current = styles[action] || "bg-[#14171A] text-[#969CA5] border-[#24282D]";

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold border tracking-wider uppercase",
        current
      )}
    >
      {action}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                                STATUS DOTS                                 */
/* -------------------------------------------------------------------------- */

export function StatusDot({ status }: { status: "active" | "open" | "review" | "blocked" | "resolved" | string }) {
  const colors: Record<string, string> = {
    active: "bg-emerald-400",
    open: "bg-[#C7F36B]",
    review: "bg-amber-400",
    blocked: "bg-rose-400",
    resolved: "bg-emerald-400",
  };

  return (
    <span className="relative flex h-2 w-2">
      <span className={cn("relative inline-flex rounded-full h-2 w-2", colors[status] || "bg-[#969CA5]")} />
    </span>
  );
}

export function StatusBadge({ status }: { status: "open" | "review" | "blocked" | "resolved" | string }) {
  const styles: Record<string, string> = {
    open: "bg-[#C7F36B]/10 text-[#C7F36B] border-[#C7F36B]/30",
    review: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    blocked: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    resolved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  };

  const current = styles[status] || "bg-white/[0.04] text-zinc-400 border-white/[0.08]";

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium border uppercase tracking-wider",
        current
      )}
    >
      {status}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                               PAGE HEADER                                  */
/* -------------------------------------------------------------------------- */

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F4F5F6] font-sans">
        {title}
      </h1>
      {description && (
        <p className="text-xs sm:text-sm text-[#969CA5] mt-1 font-normal">
          {description}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                METRIC CARD                                 */
/* -------------------------------------------------------------------------- */

export function MetricCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string | number;
  sublabel?: string;
}) {
  return (
    <div className="card-surface p-4 flex flex-col justify-between">
      <span className="text-[11px] uppercase tracking-wider text-[#969CA5] font-mono font-medium">
        {label}
      </span>
      <div className="my-2">
        <span className="text-2xl font-bold font-mono text-[#F4F5F6] tracking-tight">
          {value}
        </span>
      </div>
      {sublabel && (
        <span className="text-[11px] text-[#606770] font-mono">
          {sublabel}
        </span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                EMPTY STATE                                 */
/* -------------------------------------------------------------------------- */

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="card-surface p-12 text-center my-6">
      <h3 className="text-sm font-medium text-[#F4F5F6] mb-1">{title}</h3>
      <p className="text-xs text-[#969CA5] max-w-sm mx-auto">{description}</p>
    </div>
  );
}
