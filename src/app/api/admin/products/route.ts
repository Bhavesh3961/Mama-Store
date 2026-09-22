import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { getDbProducts, createProduct } from "@/lib/db/queries";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || undefined;
  const categoryId = searchParams.get("category") || undefined;
  const includeArchived = searchParams.get("archived") === "true";

  const products = getDbProducts({
    query,
    categoryId,
    includeArchived,
    includeUnpublished: true,
  });

  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.name || !body.category_id || !body.image) {
      return NextResponse.json(
        { error: "Product name, category, and image are required." },
        { status: 400 }
      );
    }

    const created = createProduct({
      name: body.name,
      slug: body.slug,
      brand_id: body.brand_id || "br-mama",
      category_id: body.category_id,
      description: body.description || "",
      details: body.details,
      ingredients: body.ingredients,
      size: body.size,
      image: body.image,
      mrp: body.mrp !== undefined && body.mrp !== "" ? Number(body.mrp) : null,
      price: body.price !== undefined && body.price !== "" ? Number(body.price) : null,
      stock: body.stock !== undefined ? Number(body.stock) : 20,
      is_new: Boolean(body.is_new),
      is_bestseller: Boolean(body.is_bestseller),
      published: body.published !== false,
      gallery: Array.isArray(body.gallery) ? body.gallery : [],
    });

    return NextResponse.json({ success: true, product: created }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create product.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
