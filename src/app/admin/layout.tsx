import React from "react";
import type { Metadata } from "next";
import { getAdminSession } from "@/lib/auth/session";
import { AdminSidebar } from "./AdminSidebar";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin Panel · Mama Store Pali",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    // If not authenticated, render without sidebar (login page)
    return <div className="adm-shell">{children}</div>;
  }

  return (
    <div className="adm-shell">
      <AdminSidebar username={session.username} />
      <div className="adm-main">{children}</div>
    </div>
  );
}
