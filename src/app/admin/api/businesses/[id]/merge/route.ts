import { NextRequest, NextResponse } from "next/server";
import { getBusinessById, mergeBusiness, logActivity } from "@/lib/admin-db";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const sourceId = Number(id);
  const body = await req.json() as Record<string, unknown>;
  const targetId = Number(body.targetId);

  if (!targetId || targetId === sourceId) {
    return NextResponse.json({ error: "Invalid targetId" }, { status: 400 });
  }

  const source = await getBusinessById(sourceId);
  const target = await getBusinessById(targetId);
  if (!source || !target) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await mergeBusiness(sourceId, targetId);
  await logActivity("business.merge", "business", sourceId, {
    sourceId,
    sourceName: source.name,
    targetId,
    targetName: target.name,
  });
  return NextResponse.json({ ok: true });
}
