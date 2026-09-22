"use client";

import React, { useState } from "react";
import Image from "next/image";
import { formatInr } from "@/lib/format";
import type { DbProductRow, DbCategoryRow } from "@/lib/db/types";

export function ProductManager({
  initialProducts,
  categories,
}: {
  initialProducts: DbProductRow[];
  categories: DbCategoryRow[];
}) {
  const [products, setProducts] = useState<DbProductRow[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "unpublished" | "low_stock">("all");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DbProductRow | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category_id: categories[0]?.id || "",
    description: "",
    details: "",
    size: "",
    image: "",
    price: "",
    mrp: "",
    stock: "20",
    published: true,
  });

  const filtered = products.filter((p) => {
    if (search) {
      const q = search.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    if (selectedCat && p.category_id !== selectedCat) return false;
    if (filterStatus === "published" && !p.published) return false;
    if (filterStatus === "unpublished" && p.published) return false;
    if (filterStatus === "low_stock" && p.stock > 5) return false;
    return true;
  });

  function openAddModal() {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      category_id: categories[0]?.id || "",
      description: "",
      details: "",
      size: "50 ml",
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
      price: "499",
      mrp: "699",
      stock: "25",
      published: true,
    });
    setModalError(null);
    setIsModalOpen(true);
  }

  function openEditModal(p: DbProductRow) {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      slug: p.slug,
      category_id: p.category_id || categories[0]?.id || "",
      description: p.description || "",
      details: p.details || "",
      size: p.size || "",
      image: p.image || "",
      price: p.price != null ? String(p.price) : "",
      mrp: p.mrp != null ? String(p.mrp) : "",
      stock: String(p.stock),
      published: Boolean(p.published),
    });
    setModalError(null);
    setIsModalOpen(true);
  }

  async function handleTogglePublish(p: DbProductRow) {
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_publish" }),
      });
      const data = await res.json();
      if (res.ok && data.product) {
        setProducts((prev) => prev.map((item) => (item.id === p.id ? data.product : item)));
      }
    } catch {
      alert("Failed to toggle publish status");
    }
  }

  async function handleQuickStock(p: DbProductRow, newStock: number) {
    if (newStock < 0) return;
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_stock", stock: newStock }),
      });
      const data = await res.json();
      if (res.ok && data.product) {
        setProducts((prev) => prev.map((item) => (item.id === p.id ? data.product : item)));
      }
    } catch {
      alert("Failed to update stock");
    }
  }

  async function handleDelete(p: DbProductRow) {
    if (!confirm(`Are you sure you want to archive "${p.name}"? It will be removed from the customer website.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((item) => item.id !== p.id));
      }
    } catch {
      alert("Failed to archive product");
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setModalError(null);
    setModalLoading(true);

    try {
      if (editingProduct) {
        // Update
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            slug: formData.slug || undefined,
            category_id: formData.category_id,
            description: formData.description,
            details: formData.details,
            size: formData.size,
            image: formData.image,
            price: formData.price !== "" ? Number(formData.price) : null,
            mrp: formData.mrp !== "" ? Number(formData.mrp) : null,
            stock: Number(formData.stock),
            published: formData.published,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to update product");
        }

        setProducts((prev) =>
          prev.map((item) => (item.id === editingProduct.id ? data.product : item))
        );
        setIsModalOpen(false);
      } else {
        // Create
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            slug: formData.slug || undefined,
            category_id: formData.category_id,
            description: formData.description,
            details: formData.details,
            size: formData.size,
            image: formData.image,
            price: formData.price !== "" ? Number(formData.price) : null,
            mrp: formData.mrp !== "" ? Number(formData.mrp) : null,
            stock: Number(formData.stock),
            published: formData.published,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to create product");
        }

        setProducts((prev) => [data.product, ...prev]);
        setIsModalOpen(false);
      }
    } catch (err: unknown) {
      setModalError(err instanceof Error ? err.message : "Error saving product");
    } finally {
      setModalLoading(false);
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
            placeholder="Search products by name or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: "360px" }}
          />
          <select
            className="adm-select"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            style={{ maxWidth: "200px" }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            className="adm-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            style={{ maxWidth: "160px" }}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="unpublished">Draft / Unpublished</option>
            <option value="low_stock">Low Stock (&le; 5)</option>
          </select>
        </div>

        <button type="button" className="adm-btn-primary" onClick={openAddModal}>
          <span>+ Add New Product</span>
        </button>
      </div>

      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <h2 className="adm-card-title">
              Product Catalogue ({filtered.length} {filtered.length === 1 ? "item" : "items"})
            </h2>
            <p style={{ margin: "4px 0 0", color: "var(--adm-muted)", fontSize: "0.85rem" }}>
              Changes made here immediately synchronize with the customer storefront.
            </p>
          </div>
        </div>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Selling Price</th>
                <th>MRP</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "var(--adm-muted)" }}>
                    No products match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const cat = categories.find((c) => c.id === p.category_id);
                  const isLowStock = p.stock <= 5;

                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div
                            style={{
                              width: "44px",
                              height: "44px",
                              borderRadius: "8px",
                              overflow: "hidden",
                              background: "#242b38",
                              position: "relative",
                              flexShrink: 0,
                            }}
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=100&q=80";
                              }}
                            />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: "var(--adm-text)" }}>{p.name}</div>
                            <div style={{ fontSize: "0.8rem", color: "var(--adm-muted)" }}>
                              {p.size ? `${p.size} · ` : ""}
                              <span style={{ fontFamily: "monospace" }}>{p.slug}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "6px",
                            fontSize: "0.8rem",
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid var(--adm-border)",
                          }}
                        >
                          {cat?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: "var(--adm-gold)", fontSize: "1rem" }}>
                          {p.price != null ? formatInr(p.price) : "Enquiry"}
                        </strong>
                      </td>
                      <td style={{ color: "var(--adm-muted)", textDecoration: "line-through" }}>
                        {p.mrp != null ? formatInr(p.mrp) : "—"}
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={() => handleQuickStock(p, p.stock - 1)}
                            disabled={p.stock <= 0}
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "4px",
                              border: "1px solid var(--adm-border)",
                              background: "var(--adm-surface-hover)",
                              color: "var(--adm-text)",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            title="Decrease stock"
                          >
                            -
                          </button>
                          <span
                            style={{
                              fontWeight: 700,
                              minWidth: "28px",
                              textAlign: "center",
                              color: isLowStock ? "#f87171" : "var(--adm-text)",
                            }}
                          >
                            {p.stock}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuickStock(p, p.stock + 1)}
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "4px",
                              border: "1px solid var(--adm-border)",
                              background: "var(--adm-surface-hover)",
                              color: "var(--adm-text)",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            title="Increase stock"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(p)}
                          className={`adm-badge ${
                            p.published ? "adm-badge-delivered" : "adm-badge-cancelled"
                          }`}
                          style={{ cursor: "pointer", border: "none" }}
                          title="Click to toggle publish status"
                        >
                          {p.published ? "● Published" : "○ Draft / Hidden"}
                        </button>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            type="button"
                            className="adm-btn-secondary"
                            style={{ padding: "5px 10px", fontSize: "0.8rem", width: "auto" }}
                            onClick={() => openEditModal(p)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="adm-btn-danger"
                            onClick={() => handleDelete(p)}
                          >
                            Archive
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="adm-modal-overlay" onClick={() => !modalLoading && setIsModalOpen(false)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ fontSize: "1.3rem", margin: 0 }}>
                {editingProduct ? `Edit "${editingProduct.name}"` : "Add New Cosmetic Product"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--adm-muted)",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="adm-form-group">
                <label className="adm-form-label">Product Name *</label>
                <input
                  type="text"
                  className="adm-input"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. L'Oréal Paris Revitalift Serum"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="adm-form-group">
                  <label className="adm-form-label">Category *</label>
                  <select
                    className="adm-select"
                    required
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Size / Volume</label>
                  <input
                    type="text"
                    className="adm-input"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="e.g. 50 ml, 100 g"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <div className="adm-form-group">
                  <label className="adm-form-label">Selling Price (₹) *</label>
                  <input
                    type="number"
                    className="adm-input"
                    required
                    min="0"
                    step="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 449"
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">MRP (₹)</label>
                  <input
                    type="number"
                    className="adm-input"
                    min="0"
                    step="1"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    placeholder="e.g. 599"
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Stock Units *</label>
                  <input
                    type="number"
                    className="adm-input"
                    required
                    min="0"
                    step="1"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="e.g. 20"
                  />
                </div>
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label">Image URL *</label>
                <input
                  type="text"
                  className="adm-input"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://... or /filename.jpg"
                />
                <p style={{ margin: "4px 0 0", color: "var(--adm-muted)", fontSize: "0.8rem" }}>
                  Provide an HTTPS image URL or a local file in /public.
                </p>
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label">Short Description</label>
                <textarea
                  className="adm-textarea"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Catchy product summary for catalogue listing..."
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label">Details / Ingredients / Benefits</label>
                <textarea
                  className="adm-textarea"
                  rows={3}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder="Extended clinical benefits, application tips, skin types..."
                />
              </div>

              <div className="adm-form-group" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  id="published_toggle"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  style={{ width: "18px", height: "18px", accentColor: "var(--adm-gold)" }}
                />
                <label htmlFor="published_toggle" style={{ fontSize: "0.95rem", cursor: "pointer" }}>
                  Publish immediately to customer store
                </label>
              </div>

              {modalError && (
                <div
                  style={{
                    padding: "10px 14px",
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "8px",
                    color: "#f87171",
                    fontSize: "0.85rem",
                    marginBottom: "16px",
                  }}
                >
                  {modalError}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                <button
                  type="button"
                  className="adm-btn-secondary"
                  style={{ width: "auto" }}
                  onClick={() => setIsModalOpen(false)}
                  disabled={modalLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="adm-btn-primary" disabled={modalLoading}>
                  {modalLoading ? "Saving…" : editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
