import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAdminToken, SESSION_COOKIE } from "@/lib/admin-auth-edge";

export async function requireAdmin(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
