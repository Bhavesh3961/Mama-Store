"use client";

import React from "react";
import { motion } from "framer-motion";

export function BoutiqueTrustBar() {
  const pillars = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "100% Authentic Stock",
      subtitle: "Direct authorized salon distributors with sealed barcodes",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Salon Professional",
      subtitle: "Verified formulations trusted by premier beauty studios",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="1" y="3" width="15" height="13" rx="2" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
      title: "Fast Pali Delivery",
      subtitle: "Doorstep delivery in Pali · Free delivery above ₹799",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
      title: "WhatsApp Concierge",
      subtitle: "Direct personalized advice for skin type & shade match",
    },
  ];

  return (
    <section className="boutique-trust-strip shell" aria-label="Boutique Guarantees">
      <div className="boutique-trust-grid">
        {pillars.map((item, idx) => (
          <motion.div
            key={idx}
            className="boutique-trust-card liquid-glass-panel"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
          >
            <div className="trust-icon-box">{item.icon}</div>
            <div className="trust-text-box">
              <h3 className="trust-title">{item.title}</h3>
              <p className="trust-subtitle">{item.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
