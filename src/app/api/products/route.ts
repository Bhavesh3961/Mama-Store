import { NextRequest, NextResponse } from "next/server";
import { getAllProductsForCatalog } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const products = getAllProductsForCatalog();
  return NextResponse.json({ products });
}
