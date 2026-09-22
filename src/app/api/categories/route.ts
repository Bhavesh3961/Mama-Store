import { NextResponse } from "next/server";
import { getAllCategoriesForCatalog } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = getAllCategoriesForCatalog();
  return NextResponse.json({ categories });
}
