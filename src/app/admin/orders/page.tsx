import React from "react";
import { getAdminSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { getAllOrders } from "@/lib/db/queries";
import { OrderManager } from "./OrderManager";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const orders = getAllOrders();

  return (
    <>
      <header className="adm-topbar">
        <div>
          <h1 className="adm-topbar-title">Order Processing & Fulfillment</h1>
          <p style={{ color: "var(--adm-muted)", fontSize: "0.85rem", margin: "4px 0 0" }}>
            Track, verify, and update delivery statuses for customer orders
          </p>
        </div>
      </header>

      <div className="adm-content">
        <OrderManager initialOrders={orders} />
      </div>
    </>
  );
}
