import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
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
  const { env } = await getCloudflareContext({ async: true });
  await runSync(integration, env.DB);
  return NextResponse.redirect(new URL("/admin/integrations", req.url));
}
