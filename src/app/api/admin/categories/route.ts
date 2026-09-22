import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { getDbCategories, createCategory } from "@/lib/db/queries";

export async function GET() {
  const categories = getDbCategories();
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const created = createCategory({
      name: body.name,
      slug: body.slug,
      description: body.description,
      tone: body.tone,
    });

    return NextResponse.json({ success: true, category: created }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create category.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
