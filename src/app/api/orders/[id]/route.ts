import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/lib/db/queries";
import { getAdminSession, verifyToken } from "@/lib/auth/session";
import { cookies } from "next/headers";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();

    // Check if requester is admin
    const admin = await getAdminSession();

    // Check if requester has guest order token for this specific order
    const guestCookie = cookieStore.get(`mama_order_token_${id}`)?.value;
    const guestPayload = guestCookie ? verifyToken(guestCookie) : null;
    const isAuthorizedGuest = guestPayload && guestPayload.orderId === id;

    if (!admin && !isAuthorizedGuest) {
      return NextResponse.json(
        { error: "Access denied or order not found." },
        { status: 403 }
      );
    }

    const order = getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load order.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
