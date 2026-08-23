import { currentUser } from "@clerk/nextjs/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";
import { getAccount } from "@/lib/portal-db";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

async function requireAccount() {
  const user = await currentUser();
  if (!user) return null;
  return getAccount(user.id);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const account = await requireAccount();
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json() as Record<string, unknown>;
  const allowed = [
    "title", "description", "starts_at", "ends_at", "venue_name",
    "address", "suburb", "city", "price_min", "price_max", "ticket_url",
    "image_url", "source_url", "registration_mode", "category",
  ];
  const entries = Object.entries(body).filter(([key]) => allowed.includes(key));
  if (!entries.length) return NextResponse.json({ ok: true });

  const { env } = await getCloudflareContext({ async: true });
  const sets = entries.map(([key]) => `${key} = ?`).join(", ");
  await env.DB.prepare(`UPDATE events SET ${sets}, updated_at = datetime('now') WHERE id = ? AND account_id = ?`)
    .bind(...entries.map(([, value]) => value), id, account.id)
    .run();
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const account = await requireAccount();
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { env } = await getCloudflareContext({ async: true });
  const result = await env.DB.prepare("DELETE FROM events WHERE id = ? AND account_id = ? AND status != 'approved'")
    .bind(id, account.id)
    .run();
  if ((result.meta?.changes ?? 0) === 0) {
    return NextResponse.json({ error: "Approved events cannot be deleted from the portal" }, { status: 409 });
  }
  return NextResponse.json({ ok: true });
}
