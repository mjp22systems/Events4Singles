import { NextResponse } from "next/server";
import { getD1 } from "@/lib/db";
import { listRunnableIntegrations } from "@/lib/admin-db";
import { requireAdmin } from "@/lib/require-admin";
import { runSync } from "@/lib/sync-engine";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const db = await getD1();
  const integrations = await listRunnableIntegrations();
  for (const integration of integrations.slice(0, 10)) {
    await runSync(integration, db);
  }
  return NextResponse.redirect(new URL("/admin/integrations", req.url));
}
