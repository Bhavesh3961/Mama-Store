import { NextRequest, NextResponse } from "next/server";
import { createOrderWithStockDeduction } from "@/lib/db/queries";
import { checkRateLimit, signToken } from "@/lib/auth/session";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    // Rate limit: max 10 orders per 10 minutes per IP
    const rateCheck = checkRateLimit(`order_create_${ip}`, 10, 10 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: `Too many order requests. Please wait ${rateCheck.retryAfterSec} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();

    if (!body || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Your bag is empty or missing items." },
        { status: 400 }
      );
    }

    // Call atomic transactional checkout
    const order = createOrderWithStockDeduction({
      customer_name: String(body.name || ""),
      customer_phone: String(body.phone || body.mobile || ""),
      customer_email: body.email ? String(body.email) : undefined,
      address: String(body.address || ""),
      city: String(body.city || ""),
      state: String(body.state || "Rajasthan"),
      pincode: String(body.pincode || ""),
      payment_method: body.payment === "upi" ? "upi" : "cod",
      notes: body.notes ? String(body.notes) : undefined,
      items: body.items.map((i: Record<string, unknown>) => ({
        productId: String(i.productId || ""),
        variantId: i.variantId ? String(i.variantId) : undefined,
        variantName: i.variantName ? String(i.variantName) : undefined,
        quantity: Number(i.quantity) || 1,
      })),
    });

    // Generate a guest order token to allow this guest user to view this order
    const orderAccessToken = signToken({
      orderId: order.id,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days
    });

    const cookieStore = await cookies();
    cookieStore.set(`mama_order_token_${order.id}`, orderAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        subtotal: order.subtotal,
        deliveryFee: order.delivery_fee,
        total: order.total,
        status: order.status,
      },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to process order.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
