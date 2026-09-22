"use client";

import React, { useEffect, useRef, useState } from "react";

interface LiquidChromeProps {
  title?: string;
  subtitle?: string;
  theme?: "gold-mercury" | "liquid-silver" | "rose-gold";
  className?: string;
}

export function LiquidChromeHero({
  title = "MAMA STORE",
  subtitle = "ATELIER DE BEAUTÉ · PALI (RAJASTHAN)",
  theme = "gold-mercury",
  className = "",
}: LiquidChromeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let isVisible = true;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = 140);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Mouse ripples
    const ripples: { x: number; y: number; radius: number; maxRadius: number; alpha: number }[] = [];
    let mouse = { x: width / 2, y: height / 2, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;

      if (Math.random() < 0.4) {
        ripples.push({
          x: mouse.x,
          y: mouse.y,
          radius: 2,
          maxRadius: 70 + Math.random() * 40,
          alpha: 1.0,
        });
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    let time = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      time += 0.035;

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 2.2;
        r.alpha *= 0.94;
        if (r.alpha < 0.02 || r.radius > r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      ctx.clearRect(0, 0, width, height);

      // Create high-contrast molten metal gradient
      const grad = ctx.createLinearGradient(
        0,
        0,
        width + Math.sin(time) * 120,
        height + Math.cos(time * 0.8) * 60
      );

      if (theme === "gold-mercury") {
        grad.addColorStop(0.0, "#4a3210");
        grad.addColorStop(0.18, "#d4af37");
        grad.addColorStop(0.35, "#fff6db");
        grad.addColorStop(0.52, "#e5a93b");
        grad.addColorStop(0.68, "#805215");
        grad.addColorStop(0.85, "#fff3cf");
        grad.addColorStop(1.0, "#d4af37");
      } else if (theme === "rose-gold") {
        grad.addColorStop(0.0, "#4a1e27");
        grad.addColorStop(0.25, "#e08a95");
        grad.addColorStop(0.48, "#fff0f2");
        grad.addColorStop(0.72, "#b85160");
        grad.addColorStop(1.0, "#e8a0ab");
      } else {
        grad.addColorStop(0.0, "#1a1a24");
        grad.addColorStop(0.25, "#bdc3c7");
        grad.addColorStop(0.5, "#ffffff");
        grad.addColorStop(0.75, "#7f8c8d");
        grad.addColorStop(1.0, "#ecf0f1");
      }

      // Draw Subtitle / Eyebrow
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.font = "600 12px 'Outfit', sans-serif";
      ctx.letterSpacing = "0.26em";
      ctx.fillStyle = theme === "gold-mercury" ? "#c89f5f" : "#b85160";
      ctx.fillText(subtitle, width / 2, 26);

      // Main Title with molten chrome refraction displacement
      ctx.font = "bold 64px 'Fraunces', Georgia, serif";
      ctx.letterSpacing = "0.06em";

      // 1. Drop shadow for 3D liquid depth
      ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 8;
      ctx.fillStyle = grad;
      ctx.fillText(title, width / 2, 85);
      ctx.shadowColor = "transparent";

      // 2. Specular Liquid Bevel Highlights
      ctx.lineWidth = 1.8;
      const strokeGrad = ctx.createLinearGradient(
        0,
        50,
        width,
        120 + Math.sin(time * 1.2) * 20
      );
      strokeGrad.addColorStop(0, "rgba(255,255,255,0.95)");
      strokeGrad.addColorStop(0.4, "rgba(255,230,170,0.3)");
      strokeGrad.addColorStop(0.7, "rgba(255,255,255,0.9)");
      strokeGrad.addColorStop(1, "rgba(180,120,50,0.6)");
      ctx.strokeStyle = strokeGrad;
      ctx.strokeText(title, width / 2, 85);

      // 3. Render animated liquid mercury ripples over text
      ctx.globalCompositeOperation = "source-atop";
      ripples.forEach((r) => {
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${r.alpha * 0.75})`;
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(r.x, r.y, Math.max(0, r.radius - 6), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212, 175, 55, ${r.alpha * 0.5})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // 4. Moving dynamic light gleam across the metal
      const gleamX = ((Math.sin(time * 0.7) + 1) / 2) * width;
      const gleamGrad = ctx.createRadialGradient(gleamX, 85, 5, gleamX, 85, 90);
      gleamGrad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
      gleamGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.2)");
      gleamGrad.addColorStop(1, "transparent");
      ctx.fillStyle = gleamGrad;
      ctx.fillRect(0, 30, width, 100);

      ctx.restore();
    };

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", handleResize);
    render();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => (isVisible = e.isIntersecting));
    });
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
    };
  }, [title, subtitle, theme]);

  return (
    <div
      className={`liquid-chrome-hero-wrap ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        position: "relative",
      }}
      title="Hover or glide across to ripple the molten metal"
    >
      <canvas ref={canvasRef} style={{ width: "100%", maxWidth: 840, height: 140 }} />
    </div>
  );
}
