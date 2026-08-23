import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { listRunnableIntegrations } from "@/lib/admin-db";
import { requireAdmin } from "@/lib/require-admin";
import { runSync } from "@/lib/sync-engine";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { env } = await getCloudflareContext({ async: true });
  const integrations = await listRunnableIntegrations();
  for (const integration of integrations.slice(0, 10)) {
    await runSync(integration, env.DB);
  }
  return NextResponse.redirect(new URL("/admin/integrations", req.url));
}
