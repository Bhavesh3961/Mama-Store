import { NextRequest, NextResponse } from "next/server";
import {
  createAdminSession,
  verifyAdminCredentials,
  checkRateLimit,
} from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    const rateCheck = checkRateLimit(`admin_login_${ip}`, 5, 5 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: `Too many login attempts. Please wait ${rateCheck.retryAfterSec} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const username = String(body.username || "").trim();
    const password = String(body.password || "");

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const isValid = verifyAdminCredentials(username, password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    await createAdminSession(username);

    return NextResponse.json({ success: true, username });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
