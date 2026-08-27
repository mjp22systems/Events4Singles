import { NextResponse } from "next/server";
import { getD1 } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Ctx) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { id } = await params;
  const db = await getD1();
  await db.prepare("DELETE FROM integrations WHERE id = ?").bind(id).run();
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request, ctx: Ctx) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const fd = await req.formData();
  const method = fd.get("_method");

  if (method === "DELETE") {
    await DELETE(req, ctx);
    return NextResponse.redirect(new URL("/admin/integrations", req.url));
  }

  if (method === "PATCH") {
    const { id } = await ctx.params;
    const db = await getD1();
    const field = fd.get("field");
    const value = fd.get("value");
    if (field === "auto_approve" || field === "push_enabled") {
      await db.prepare(
        `UPDATE integrations SET ${field} = ?, updated_at = datetime('now') WHERE id = ?`
      ).bind(value === "1" ? 1 : 0, id).run();
    }
    return NextResponse.redirect(new URL("/admin/integrations", req.url));
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
