import React from "react";
import { cn } from "@/lib/utils";

interface PistaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showDescriptor?: boolean;
}

export function PistaMonogram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-5 h-5", className)}
      aria-label="PISTA Monogram"
    >
      {/* Continuous geometric signal path forming the letter P */}
      <path
        d="M6 20V4H13.5C16.5376 4 19 6.46243 19 9.5C19 12.5376 16.5376 15 13.5 15H6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Signal focal point trace */}
      <circle cx="13.5" cy="9.5" r="1.5" fill="#C7F36B" />
    </svg>
  );
}

export function PistaLogo({ className, size = "md", showDescriptor = true }: PistaLogoProps) {
  const sizeClasses = {
    sm: "text-base tracking-[0.14em]",
    md: "text-lg tracking-[0.16em]",
    lg: "text-2xl tracking-[0.18em]",
  };

  return (
    <div className={cn("inline-flex items-center gap-3 select-none", className)}>
      <div className="w-8 h-8 rounded-lg bg-[#14171A] border border-[#24282D] flex items-center justify-center text-[#F4F5F6] shadow-sm">
        <PistaMonogram />
      </div>
      <div>
        <div className="flex items-center gap-1.5 leading-none">
          <span className={cn("font-bold text-[#F4F5F6] font-sans", sizeClasses[size])}>
            PISTA
          </span>
          <span className="w-1 h-1 rounded-full bg-[#C7F36B]" />
        </div>
        {showDescriptor && (
          <p className="text-[9px] uppercase tracking-[0.24em] text-[#606770] font-mono mt-0.5 font-medium">
            Transaction Intelligence
          </p>
        )}
      </div>
    </div>
  );
}
