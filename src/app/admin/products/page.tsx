import React from "react";
import { getAdminSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { getDbProducts, getDbCategories } from "@/lib/db/queries";
import { ProductManager } from "./ProductManager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const products = getDbProducts({ includeUnpublished: true, includeArchived: false });
  const categories = getDbCategories();

  return (
    <>
      <header className="adm-topbar">
        <div>
          <h1 className="adm-topbar-title">Product Inventory & Catalogue</h1>
          <p style={{ color: "var(--adm-muted)", fontSize: "0.85rem", margin: "4px 0 0" }}>
            Add, update pricing, manage stock units, and toggle visibility
          </p>
        </div>
      </header>

      <div className="adm-content">
        <ProductManager initialProducts={products} categories={categories} />
      </div>
    </>
  );
}
