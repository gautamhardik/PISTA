import React from "react";
import { cn } from "@/lib/utils";

interface PistaLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
  interactive?: boolean;
}

export function PistaLogo({ className, size = 32, glow = true, interactive = false }: PistaLogoProps) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center select-none transition-transform duration-500",
        interactive && "hover:scale-105 cursor-pointer",
        className
      )}
      style={{ width: size, height: size }}
    >
      {/* Dynamic Concentric Ambient Radar Halos */}
      {glow && (
        <>
          <div
            className="absolute inset-0 rounded-full bg-[#C7F36B]/20 blur-[28px] pointer-events-none animate-pulse"
            style={{ animationDuration: "4s" }}
          />
          <div
            className="absolute w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-[#C7F36B]/30 via-[#3395ff]/15 to-transparent blur-[16px] pointer-events-none -top-2 -right-2"
          />
        </>
      )}

      {/* Bespoke Cursive 'P' + Pistachio Shell SVG */}
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[0_4px_24px_rgba(199,243,107,0.25)]"
      >
        <defs>
          {/* Luxury Metallic Gold / Champagne Gradient */}
          <linearGradient id="pistaGoldGrad" x1="15" y1="85" x2="85" y2="15" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="35%" stopColor="#F9E8B2" />
            <stop offset="70%" stopColor="#E6C875" />
            <stop offset="100%" stopColor="#AA822A" />
          </linearGradient>

          {/* Electric Chartreuse Pistachio Kernel Gradient */}
          <linearGradient id="pistaKernelGrad" x1="50" y1="20" x2="80" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ECFCCB" />
            <stop offset="40%" stopColor="#BEF264" />
            <stop offset="80%" stopColor="#84CC16" />
            <stop offset="100%" stopColor="#4D7C0F" />
          </linearGradient>

          {/* Filter for rich neon drop glow */}
          <filter id="kernelGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- Radiant Glowing Pistachio Kernel --- */}
        <path
          d="M 52 38 C 50 25, 66 18, 76 24 C 84 30, 80 44, 68 47 C 58 50, 53 45, 52 38 Z"
          fill="url(#pistaKernelGrad)"
          filter="url(#kernelGlow)"
        />

        {/* --- Upper Pistachio Shell Arc (Top Flap) --- */}
        <path
          d="M 28 65 C 24 45, 45 22, 68 18 C 76 17, 80 23, 76 28 C 65 37, 50 48, 38 56"
          stroke="url(#pistaGoldGrad)"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* --- Main Cursive 'P' Body & Lower Pistachio Shell --- */}
        <path
          d="M 24 78 C 28 66, 33 54, 42 48 C 58 40, 82 42, 85 53 C 88 64, 68 76, 44 72 C 34 70, 26 78, 24 78 Z"
          stroke="url(#pistaGoldGrad)"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* --- Inner Leaf / Shell Contour Rib --- */}
        <path
          d="M 38 65 C 48 62, 64 63, 74 58"
          stroke="url(#pistaGoldGrad)"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function PistaMonolithEmblem({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center p-8 sm:p-10 rounded-3xl bg-[#0b0e14]/80 border border-white/[0.12] backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] group hover:border-[#C7F36B]/40 transition-all duration-500",
        className
      )}
    >
      {/* Ambient background orbital rings */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-white/[0.04] animate-[spin_24s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-dashed border-[#C7F36B]/10 animate-[spin_40s_linear_infinite_reverse]" />
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#C7F36B]/15 rounded-full blur-[60px]" />
      </div>

      {/* Standalone Masterpiece Emblem */}
      <div className="relative z-10 my-4 transform group-hover:scale-105 transition-transform duration-500">
        <PistaLogo size={150} interactive glow />
      </div>

      {/* Brand Identity Nomenclature */}
      <div className="relative z-10 text-center mt-3 space-y-1.5">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl sm:text-2xl font-black tracking-[0.28em] font-heading text-white">
            PISTA
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#C7F36B]/15 text-[#C7F36B] border border-[#C7F36B]/30 tracking-widest">
            ORIGIN
          </span>
        </div>
        <p className="text-[10.5px] font-mono text-zinc-400 uppercase tracking-[0.22em] max-w-[260px] leading-relaxed">
          Payment Intelligence & Security Telemetry Architecture
        </p>
      </div>

      {/* Bottom Telemetry Status Pill */}
      <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.06] w-full flex items-center justify-between text-[10px] font-mono text-zinc-500">
        <span className="flex items-center gap-1.5 text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C7F36B] shadow-[0_0_6px_#C7F36B]" />
          Autonomous Core
        </span>
        <span className="text-[#3395ff] font-semibold">492 Features</span>
      </div>
    </div>
  );
}
