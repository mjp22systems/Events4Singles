import { NextRequest, NextResponse } from "next/server";
import { getListingById, updateListing, softDeleteListing, logActivity } from "@/lib/admin-db";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const listing = await getListingById(Number(id));
  if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(listing);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const numId = Number(id);
  const listing = await getListingById(numId);
  if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json() as Record<string, unknown>;
  const allowed = [
    "title", "tagline", "description", "promo",
    "contact_name", "phone", "mobile", "email", "web", "image_url",
    "location", "location_city", "location_state",
    "status", "listing_type", "business_id", "unclaimed_flag",
    "abn", "licence_no", "facebook_url", "instagram_url",
    "tiktok_url", "youtube_url", "linkedin_url",
    "trading_hours", "contact_hours",
  ];

  const fields: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) fields[key] = body[key] === "" ? null : body[key];
  }

  await updateListing(numId, fields as Parameters<typeof updateListing>[1]);
  await logActivity("listing.update", "listing", numId, { fields: Object.keys(fields) });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const numId = Number(id);
  const body = await req.json().catch(() => ({})) as { reason?: string };
  const reason = body.reason ?? "Deleted by admin";
  await softDeleteListing(numId, reason);
  await logActivity("listing.delete", "listing", numId, { reason });
  return NextResponse.json({ ok: true });
}
