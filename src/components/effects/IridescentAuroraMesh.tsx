"use client";

import React, { useEffect, useRef } from "react";

export function IridescentAuroraMesh({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let isVisible = true;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const orbs = [
      { x: width * 0.25, y: height * 0.3, r: 280, color: "#f8e5d0", vx: 0.6, vy: 0.4 },
      { x: width * 0.75, y: height * 0.4, r: 320, color: "#eed7cc", vx: -0.5, vy: 0.6 },
      { x: width * 0.5, y: height * 0.75, r: 340, color: "#d97757", alpha: 0.28, vx: 0.4, vy: -0.5 },
      { x: width * 0.85, y: height * 0.8, r: 260, color: "#6b2d38", alpha: 0.18, vx: -0.4, vy: -0.4 },
      { x: width * 0.15, y: height * 0.8, r: 240, color: "#e8a07c", alpha: 0.25, vx: 0.5, vy: -0.3 },
    ];

    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Base warm cream background
      ctx.fillStyle = "#faf6f0";
      ctx.fillRect(0, 0, width, height);

      // Render floating iridescent liquid orbs
      orbs.forEach((orb, i) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -orb.r * 0.3 || orb.x > width + orb.r * 0.3) orb.vx *= -1;
        if (orb.y < -orb.r * 0.3 || orb.y > height + orb.r * 0.3) orb.vy *= -1;

        // Mouse gentle magnetic displacement
        const dx = mouse.x - orb.x;
        const dy = mouse.y - orb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 400) {
          orb.x -= (dx / dist) * 1.2;
          orb.y -= (dy / dist) * 1.2;
        }

        const radGrad = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.r
        );
        const alpha = orb.alpha ?? 0.45;
        radGrad.addColorStop(0, orb.color + Math.floor(alpha * 255).toString(16).padStart(2, "0"));
        radGrad.addColorStop(0.6, orb.color + "22");
        radGrad.addColorStop(1, "transparent");

        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, width, height);
      });

      // Subtle light caustic prism across center
      const prismGrad = ctx.createLinearGradient(0, 0, width, height);
      prismGrad.addColorStop(0, "rgba(255,255,255,0.4)");
      prismGrad.addColorStop(0.3, "rgba(255,235,210,0.15)");
      prismGrad.addColorStop(0.7, "rgba(255,210,190,0.2)");
      prismGrad.addColorStop(1, "rgba(255,255,255,0.3)");

      ctx.fillStyle = prismGrad;
      ctx.fillRect(0, 0, width, height);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => (isVisible = e.isIntersecting));
    });
    observer.observe(canvas);

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`iridescent-aurora-canvas ${className}`}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        filter: "blur(40px)",
      }}
      aria-hidden="true"
    />
  );
}
