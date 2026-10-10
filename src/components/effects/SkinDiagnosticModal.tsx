"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatInr, whatsappHref } from "@/lib/format";
import { store } from "@/data/store";

interface SkinDiagnosticProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SkinDiagnosticModal({ isOpen, onClose }: SkinDiagnosticProps) {
  const [skinType, setSkinType] = useState<string>("combination");
  const [concern, setConcern] = useState<string>("glow");
  const [step, setStep] = useState<number>(1);

  if (!isOpen) return null;

  const getRecommendation = () => {
    if (concern === "glow") {
      return {
        title: "24K Royal Saffron Radiance Regimen",
        description: "Formulated with pure Kumkumadi extracts and cold-pressed botanicals to restore natural luminosity.",
        products: [
          { name: "Sample Gentle Cleanser", step: "Cleanse", price: 299 },
          { name: "L'Élixir Doré Saffron Serum", step: "Treat", price: 849 },
          { name: "Velvet Dew Barrier Cream", step: "Nourish", price: 499 },
        ],
      };
    }
    if (concern === "hydration") {
      return {
        title: "Pali Rose Deep Moisture Infusion",
        description: "Organic Damask Rose distillate combined with multi-depth hyaluronic acid to flood parched skin with hydration.",
        products: [
          { name: "Sample Foam Face Wash", step: "Cleanse", price: 219 },
          { name: "Pali Rose Dew Mist", step: "Hydrate", price: 349 },
          { name: "Sample Daily Moisturiser", step: "Seal", price: 399 },
        ],
      };
    }
    return {
      title: "Botanical Clarifying & Pore Refining Ritual",
      description: "Gentle herbal actives that balance sebum production while maintaining optimal moisture barrier.",
      products: [
        { name: "Herbal Clarifying Wash", step: "Purify", price: 249 },
        { name: "Niacinamide + Zinc Elixir", step: "Balance", price: 599 },
        { name: "Lightweight Hydro Gel", step: "Hydrate", price: 349 },
      ],
    };
  };

  const rec = getRecommendation();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(28, 22, 20, 0.65)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
      onClick={onClose}
    >
      <div
        className="liquid-glass-container deep"
        style={{
          maxWidth: 580,
          width: "100%",
          padding: "32px 28px",
          borderRadius: 24,
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1px solid var(--line)",
            background: "rgba(255,255,255,0.7)",
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
            fontSize: "1.2rem",
            color: "var(--ink)",
          }}
        >
          ×
        </button>

        <p className="eyebrow">Mama Atelier · Skin Diagnostic</p>
        <h2 style={{ fontSize: "1.8rem", margin: "6px 0 16px" }}>
          Curate Your Custom Beauty Ritual
        </h2>

        {step === 1 ? (
          <div>
            <p className="small muted" style={{ marginBottom: 12 }}>
              Step 1 of 2: Select your primary skin profile
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 20 }}>
              {[
                { id: "dry", label: "Dry & Dehydrated", desc: "Tight feeling, flaky or dull" },
                { id: "oily", label: "Oily & Congested", desc: "Excess shine, visible pores" },
                { id: "combination", label: "Combination", desc: "T-zone shine, normal cheeks" },
                { id: "sensitive", label: "Delicate & Reactive", desc: "Easily flushed or irritated" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSkinType(item.id)}
                  className={`liquid-glass-select ${skinType === item.id ? "active" : ""}`}
                >
                  <strong>{item.label}</strong>
                  <span className="small muted" style={{ display: "block", marginTop: 4 }}>
                    {item.desc}
                  </span>
                </button>
              ))}
            </div>

            <p className="small muted" style={{ marginBottom: 12 }}>
              What is your primary skincare goal?
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
              {[
                { id: "glow", label: "Glass Skin Glow" },
                { id: "hydration", label: "Deep Hydration" },
                { id: "clarity", label: "Blemish Clarity" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setConcern(item.id)}
                  className={`liquid-glass-select ${concern === item.id ? "active" : ""}`}
                >
                  <strong>{item.label}</strong>
                </button>
              ))}
            </div>

            <button className="btn" style={{ width: "100%" }} onClick={() => setStep(2)}>
              Reveal My Customized Ritual →
            </button>
          </div>
        ) : (
          <div>
            <div style={{ background: "rgba(241, 228, 223, 0.45)", padding: 18, borderRadius: 16, marginBottom: 20 }}>
              <p className="eyebrow" style={{ color: "var(--rose)" }}>
                Prescribed For You
              </p>
              <h3 style={{ fontSize: "1.3rem", marginTop: 4 }}>{rec.title}</h3>
              <p className="small muted" style={{ marginTop: 6 }}>
                {rec.description}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
              {rec.products.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(227, 216, 206, 0.6)",
                  }}
                >
                  <div>
                    <span className="eyebrow" style={{ fontSize: "0.65rem" }}>
                      Step {idx + 1}: {p.step}
                    </span>
                    <strong style={{ display: "block", fontSize: "0.95rem" }}>{p.name}</strong>
                  </div>
                  <span style={{ fontWeight: 700, color: "var(--rose)" }}>{formatInr(p.price)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>
                ← Adjust Profile
              </button>
              <a
                className="btn"
                style={{ flex: 1 }}
                href={whatsappHref(
                  `Hello ${store.name}, I took the Skin Diagnostic for ${skinType} skin with a focus on ${concern}. I would like to order the ${rec.title}.`
                )}
                target="_blank"
                rel="noreferrer"
              >
                Order via WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
