"use client";

import React from "react";
import Link from "next/link";
import { store } from "@/data/store";

export function SiteFooter() {
  return (
    <footer className="minimal-site-footer" role="contentinfo">
      <div className="shell minimal-footer-inner">
        <p className="minimal-footer-copy">
          © {new Date().getFullYear()} {store.name} Pali · 100% Genuine Stock Direct from Authorized Distributors
        </p>
        <div className="minimal-footer-meta">
          <span>{store.address}</span>
          <span className="minimal-footer-dot">•</span>
          <span>Open 10 AM – 9:30 PM</span>
        </div>
      </div>
    </footer>
  );
}
