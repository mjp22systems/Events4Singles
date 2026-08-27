import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getAccount } from "@/lib/portal-db";
import { deletePortalEvent, updatePortalEventFromBody } from "@/lib/portal-events";

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
  await updatePortalEventFromBody(account, id, body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const account = await requireAccount();
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const result = await deletePortalEvent(account, id);
  if (!result.ok) return NextResponse.json({ error: result.message }, { status: 409 });
  return NextResponse.json({ ok: true });
}
