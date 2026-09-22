"use client";

import React, { useState } from "react";
import { formatInr, whatsappHref } from "@/lib/format";
import type { OrderWithItems, OrderStatus } from "@/lib/db/types";

const ALL_STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export function OrderManager({ initialOrders }: { initialOrders: OrderWithItems[] }) {
  const [orders, setOrders] = useState<OrderWithItems[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    if (statusFilter !== "All" && o.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchName = o.customer_name.toLowerCase().includes(q);
      const matchPhone = o.customer_phone.includes(q);
      if (!matchId && !matchName && !matchPhone) return false;
    }
    return true;
  });

  async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok && data.order) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } else {
        alert(data.error || "Failed to update order status");
      }
    } catch {
      alert("Network error updating order status");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", gap: "12px", flex: 1, minWidth: "280px" }}>
          <input
            type="text"
            className="adm-input"
            placeholder="Search by Order ID, customer name or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: "380px" }}
          />

          <select
            className="adm-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ maxWidth: "180px" }}
          >
            <option value="All">All Statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div style={{ color: "var(--adm-muted)", fontSize: "0.9rem" }}>
          Total Orders: <strong style={{ color: "var(--adm-text)" }}>{filtered.length}</strong>
        </div>
      </div>

      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <h2 className="adm-card-title">Customer Orders</h2>
            <p style={{ margin: "4px 0 0", color: "var(--adm-muted)", fontSize: "0.85rem" }}>
              Click on any order to view delivery address and item breakdown
            </p>
          </div>
        </div>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>City</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "40px", color: "var(--adm-muted)" }}>
                    No orders found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <strong
                        style={{
                          color: "var(--adm-gold)",
                          fontFamily: "monospace",
                          fontSize: "0.95rem",
                        }}
                      >
                        {o.id}
                      </strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{o.customer_name}</div>
                      {o.customer_email && (
                        <div style={{ fontSize: "0.8rem", color: "var(--adm-muted)" }}>
                          {o.customer_email}
                        </div>
                      )}
                    </td>
                    <td>
                      <a
                        href={`tel:${o.customer_phone}`}
                        style={{ color: "var(--adm-blue)", textDecoration: "none" }}
                      >
                        {o.customer_phone}
                      </a>
                    </td>
                    <td>{o.city}</td>
                    <td>{o.items.reduce((sum, item) => sum + item.quantity, 0)} items</td>
                    <td>
                      <strong style={{ fontSize: "1rem" }}>{formatInr(o.total)}</strong>
                    </td>
                    <td>
                      <span style={{ textTransform: "uppercase", fontSize: "0.8rem", color: "var(--adm-muted)" }}>
                        {o.payment_method}
                      </span>
                    </td>
                    <td>
                      <select
                        className="adm-select"
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                        disabled={updatingId === o.id}
                        style={{
                          padding: "4px 8px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          width: "auto",
                          borderRadius: "6px",
                          background:
                            o.status === "Delivered"
                              ? "rgba(16, 185, 129, 0.2)"
                              : o.status === "Cancelled"
                              ? "rgba(239, 68, 68, 0.2)"
                              : o.status === "Shipped"
                              ? "rgba(99, 102, 241, 0.2)"
                              : "rgba(234, 179, 8, 0.2)",
                          color:
                            o.status === "Delivered"
                              ? "#34d399"
                              : o.status === "Cancelled"
                              ? "#f87171"
                              : o.status === "Shipped"
                              ? "#818cf8"
                              : "#facc15",
                        }}
                      >
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="adm-btn-secondary"
                        style={{ padding: "5px 12px", fontSize: "0.85rem", width: "auto" }}
                        onClick={() => setSelectedOrder(o)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="adm-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "680px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: "16px",
                borderBottom: "1px solid var(--adm-border)",
                marginBottom: "20px",
              }}
            >
              <div>
                <span className="adm-brand-badge">Order Details</span>
                <h2 style={{ fontSize: "1.4rem", margin: "6px 0 0", color: "var(--adm-gold)" }}>
                  {selectedOrder.id}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--adm-muted)",
                  fontSize: "1.3rem",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {/* Customer & Address Details */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                background: "rgba(0,0,0,0.25)",
                padding: "16px",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            >
              <div>
                <span className="adm-stat-label">Customer Information</span>
                <div style={{ fontWeight: 600, fontSize: "1rem", marginTop: "4px" }}>
                  {selectedOrder.customer_name}
                </div>
                <div style={{ color: "var(--adm-muted)", fontSize: "0.85rem", marginTop: "2px" }}>
                  Phone: <strong>{selectedOrder.customer_phone}</strong>
                </div>
                {selectedOrder.customer_email && (
                  <div style={{ color: "var(--adm-muted)", fontSize: "0.85rem" }}>
                    Email: {selectedOrder.customer_email}
                  </div>
                )}
              </div>

              <div>
                <span className="adm-stat-label">Delivery Address</span>
                <div style={{ fontSize: "0.9rem", marginTop: "4px", lineHeight: 1.4 }}>
                  {selectedOrder.address}
                  <br />
                  {selectedOrder.city}, {selectedOrder.state} {selectedOrder.pincode}
                </div>
              </div>
            </div>

            {selectedOrder.notes && (
              <div
                style={{
                  padding: "12px 16px",
                  background: "rgba(229, 169, 60, 0.08)",
                  border: "1px solid rgba(229, 169, 60, 0.2)",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  marginBottom: "20px",
                }}
              >
                <strong style={{ color: "var(--adm-gold)" }}>Customer Note:</strong>{" "}
                {selectedOrder.notes}
              </div>
            )}

            {/* Order Items Table */}
            <h3 style={{ fontSize: "1rem", marginBottom: "12px" }}>Ordered Items</h3>
            <div className="adm-table-wrap" style={{ marginBottom: "20px" }}>
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((it) => (
                    <tr key={it.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{it.product_name}</div>
                        {it.variant_name && (
                          <div style={{ fontSize: "0.8rem", color: "var(--adm-muted)" }}>
                            Variant: {it.variant_name}
                          </div>
                        )}
                      </td>
                      <td>{it.quantity}</td>
                      <td>{formatInr(it.unit_price)}</td>
                      <td>
                        <strong>{formatInr(it.total_price)}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                borderTop: "1px solid var(--adm-border)",
                paddingTop: "16px",
                fontSize: "0.95rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--adm-muted)" }}>Subtotal</span>
                <span>{formatInr(selectedOrder.subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--adm-muted)" }}>Delivery Fee</span>
                <span>{selectedOrder.delivery_fee === 0 ? "Free" : formatInr(selectedOrder.delivery_fee)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "var(--adm-gold)",
                  borderTop: "1px solid var(--adm-border)",
                  paddingTop: "8px",
                }}
              >
                <span>Grand Total</span>
                <span>{formatInr(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Status & Actions */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
                marginTop: "24px",
                paddingTop: "16px",
                borderTop: "1px solid var(--adm-border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--adm-muted)" }}>Update Status:</span>
                <select
                  className="adm-select"
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                  style={{ width: "auto" }}
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <a
                  className="adm-btn-secondary"
                  style={{ width: "auto" }}
                  href={whatsappHref(
                    `Hello ${selectedOrder.customer_name}, regarding your Mama Store order ${selectedOrder.id}...`
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  💬 WhatsApp Customer
                </a>
                <button
                  type="button"
                  className="adm-btn-primary"
                  onClick={() => setSelectedOrder(null)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
