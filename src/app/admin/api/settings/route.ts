import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { requireAdmin } from "@/lib/require-admin";

const ALLOWED_KEYS = ["notification_email", "subscribe_from_name", "subscribe_from_email"];

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { env } = await getCloudflareContext({ async: true });
  const rows = await env.DB.prepare("SELECT key, value FROM site_settings").all();
  const settings: Record<string, string> = {};
  for (const row of rows.results as { key: string; value: string }[]) {
    settings[row.key] = row.value;
  }
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const body: Record<string, string> = await req.json();
  const { env } = await getCloudflareContext({ async: true });

  for (const [key, value] of Object.entries(body)) {
    if (!ALLOWED_KEYS.includes(key)) continue;
    await env.DB.prepare(
      "INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at"
    ).bind(key, String(value)).run();
  }

  return NextResponse.json({ ok: true });
}
