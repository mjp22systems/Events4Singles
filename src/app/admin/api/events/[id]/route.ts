import { NextRequest, NextResponse } from "next/server";
import { getEventById, updateEvent, deleteEvent, logActivity } from "@/lib/admin-db";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(event);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json() as Record<string, unknown>;
  await updateEvent(id, body);
  await logActivity("event.update", "event", id as unknown as number, { fields: Object.keys(body) });
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) return PUT(req, ctx);

  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { id } = await ctx.params;
  const event = await getEventById(id);
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const fd = await req.formData();
  const action = fd.get("action");

  if (action === "delete") {
    await deleteEvent(id);
    await logActivity("event.delete", "event", id as unknown as number, { title: event.title });
  } else {
    const status = fd.get("status");
    if (typeof status === "string") {
      await updateEvent(id, { status });
      await logActivity("event.quick_update", "event", id as unknown as number, { status });
    }
  }

  const redirectTo = typeof fd.get("redirect") === "string" ? String(fd.get("redirect")) : "/admin/events";
  return NextResponse.redirect(new URL(redirectTo, req.url));
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await deleteEvent(id);
  await logActivity("event.delete", "event", id as unknown as number, { title: event.title });
  return NextResponse.json({ ok: true });
}
