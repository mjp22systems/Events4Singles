import { NextRequest, NextResponse } from "next/server";
import { getBusinessById, updateBusiness, logActivity } from "@/lib/admin-db";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { id } = await params;
  const business = await getBusinessById(Number(id));
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(business);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { id } = await params;
  const numId = Number(id);
  const business = await getBusinessById(numId);
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json() as Record<string, unknown>;
  const allowed = [
    "name", "description", "logo_url", "website",
    "contact_name", "phone", "mobile", "email",
    "facebook_url", "instagram_url", "tiktok_url", "youtube_url", "linkedin_url",
  ];
  const fields: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) fields[key] = body[key] === "" ? null : body[key];
  }

  await updateBusiness(numId, fields as Parameters<typeof updateBusiness>[1]);
  await logActivity("business.update", "business", numId, { fields: Object.keys(fields) });
  return NextResponse.json({ ok: true });
}
