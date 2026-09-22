import React from "react";
import { getAdminSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { getDbCategories } from "@/lib/db/queries";
import { CategoryManager } from "./CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const categories = getDbCategories();

  return (
    <>
      <header className="adm-topbar">
        <div>
          <h1 className="adm-topbar-title">Category & Department Management</h1>
          <p style={{ color: "var(--adm-muted)", fontSize: "0.85rem", margin: "4px 0 0" }}>
            Add, update names, color tones, and manage storefront categories
          </p>
        </div>
      </header>

      <div className="adm-content">
        <CategoryManager initialCategories={categories} />
      </div>
    </>
  );
}
