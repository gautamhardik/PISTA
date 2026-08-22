import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatLatency(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}µs`;
  if (ms < 1000) return `${ms.toFixed(1)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function timeAgo(dateOrIso: Date | string): string {
  const d = typeof dateOrIso === "string" ? new Date(dateOrIso) : dateOrIso;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return `${Math.max(0, seconds)}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function riskColor(level: string): string {
  switch (level) {
    case "LOW": return "text-emerald-400";
    case "MEDIUM": return "text-amber-400";
    case "HIGH": return "text-orange-400";
    case "CRITICAL": return "text-red-400";
    default: return "text-zinc-400";
  }
}

export function riskBg(level: string): string {
  switch (level) {
    case "LOW": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "MEDIUM": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "HIGH": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    case "CRITICAL": return "bg-red-500/10 text-red-400 border-red-500/20";
    default: return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  }
}

export function actionColor(action: string): string {
  switch (action) {
    case "APPROVE": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "REVIEW": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "BLOCK": return "bg-red-500/10 text-red-400 border-red-500/20";
    default: return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  }
}

export function riskRingColor(level: string): string {
  switch (level) {
    case "LOW": return "#22c55e";
    case "MEDIUM": return "#f59e0b";
    case "HIGH": return "#f97316";
    case "CRITICAL": return "#ef4444";
    default: return "#71717a";
  }
}
