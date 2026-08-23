import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getAccount } from "@/lib/portal-db";
import type { Integration } from "@/lib/admin-db";
import { runSync } from "@/lib/sync-engine";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Ctx) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const account = await getAccount(user.id);
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { env } = await getCloudflareContext({ async: true });
  const integration = await env.DB.prepare("SELECT * FROM integrations WHERE id = ? AND account_id = ?")
    .bind(id, account.id)
    .first<Integration>();
  if (!integration) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await runSync(integration, env.DB);
  return NextResponse.json({ ok: true });
}
