import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { getDashboardStats } from "@/lib/db/queries";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = getDashboardStats();
  return NextResponse.json(stats);
}
