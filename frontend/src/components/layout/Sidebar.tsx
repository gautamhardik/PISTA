"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Crosshair,
  Layers,
  Activity,
  BarChart3,
  Cpu,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Overview", group: "main" },
  { href: "/analyze", icon: Crosshair, label: "Analyze", group: "main" },
  { href: "/cases", icon: Layers, label: "Cases", group: "main" },
  { href: "/activity", icon: Activity, label: "Activity", group: "main" },
  { href: "/analytics", icon: BarChart3, label: "Analytics", group: "intelligence" },
  { href: "/model", icon: Cpu, label: "Model", group: "system" },
  { href: "/settings", icon: Settings, label: "Settings", group: "system" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[64px] flex flex-col items-center py-6 border-r border-white/[0.06] bg-[#07080a]/90 backdrop-blur-2xl z-50">
      {/* Brand Monogram Icon: Sharp, geometric P mark */}
      <Link href="/" className="mb-10 group flex flex-col items-center" aria-label="PISTA Home">
        <div className="w-9 h-9 rounded-lg bg-[#0E1012] border border-white/[0.1] flex items-center justify-center transition-all duration-300 group-hover:border-[#C7F36B]/60 group-hover:bg-[#14171A]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover:scale-105">
            <path
              d="M6 3H14C17.3137 3 20 5.68629 20 9C20 12.3137 17.3137 15 14 15H10V21H6V3Z"
              stroke="#C7F36B"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="10" cy="9" r="1.5" fill="#C7F36B" />
          </svg>
        </div>
      </Link>

      {/* Main Nav */}
      <nav className="flex flex-col items-center gap-2.5 flex-1">
        {navItems
          .filter((n) => n.group === "main")
          .map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className={cn(
                  "relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 group",
                  isActive
                    ? "bg-white/[0.06] text-white border border-white/[0.12]"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]"
                )}
              >
                <item.icon
                  className={cn(
                    "w-[18px] h-[18px] transition-colors",
                    isActive ? "text-[#C7F36B]" : "text-zinc-400 group-hover:text-zinc-200"
                  )}
                  strokeWidth={1.75}
                />
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-[#C7F36B] rounded-r" />
                )}
                {/* Refined Dark Tooltip */}
                <span className="absolute left-14 px-2.5 py-1 rounded bg-[#14171A] border border-white/[0.1] text-[11px] font-medium text-zinc-200 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-xl">
                  {item.label}
                </span>
              </Link>
            );
          })}

        {/* Quiet Separator */}
        <div className="w-5 h-px bg-white/[0.08] my-2" />

        {/* Intelligence */}
        {navItems
          .filter((n) => n.group === "intelligence")
          .map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className={cn(
                  "relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 group",
                  isActive
                    ? "bg-white/[0.06] text-white border border-white/[0.12]"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]"
                )}
              >
                <item.icon
                  className={cn(
                    "w-[18px] h-[18px] transition-colors",
                    isActive ? "text-[#C7F36B]" : "text-zinc-400 group-hover:text-zinc-200"
                  )}
                  strokeWidth={1.75}
                />
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-[#C7F36B] rounded-r" />
                )}
                <span className="absolute left-14 px-2.5 py-1 rounded bg-[#14171A] border border-white/[0.1] text-[11px] font-medium text-zinc-200 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-xl">
                  {item.label}
                </span>
              </Link>
            );
          })}

        <div className="flex-1" />

        {/* System */}
        {navItems
          .filter((n) => n.group === "system")
          .map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className={cn(
                  "relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 group",
                  isActive
                    ? "bg-white/[0.06] text-white border border-white/[0.12]"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]"
                )}
              >
                <item.icon
                  className={cn(
                    "w-[18px] h-[18px] transition-colors",
                    isActive ? "text-[#C7F36B]" : "text-zinc-400 group-hover:text-zinc-200"
                  )}
                  strokeWidth={1.75}
                />
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-[#C7F36B] rounded-r" />
                )}
                <span className="absolute left-14 px-2.5 py-1 rounded bg-[#14171A] border border-white/[0.1] text-[11px] font-medium text-zinc-200 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-xl">
                  {item.label}
                </span>
              </Link>
            );
          })}
      </nav>
    </aside>
  );
}
