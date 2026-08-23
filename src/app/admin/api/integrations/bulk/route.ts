import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getIntegrationById, logActivity } from "@/lib/admin-db";
import { requireAdmin } from "@/lib/require-admin";
import { runSync } from "@/lib/sync-engine";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const data = await req.formData();
  const action = String(data.get("action") ?? "");
  const ids = data.getAll("ids").map(String).filter(Boolean);
  const redirectTo = String(data.get("redirect") ?? "/admin/integrations");
  const { env } = await getCloudflareContext({ async: true });

  for (const id of ids) {
    if (action === "sync") {
      const integration = await getIntegrationById(id);
      if (integration) {
        await runSync(integration, env.DB);
        await logActivity("integration.bulk_sync", "integration", id);
      }
    }

    if (action === "auto_approve_on" || action === "auto_approve_off") {
      await env.DB
        .prepare("UPDATE integrations SET auto_approve = ?, updated_at = datetime('now') WHERE id = ?")
        .bind(action === "auto_approve_on" ? 1 : 0, id)
        .run();
      await logActivity("integration.bulk_update", "integration", id, { auto_approve: action === "auto_approve_on" ? 1 : 0 });
    }

    if (action === "push_on" || action === "push_off") {
      await env.DB
        .prepare("UPDATE integrations SET push_enabled = ?, updated_at = datetime('now') WHERE id = ?")
        .bind(action === "push_on" ? 1 : 0, id)
        .run();
      await logActivity("integration.bulk_update", "integration", id, { push_enabled: action === "push_on" ? 1 : 0 });
    }

    if (action === "disconnect") {
      await env.DB.prepare("DELETE FROM integrations WHERE id = ?").bind(id).run();
      await logActivity("integration.bulk_delete", "integration", id);
    }
  }

  return NextResponse.redirect(new URL(redirectTo, req.url));
}
