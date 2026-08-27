import { NextResponse } from "next/server";
import { getD1 } from "@/lib/db";
import { getIntegrationById } from "@/lib/admin-db";
import { requireAdmin } from "@/lib/require-admin";
import { runSync } from "@/lib/sync-engine";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Ctx) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { id } = await params;
  const integration = await getIntegrationById(id);
  if (!integration) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const db = await getD1();
  await runSync(integration, db);
  return NextResponse.redirect(new URL("/admin/integrations", req.url));
}
