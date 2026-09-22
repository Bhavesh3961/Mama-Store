import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { updateCategory, deleteCategory } from "@/lib/db/queries";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: NextRequest, { params }: Props) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const updated = updateCategory(id, {
      name: body.name,
      slug: body.slug,
      description: body.description,
      tone: body.tone,
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update category.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  deleteCategory(id);
  return NextResponse.json({ success: true });
}
