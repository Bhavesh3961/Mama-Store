import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import {
  getDbProductById,
  updateProduct,
  deleteProduct,
  updateProductStock,
  toggleProductPublished,
} from "@/lib/db/queries";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: Props) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const product = getDbProductById(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function PATCH(req: NextRequest, { params }: Props) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();

    // Specific quick actions
    if (body.action === "toggle_publish") {
      const updated = toggleProductPublished(id);
      return NextResponse.json({ success: true, product: updated });
    }

    if (body.action === "update_stock" && body.stock !== undefined) {
      const updated = updateProductStock(id, Number(body.stock));
      return NextResponse.json({ success: true, product: updated });
    }

    // General update
    const updated = updateProduct(id, {
      name: body.name,
      slug: body.slug,
      brand_id: body.brand_id,
      category_id: body.category_id,
      description: body.description,
      details: body.details,
      ingredients: body.ingredients,
      size: body.size,
      image: body.image,
      mrp: body.mrp !== undefined ? (body.mrp === "" ? null : Number(body.mrp)) : undefined,
      price: body.price !== undefined ? (body.price === "" ? null : Number(body.price)) : undefined,
      stock: body.stock !== undefined ? Number(body.stock) : undefined,
      is_new: body.is_new !== undefined ? Boolean(body.is_new) : undefined,
      is_bestseller: body.is_bestseller !== undefined ? Boolean(body.is_bestseller) : undefined,
      published: body.published !== undefined ? Boolean(body.published) : undefined,
      gallery: Array.isArray(body.gallery) ? body.gallery : undefined,
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update product.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  deleteProduct(id);
  return NextResponse.json({ success: true });
}
