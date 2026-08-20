import { NextRequest, NextResponse } from "next/server";
import { createEvent, logActivity } from "@/lib/admin-db";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const body = await req.json() as Record<string, unknown>;
  const { id } = await createEvent(body);
  await logActivity("event.create", "event", id as unknown as number, { title: body.title });
  return NextResponse.json({ id }, { status: 201 });
}
