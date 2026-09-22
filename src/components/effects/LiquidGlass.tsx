"use client";

import React, { useRef, useState, MouseEvent } from "react";

interface LiquidGlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  intensity?: "subtle" | "medium" | "deep";
  glowColor?: string;
  tilt?: boolean;
  className?: string;
}

export function LiquidGlassPanel({
  children,
  intensity = "medium",
  glowColor = "rgba(217, 119, 87, 0.18)",
  tilt = true,
  className = "",
  style,
  ...props
}: LiquidGlassPanelProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });

    if (tilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const rotX = ((mouseY - centerY) / centerY) * -4.5;
      const rotY = ((mouseX - centerX) / centerX) * 4.5;
      setRotate({ x: rotX, y: rotY });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setCoords({ x: 50, y: 50 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`liquid-glass-container ${intensity} ${className}`}
      style={{
        transform: tilt && isHovered
          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateY(-3px)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)",
        transition: isHovered ? "transform 0.12s ease-out" : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
        ["--liquid-x" as string]: `${coords.x}%`,
        ["--liquid-y" as string]: `${coords.y}%`,
        ["--liquid-glow" as string]: glowColor,
        ...style,
      }}
      {...props}
    >
      {/* Dynamic refraction highlight border */}
      <div className="liquid-glass-specular" aria-hidden="true" />
      {/* Ambient optical edge dispersion */}
      <div className="liquid-glass-caustic" aria-hidden="true" />
      <div className="liquid-glass-content">{children}</div>
    </div>
  );
}

interface LiquidGlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "pill";
  className?: string;
}

export function LiquidGlassButton({
  children,
  variant = "pill",
  className = "",
  ...props
}: LiquidGlassButtonProps) {
  const [coords, setCoords] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });
  };

  return (
    <button
      onMouseMove={handleMouseMove}
      className={`liquid-glass-btn ${variant} ${className}`}
      style={{
        ["--liquid-x" as string]: `${coords.x}%`,
        ["--liquid-y" as string]: `${coords.y}%`,
      }}
      {...props}
    >
      <span className="liquid-btn-gleam" aria-hidden="true" />
      <span className="liquid-btn-label">{children}</span>
    </button>
  );
}
