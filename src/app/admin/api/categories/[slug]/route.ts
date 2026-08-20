import { NextRequest, NextResponse } from "next/server";
import { getCategoryBySlug, updateCategory, logActivity } from "@/lib/admin-db";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(category);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json() as Record<string, unknown>;
  const allowed = ["label", "description", "banner_row_count", "seo_title", "seo_description", "hero_image_url", "sort_order"];
  const fields: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) fields[key] = body[key] === "" ? null : body[key];
  }

  await updateCategory(slug, fields as Parameters<typeof updateCategory>[1]);
  await logActivity("category.update", "category", slug, { fields: Object.keys(fields) });
  return NextResponse.json({ ok: true });
}
