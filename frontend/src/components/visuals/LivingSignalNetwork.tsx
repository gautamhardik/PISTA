"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  phase: number;
  signalPulse: number; // 0 to 1
  pulseSpeed: number;
  isFocal?: boolean;
}

export function LivingSignalNetwork({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // Controlled mathematical constellation
    const nodeCount = 38;
    const nodes: Node[] = [];

    // Central Transaction Convergence Node
    const centerNode: Node = {
      x: width * 0.5,
      y: height * 0.44,
      vx: 0,
      vy: 0,
      baseRadius: 3.5,
      phase: 0,
      signalPulse: 1,
      pulseSpeed: 0.02,
      isFocal: true,
    };
    nodes.push(centerNode);

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        baseRadius: Math.random() * 1.6 + 0.9,
        phase: Math.random() * Math.PI * 2,
        signalPulse: Math.random(),
        pulseSpeed: Math.random() * 0.015 + 0.005,
      });
    }

    let t = 0;

    const render = () => {
      t += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Subtle atmospheric center warmth
      const bgGrad = ctx.createRadialGradient(
        centerNode.x,
        centerNode.y,
        0,
        centerNode.x,
        centerNode.y,
        Math.max(width, height) * 0.6
      );
      bgGrad.addColorStop(0, "rgba(20, 26, 38, 0.4)");
      bgGrad.addColorStop(0.4, "rgba(10, 14, 20, 0.2)");
      bgGrad.addColorStop(1, "rgba(7, 8, 10, 0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw mathematical connection paths
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        if (!n1.isFocal) {
          n1.x += n1.vx;
          n1.y += n1.vy;

          if (n1.x < 0 || n1.x > width) n1.vx *= -1;
          if (n1.y < 0 || n1.y > height) n1.vy *= -1;
        }

        // Pulse signal lifecycle
        n1.signalPulse += n1.pulseSpeed;
        if (n1.signalPulse > 1) n1.signalPulse = 0;

        // Connect to focal transaction node
        const dfx = centerNode.x - n1.x;
        const dfy = centerNode.y - n1.y;
        const focalDist = Math.sqrt(dfx * dfx + dfy * dfy);
        
        if (focalDist < 260 && !n1.isFocal) {
          const convergenceAlpha = (1 - focalDist / 260) * 0.16;
          ctx.beginPath();
          ctx.moveTo(centerNode.x, centerNode.y);
          ctx.lineTo(n1.x, n1.y);
          ctx.strokeStyle = `rgba(51, 149, 255, ${convergenceAlpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();

          // Flowing signal energy packet traveling toward center
          const packetPos = (t * 0.8 + n1.phase) % 1;
          const px = n1.x + dfx * packetPos;
          const py = n1.y + dfy * packetPos;
          ctx.beginPath();
          ctx.arc(px, py, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(199, 243, 107, ${0.4 * (1 - packetPos)})`;
          ctx.fill();
        }

        // Connect to neighboring nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.08;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Draw individual node
        const nodePulse = Math.sin(t * 1.8 + n1.phase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(n1.x, n1.y, n1.baseRadius * nodePulse, 0, Math.PI * 2);
        
        if (n1.isFocal) {
          ctx.fillStyle = "#C7F36B";
          ctx.shadowColor = "rgba(199, 243, 107, 0.4)";
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = `rgba(148, 163, 184, ${0.35 * nodePulse})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true" />;
}
