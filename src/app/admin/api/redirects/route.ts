import { NextRequest, NextResponse } from "next/server";
import { listRedirects, createRedirect } from "@/lib/admin-db";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const redirects = await listRedirects();
  return NextResponse.json(redirects);
}

export async function POST(req: NextRequest) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const body = await req.json() as Record<string, string>;
  let { from_path, to_path } = body;

  if (!from_path || !to_path) {
    return NextResponse.json({ error: "from_path and to_path required" }, { status: 400 });
  }

  if (!from_path.startsWith("/")) from_path = `/${from_path}`;
  if (!to_path.startsWith("/") && !to_path.startsWith("http")) to_path = `/${to_path}`;

  if (from_path === to_path) {
    return NextResponse.json({ error: "from and to cannot be the same path" }, { status: 400 });
  }

  await createRedirect(from_path, to_path);
  return NextResponse.json({ ok: true });
}
