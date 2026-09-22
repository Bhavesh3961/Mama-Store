"use client";

import React, { useState } from "react";

export function DealScratchCard() {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const couponCode = "MAMA-FESTIVAL";
  const discountDesc = "FLAT ₹150 OFF + FREE GIFT ON ORDERS OVER ₹699";

  const triggerConfetti = () => {
    // Zero-dependency pure canvas confetti burst
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#d97757", "#c89f5f", "#6b2d38", "#25d366", "#ffd700", "#e8a0ab"];
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      rot: number;
      rotSpeed: number;
    }[] = [];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.45,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.8) * 18,
        size: 6 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1.0,
        rot: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.2,
      });
    }

    let frame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.45; // gravity
        p.alpha *= 0.96;
        p.rot += p.rotSpeed;

        if (p.alpha > 0.05) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });

      if (alive) {
        frame = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(frame);
        canvas.remove();
      }
    };
    animate();
  };

  const handleReveal = () => {
    if (!revealed) {
      setRevealed(true);
      triggerConfetti();
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="scratch-card-wrapper" onClick={handleReveal}>
      <div className={`scratch-card-inner ${revealed ? "revealed" : ""}`}>
        {/* Holographic Hidden Secret */}
        <div className="scratch-secret-content">
          <span className="badge-luxury gold">🎉 YOU UNLOCKED VIP DISCOUNT!</span>
          <h3 style={{ fontSize: "1.45rem", margin: "10px 0 4px", color: "var(--ink)" }}>
            {discountDesc}
          </h3>
          <p className="small muted">
            Apply this code at checkout or mention it directly on WhatsApp!
          </p>
          <div className="coupon-code-pill" onClick={handleCopy}>
            <code>{couponCode}</code>
            <button type="button" className="btn-copy">
              {copied ? "COPIED! ✓" : "TAP TO COPY"}
            </button>
          </div>
        </div>

        {/* Scratchable Foil Cover */}
        {!revealed && (
          <div className="scratch-foil-cover">
            <div className="foil-shimmer" />
            <span className="foil-sparkle">✨</span>
            <strong style={{ fontSize: "1.2rem", color: "#4a3210" }}>
              SCRATCH TO UNLOCK SECRET FESTIVAL DISCOUNT
            </strong>
            <p className="small" style={{ color: "#7a541c", marginTop: 4 }}>
              Click or tap here to reveal today's highest discount deal + free gift
            </p>
            <span className="scratch-tap-btn">TAP TO SCRATCH ✦</span>
          </div>
        )}
      </div>
    </div>
  );
}
