import { NextRequest, NextResponse } from "next/server";
import { getCityBySlug, updateCity, logActivity } from "@/lib/admin-db";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { slug } = await params;
  const city = await getCityBySlug(slug);
  if (!city) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(city);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { slug } = await params;
  const city = await getCityBySlug(slug);
  if (!city) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json() as Record<string, unknown>;
  const allowed = ["label", "state", "region", "seo_title", "seo_description"];
  const fields: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) fields[key] = body[key] === "" ? null : body[key];
  }

  await updateCity(slug, fields as Parameters<typeof updateCity>[1]);
  await logActivity("city.update", "city", slug, { fields: Object.keys(fields) });
  return NextResponse.json({ ok: true });
}
