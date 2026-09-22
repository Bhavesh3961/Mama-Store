"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Invalid username or password.");
        setLoading(false);
        return;
      }

      router.push(from);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "radial-gradient(ellipse at top, #1e2230 0%, #0e1117 80%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "var(--adm-surface)",
          border: "1px solid var(--adm-border)",
          borderRadius: "16px",
          padding: "36px 32px",
          boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <span style={{ fontSize: "2rem" }}>✨</span>
          <h1
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "var(--adm-text)",
              margin: "10px 0 4px",
              letterSpacing: "0.02em",
            }}
          >
            MAMA STORE
          </h1>
          <p style={{ color: "var(--adm-muted)", fontSize: "0.9rem", margin: 0 }}>
            Secure Admin & Inventory Portal
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="adm-form-group">
            <label className="adm-form-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="adm-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              required
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="adm-form-group">
            <label className="adm-form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="adm-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div
              style={{
                padding: "10px 14px",
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                color: "#f87171",
                fontSize: "0.85rem",
                marginBottom: "18px",
              }}
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="adm-btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "1rem" }}
            disabled={loading}
          >
            {loading ? "Authenticating…" : "Sign In to Admin Panel"}
          </button>

          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Link
              href="/"
              style={{
                color: "var(--adm-muted)",
                fontSize: "0.85rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              ← Back to Customer Website
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="adm-shell" />}>
      <LoginForm />
    </Suspense>
  );
}
