import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword, signAdminToken, SESSION_COOKIE, SESSION_TTL_S } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let password: string;
  try {
    const body = await req.json() as Record<string, unknown>;
    password = String(body.password ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const valid = await verifyAdminPassword(password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = await signAdminToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL_S,
    path: "/",
  });
  return res;
}
