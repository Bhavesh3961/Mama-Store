"use client";

import React, { useState } from "react";
import type { DbCategoryRow } from "@/lib/db/types";

export function CategoryManager({
  initialCategories,
}: {
  initialCategories: DbCategoryRow[];
}) {
  const [categories, setCategories] = useState<DbCategoryRow[]>(initialCategories);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<DbCategoryRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    tone: "#f5efe6",
  });

  const filtered = categories.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q);
  });

  function openAddModal() {
    setEditingCat(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      tone: "#eadfd4",
    });
    setError(null);
    setIsModalOpen(true);
  }

  function openEditModal(c: DbCategoryRow) {
    setEditingCat(c);
    setFormData({
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      tone: c.tone || "#eadfd4",
    });
    setError(null);
    setIsModalOpen(true);
  }

  async function handleDelete(c: DbCategoryRow) {
    if (
      !confirm(
        `Are you sure you want to delete category "${c.name}"? It will be removed from the customer filters and category list.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/categories/${c.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCategories((prev) => prev.filter((item) => item.id !== c.id));
      } else {
        alert("Failed to delete category");
      }
    } catch {
      alert("Network error deleting category");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (editingCat) {
        const res = await fetch(`/api/admin/categories/${editingCat.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to update category");
        }

        setCategories((prev) =>
          prev.map((c) => (c.id === editingCat.id ? { ...c, ...data.category } : c))
        );
        setIsModalOpen(false);
      } else {
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to create category");
        }

        setCategories((prev) => [...prev, data.category]);
        setIsModalOpen(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving category");
    } finally {
      setLoading(false);
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
        <input
          type="text"
          className="adm-input"
          placeholder="Search categories…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "320px" }}
        />

        <button type="button" className="adm-btn-primary" onClick={openAddModal}>
          <span>+ Add New Category</span>
        </button>
      </div>

      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <h2 className="adm-card-title">Store Departments & Categories</h2>
            <p style={{ margin: "4px 0 0", color: "var(--adm-muted)", fontSize: "0.85rem" }}>
              Categories created here immediately appear on the storefront navigation and filters
            </p>
          </div>
        </div>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Color Tone</th>
                <th>Category Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "var(--adm-muted)" }}>
                    No categories found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: c.tone || "#eadfd4",
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                      />
                    </td>
                    <td>
                      <strong style={{ fontSize: "1rem" }}>{c.name}</strong>
                    </td>
                    <td>
                      <code style={{ color: "var(--adm-gold)", fontSize: "0.85rem" }}>{c.slug}</code>
                    </td>
                    <td style={{ color: "var(--adm-muted)", maxWidth: "300px" }}>
                      {c.description || "—"}
                    </td>
                    <td>
                      <span className="adm-badge adm-badge-confirmed">
                        {c.product_count ?? 0} listed
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          className="adm-btn-secondary"
                          style={{ padding: "5px 12px", fontSize: "0.85rem", width: "auto" }}
                          onClick={() => openEditModal(c)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="adm-btn-danger"
                          onClick={() => handleDelete(c)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="adm-modal-overlay" onClick={() => !loading && setIsModalOpen(false)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "480px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ fontSize: "1.25rem", margin: 0 }}>
                {editingCat ? `Edit "${editingCat.name}"` : "Add New Category"}
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

            <form onSubmit={handleSubmit}>
              <div className="adm-form-group">
                <label className="adm-form-label">Category Name *</label>
                <input
                  type="text"
                  className="adm-input"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Herbal Cleansers"
                  autoFocus
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label">URL Slug (optional)</label>
                <input
                  type="text"
                  className="adm-input"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. herbal-cleansers"
                />
                <p style={{ margin: "4px 0 0", color: "var(--adm-muted)", fontSize: "0.8rem" }}>
                  Leave empty to auto-generate from category name.
                </p>
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label">Description</label>
                <textarea
                  className="adm-textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short tagline shown under category heading..."
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label">Accent Color Tone</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={formData.tone}
                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                    style={{
                      width: "48px",
                      height: "38px",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      background: "transparent",
                    }}
                  />
                  <input
                    type="text"
                    className="adm-input"
                    value={formData.tone}
                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                    placeholder="#f5efe6"
                    style={{ maxWidth: "140px" }}
                  />
                </div>
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
                    marginBottom: "16px",
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                <button
                  type="button"
                  className="adm-btn-secondary"
                  style={{ width: "auto" }}
                  onClick={() => setIsModalOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className="adm-btn-primary" disabled={loading}>
                  {loading ? "Saving…" : editingCat ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
