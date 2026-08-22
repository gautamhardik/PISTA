"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RiskScoreRingProps {
  score: number; // 0 to 100
  level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  size?: number;
  strokeWidth?: number;
  showDetails?: boolean;
}

export function RiskScoreRing({
  score,
  level,
  size = 220,
  strokeWidth = 10,
  showDetails = true,
}: RiskScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(start + (score - start) * ease);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Semantic color styling with vibrant chartreuse for LOW risk as requested
  const levelStyles: Record<string, { stroke: string; glow: string; text: string; bgGlow: string }> = {
    LOW: {
      stroke: "#C7F36B",
      glow: "drop-shadow(0 0 16px rgba(199, 243, 107, 0.75))",
      text: "text-[#C7F36B] drop-shadow-[0_0_14px_rgba(199,243,107,0.8)]",
      bgGlow: "bg-[#C7F36B]/15",
    },
    MEDIUM: {
      stroke: "#f59e0b",
      glow: "drop-shadow(0 0 16px rgba(245, 158, 11, 0.75))",
      text: "text-amber-400 drop-shadow-[0_0_14px_rgba(245,158,11,0.8)]",
      bgGlow: "bg-amber-500/15",
    },
    HIGH: {
      stroke: "#f97316",
      glow: "drop-shadow(0 0 16px rgba(249, 115, 22, 0.75))",
      text: "text-orange-400 drop-shadow-[0_0_14px_rgba(249,115,22,0.8)]",
      bgGlow: "bg-orange-500/15",
    },
    CRITICAL: {
      stroke: "#f43f5e",
      glow: "drop-shadow(0 0 18px rgba(244, 63, 94, 0.85))",
      text: "text-red-400 drop-shadow-[0_0_16px_rgba(244,63,94,0.9)]",
      bgGlow: "bg-rose-500/15",
    },
  };

  const current = levelStyles[level] || levelStyles.LOW;

  return (
    <div className="relative flex flex-col items-center justify-center select-none" style={{ width: size, height: size }}>
      {/* Radiant Multi-Layer Neon Blur Halos */}
      <div
        className={cn(
          "absolute inset-4 rounded-full blur-3xl opacity-50 transition-all duration-700 animate-pulse pointer-events-none",
          current.bgGlow
        )}
      />
      <div
        className={cn(
          "absolute inset-8 rounded-full blur-xl opacity-40 transition-all duration-700 pointer-events-none",
          current.bgGlow
        )}
      />

      {/* SVG Ring with filter and drop shadow glow */}
      <svg width={size} height={size} className="transform -rotate-90 relative z-10">
        <defs>
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.07)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Glowing Active Ring Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={current.stroke}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          filter="url(#neon-glow)"
          style={{ filter: current.glow }}
          className="transition-all duration-150"
        />
      </svg>

      {/* Internal Text & Risk Verdict with glow shadows */}
      <div className="absolute flex flex-col items-center justify-center text-center z-20">
        <span className="text-[11px] uppercase font-mono tracking-[0.22em] text-zinc-400 font-semibold mb-0.5">
          Risk Score
        </span>
        <span className={cn("text-4xl sm:text-5xl font-bold font-mono tracking-tight my-0.5", current.text)}>
          {animatedScore.toFixed(1)}
        </span>
        {showDetails && (
          <span className="text-xs font-mono font-medium text-zinc-400 mt-0.5">
            / 100 <span className={cn("font-bold font-mono ml-1 uppercase", current.text)}>{level}</span>
          </span>
        )}
      </div>
    </div>
  );
}
