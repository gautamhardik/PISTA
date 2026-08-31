"use client";

import { useEffect, useRef } from "react";

export type ParticleMode = "hero" | "scan" | "risk" | "queue" | "activity" | "telemetry" | "network" | "subtle";

interface Props {
  className?: string;
  mode?: ParticleMode;
  riskLevel?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

interface Node {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  baseRadius: number;
  color: string;
  pulsePhase: number;
}

export function ParticleField({ className, mode = "hero", riskLevel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let animId: number;
    let nodes: Node[] = [];
    let mouse = { x: -1000, y: -1000 };
    let width = 0;
    let height = 0;
    let resizeTimeout: NodeJS.Timeout;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx!.scale(dpr, dpr);
    }

    function init() {
      resize();
      
      // Node count tuned per page mode for ultra-smooth 60 FPS
      let count = Math.min(50, Math.floor((width * height) / 12000));
      let colors = ["rgba(51, 149, 255, ", "rgba(99, 102, 241, ", "rgba(14, 165, 233, "];

      if (mode === "scan") {
        count = Math.min(45, Math.floor((width * height) / 14000));
        colors = ["rgba(51, 149, 255, ", "rgba(14, 165, 233, ", "rgba(99, 102, 241, ", "rgba(56, 189, 248, "];
      } else if (mode === "risk") {
        count = 40;
        if (riskLevel === "CRITICAL") {
          colors = ["rgba(244, 63, 94, ", "rgba(225, 29, 72, ", "rgba(51, 149, 255, "];
        } else if (riskLevel === "HIGH") {
          colors = ["rgba(249, 115, 22, ", "rgba(245, 158, 11, ", "rgba(51, 149, 255, "];
        } else if (riskLevel === "MEDIUM") {
          colors = ["rgba(245, 158, 11, ", "rgba(217, 119, 6, ", "rgba(51, 149, 255, "];
        } else {
          colors = ["rgba(16, 185, 129, ", "rgba(52, 211, 153, ", "rgba(51, 149, 255, "];
        }
      } else if (mode === "queue" || mode === "activity") {
        count = Math.min(35, Math.floor((width * height) / 16000));
        colors = ["rgba(51, 149, 255, ", "rgba(129, 140, 248, ", "rgba(99, 102, 241, "];
      } else if (mode === "network" || mode === "telemetry") {
        count = Math.min(45, Math.floor((width * height) / 12000));
        colors = ["rgba(51, 149, 255, ", "rgba(99, 102, 241, ", "rgba(16, 185, 129, "];
      }

      nodes = Array.from({ length: Math.max(15, count) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 400 - 200,
        vx: (Math.random() - 0.5) * (mode === "scan" ? 0.4 : 0.3),
        vy: (Math.random() - 0.5) * (mode === "scan" ? 0.4 : 0.3),
        vz: (Math.random() - 0.5) * 0.2,
        baseRadius: Math.random() * 2.0 + 1.0,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulsePhase: Math.random() * Math.PI * 2,
      }));
    }

    function handleMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }

    function handleMouseLeave() {
      mouse.x = -1000;
      mouse.y = -1000;
    }

    function handleResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        init();
      }, 150);
    }

    function draw(time: number) {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      const fov = 350;
      const t = time * 0.001;

      // Project 3D nodes
      const projected = nodes.map((node) => {
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        if (node.z < -200 || node.z > 200) node.vz *= -1;

        // Mouse gentle interaction
        const mdx = node.x - mouse.x;
        const mdy = node.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 140 && mdist > 0) {
          const force = (1 - mdist / 140) * 1.2;
          node.x += (mdx / mdist) * force;
          node.y += (mdy / mdist) * force;
        }

        const scale = fov / (fov + node.z);
        const px = (node.x - width / 2) * scale + width / 2;
        const py = (node.y - height / 2) * scale + height / 2;
        const alpha = Math.max(0.12, Math.min(0.75, (node.z + 200) / 400));
        const pulse = Math.sin(t * 2.0 + node.pulsePhase) * 0.35 + 1;
        const r = node.baseRadius * scale * pulse;

        return { ...node, px, py, scale, alpha, r };
      });

      // Spatial Constellation lines with soft glow
      const maxDist = mode === "scan" ? 130 : 110;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * Math.min(p1.alpha, p2.alpha) * 0.4;
            ctx.strokeStyle = `rgba(51, 149, 255, ${lineAlpha})`;
            ctx.lineWidth = Math.max(0.4, 0.8 * Math.min(p1.scale, p2.scale));
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }

      // Draw nodes with intense radial glow aura
      for (const p of projected) {
        // Outer diffuse aura
        const outerGrad = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, p.r * 4.5);
        outerGrad.addColorStop(0, `${p.color}${p.alpha * 0.7})`);
        outerGrad.addColorStop(0.5, `${p.color}${p.alpha * 0.25})`);
        outerGrad.addColorStop(1, `${p.color}0)`);

        ctx.fillStyle = outerGrad;
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.r * 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Inner solid radiant core
        ctx.fillStyle = `${p.color}${Math.min(1, p.alpha * 1.6)})`;
        ctx.beginPath();
        ctx.arc(p.px, p.py, Math.max(0.8, p.r), 0, Math.PI * 2);
        ctx.fill();
      }

      if (!document.hidden) {
        animId = requestAnimationFrame(draw);
      }
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(animId);
      }
    };

    init();
    animId = requestAnimationFrame(draw);
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [mode, riskLevel]);

  return <canvas ref={canvasRef} className={`particle-canvas ${className ?? ""}`} />;
}
