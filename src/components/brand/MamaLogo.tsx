"use client";

import React from "react";
import Image from "next/image";

type MamaLogoProps = {
  inverse?: boolean;
  compact?: boolean;
  fullBadge?: boolean;
  size?: number;
};

export function MamaLogo({
  inverse = false,
  compact = false,
  fullBadge = false,
  size,
}: MamaLogoProps) {
  const logoSrc = "/mama_store_logo.jpg";

  const accessibleSvg = (
    <svg className="sr-only" aria-hidden="true" viewBox="0 0 100 100" width="1" height="1">
      <title>MAMA STORE</title>
      <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" />
      <text x="50" y="55" textAnchor="middle" fontSize="14" fontWeight="bold">MAMA</text>
    </svg>
  );

  // ── Full circular emblem (used in philosophy section) ──────────────────────
  if (fullBadge) {
    const badgeSize = size || 280;
    return (
      <div
        className="mama-logo-full-emblem"
        style={{ width: badgeSize, height: badgeSize }}
      >
        <Image
          src={logoSrc}
          alt="MAMA STORE — Beauty for a Brighter You"
          width={badgeSize}
          height={badgeSize}
          style={{
            objectFit: "contain",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
          }}
          priority
        />
      </div>
    );
  }

  // ── Compact icon-only mode (used in mobile / ultra-compact contexts) ───────
  if (compact) {
    const iconSize = 40;
    return (
      <span
        className="mama-logo-compact-icon"
        aria-label="MAMA STORE"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: iconSize,
          height: iconSize,
          borderRadius: "50%",
          overflow: "hidden",
          flexShrink: 0,
          boxShadow:
            "0 2px 10px rgba(184,134,96,0.22), inset 0 0 0 1.5px rgba(184,134,96,0.35)",
          background: "#FBF8F5",
        }}
      >
        <Image
          src={logoSrc}
          alt="MAMA STORE"
          width={iconSize}
          height={iconSize}
          style={{ objectFit: "contain", width: "100%", height: "100%" }}
          priority
        />
      </span>
    );
  }

  // ── Standard navbar logo: image badge + wordmark ───────────────────────────
  const primaryInk = inverse ? "#F5EFE8" : "#2B1D16";
  const subText = inverse ? "#D8C7B8" : "#7C5C48";
  const iconSize = 44;

  return (
    <span
      className={`mama-logo-wrap ${inverse ? "mama-logo-inverse" : ""}`}
      aria-label="MAMA STORE"
    >
      {accessibleSvg}
      {/* Circular badge — shows full logo with contain so ring text is visible */}
      <span
        className="mama-logo-mark-img-wrap"
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: "50%",
          overflow: "hidden",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: "#FBF8F5",
          boxShadow:
            "0 2px 10px rgba(184,134,96,0.22), inset 0 0 0 1.5px rgba(184,134,96,0.35)",
        }}
      >
        <Image
          src={logoSrc}
          alt="MAMA STORE Logo"
          width={iconSize}
          height={iconSize}
          style={{
            objectFit: "contain",
            width: "92%",
            height: "92%",
          }}
          priority
        />
      </span>

      {/* Wordmark */}
      <span className="mama-logo-type-block">
        <span className="mama-logo-brand-name" style={{ color: primaryInk }}>
          mama
        </span>
        <span className="mama-logo-brand-sub" style={{ color: subText }}>
          STORE
        </span>
      </span>
    </span>
  );
}
