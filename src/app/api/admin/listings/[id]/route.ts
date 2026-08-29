import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken, SESSION_COOKIE } from "@/lib/admin-auth-edge";
import { getD1 } from "@/lib/db";
import { VALID_LISTING_TYPES, normalizeListingType } from "@/lib/listing-types";

const ALLOWED_FIELDS = [
  "business_name", "title", "tagline", "description", "phone", "mobile", "email",
  "web", "image_url", "location", "location_city", "location_state",
  "listing_type", "status", "confidence_score",
] as const;

type AllowedField = (typeof ALLOWED_FIELDS)[number];

const VALID_STATUSES = new Set(["active", "inactive", "pending"]);

function isValidUrl(val: unknown): boolean {
  if (!val || typeof val !== "string") return true; // empty/null is fine
  try {
    const u = new URL(val.startsWith("http") ? val : `https://${val}`);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const listingId = parseInt(id, 10);
  if (isNaN(listingId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await req.json() as Record<string, unknown>;
  const updates: Partial<Record<AllowedField, unknown>> = {};
  for (const field of ALLOWED_FIELDS) {
    if (field in body) updates[field] = body[field];
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  if ("listing_type" in updates) updates.listing_type = normalizeListingType(updates.listing_type as string);
  if ("listing_type" in updates && !VALID_LISTING_TYPES.has(updates.listing_type as string)) {
    return NextResponse.json({ error: "Invalid listing_type" }, { status: 400 });
  }
  if ("status" in updates && !VALID_STATUSES.has(updates.status as string)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  if ("confidence_score" in updates) {
    const score = Number(updates.confidence_score);
    if (!Number.isInteger(score) || score < 0 || score > 100) {
      return NextResponse.json({ error: "confidence_score must be an integer 0–100" }, { status: 400 });
    }
    updates.confidence_score = score;
  }
  if ("web" in updates && !isValidUrl(updates.web)) {
    return NextResponse.json({ error: "web must be a valid URL" }, { status: 400 });
  }
  if ("image_url" in updates && !isValidUrl(updates.image_url)) {
    return NextResponse.json({ error: "image_url must be a valid URL" }, { status: 400 });
  }

  const setClauses = Object.keys(updates).map((f) => `${f} = ?`).join(", ");
  const values = [...Object.values(updates), listingId];

  const db = await getD1();
  await db.prepare(`UPDATE listings SET ${setClauses} WHERE id = ?`).bind(...values).run();

  return NextResponse.json({ ok: true });
}
