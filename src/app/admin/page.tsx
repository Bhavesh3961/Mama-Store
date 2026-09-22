import React from "react";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { getDashboardStats } from "@/lib/db/queries";
import { formatInr } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const stats = getDashboardStats();

  return (
    <>
      <header className="adm-topbar">
        <div>
          <h1 className="adm-topbar-title">Dashboard Overview</h1>
          <p style={{ color: "var(--adm-muted)", fontSize: "0.85rem", margin: "4px 0 0" }}>
            Real-time performance and inventory tracking for Mama Store Pali
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/admin/products" className="adm-btn-primary">
            <span>+ Add Product</span>
          </Link>
        </div>
      </header>

      <div className="adm-content">
        {/* Metric Cards */}
        <div className="adm-grid-stats">
          <div className="adm-stat-card">
            <span className="adm-stat-label">Total Revenue</span>
            <span className="adm-stat-value">{formatInr(stats.totalRevenue)}</span>
            <span className="adm-stat-sub">From all confirmed/delivered orders</span>
          </div>

          <div className="adm-stat-card">
            <span className="adm-stat-label">Total Orders</span>
            <span className="adm-stat-value">{stats.totalOrders}</span>
            <span className="adm-stat-sub">Lifetime orders placed</span>
          </div>

          <div className="adm-stat-card">
            <span className="adm-stat-label">Pending Orders</span>
            <span className="adm-stat-value" style={{ color: stats.pendingOrders > 0 ? "#facc15" : "var(--adm-text)" }}>
              {stats.pendingOrders}
            </span>
            <span className="adm-stat-sub">Awaiting confirmation or dispatch</span>
          </div>

          <div className="adm-stat-card">
            <span className="adm-stat-label">Active Products</span>
            <span className="adm-stat-value">{stats.totalProducts}</span>
            <span className="adm-stat-sub">Listed in customer catalogue</span>
          </div>
        </div>

        {/* Low Stock Warning Banner if any */}
        {stats.lowStockProducts.length > 0 && (
          <div
            style={{
              padding: "16px 20px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              borderRadius: "12px",
              marginBottom: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <strong style={{ color: "#f87171", fontSize: "0.95rem" }}>
                ⚠️ Low Stock Alert ({stats.lowStockProducts.length} items with &le; 5 units)
              </strong>
              <p style={{ margin: "4px 0 0", color: "var(--adm-muted)", fontSize: "0.85rem" }}>
                {stats.lowStockProducts.map((p) => `${p.name} (${p.stock} left)`).slice(0, 3).join(", ")}
                {stats.lowStockProducts.length > 3 ? "..." : ""}
              </p>
            </div>
            <Link href="/admin/products" className="adm-btn-secondary" style={{ width: "auto" }}>
              Update Stock →
            </Link>
          </div>
        )}

        {/* Recent Orders Card */}
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">Recent Customer Orders</h2>
              <p style={{ margin: "4px 0 0", color: "var(--adm-muted)", fontSize: "0.85rem" }}>
                Latest orders requiring attention
              </p>
            </div>
            <Link href="/admin/orders" className="adm-btn-secondary" style={{ width: "auto" }}>
              View All Orders →
            </Link>
          </div>

          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Placed At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "32px", color: "var(--adm-muted)" }}>
                      No orders placed yet. Orders will appear here as soon as customers checkout.
                    </td>
                  </tr>
                ) : (
                  stats.recentOrders.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <strong style={{ color: "var(--adm-gold)", fontFamily: "monospace" }}>
                          {o.id}
                        </strong>
                      </td>
                      <td>{o.customer_name}</td>
                      <td>{o.customer_phone}</td>
                      <td>
                        <strong>{formatInr(o.total)}</strong>
                      </td>
                      <td>
                        <span style={{ textTransform: "uppercase", fontSize: "0.8rem", color: "var(--adm-muted)" }}>
                          {o.payment_method}
                        </span>
                      </td>
                      <td>
                        <span className={`adm-badge adm-badge-${o.status.toLowerCase()}`}>
                          {o.status}
                        </span>
                      </td>
                      <td style={{ color: "var(--adm-muted)", fontSize: "0.85rem" }}>
                        {new Date(o.created_at).toLocaleString("en-IN", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td>
                        <Link
                          href={`/admin/orders?q=${o.id}`}
                          className="adm-btn-secondary"
                          style={{ padding: "4px 10px", fontSize: "0.8rem", width: "auto" }}
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
