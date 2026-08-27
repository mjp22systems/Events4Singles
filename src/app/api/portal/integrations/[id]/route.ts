import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { deletePortalIntegration, getAccount, updatePortalIntegration } from "@/lib/portal-db";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

async function requireAccount() {
  const user = await currentUser();
  if (!user) return null;
  return getAccount(user.id);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const account = await requireAccount();
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json() as { push_enabled?: boolean };
  await updatePortalIntegration(account.id, id, {
    ...(body.push_enabled !== undefined ? { push_enabled: body.push_enabled ? 1 : 0 } : {}),
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const account = await requireAccount();
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await deletePortalIntegration(account.id, id);
  return NextResponse.json({ ok: true });
}
