import { NextRequest, NextResponse } from "next/server";
import { getD1 } from "@/lib/db";


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const listingId = searchParams.get("id");
  const type = searchParams.get("type"); // phone | email

  if (!listingId || (type !== "phone" && type !== "email")) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const db = await getD1();

  const column = type === "phone" ? "phone" : "email";
  const row = await db.prepare(
    `SELECT ${column} FROM listings WHERE id = ? AND status = 'active' LIMIT 1`
  )
    .bind(listingId)
    .first<{ phone?: string; email?: string }>();

  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const value = type === "phone" ? row.phone : row.email;
  if (!value) return NextResponse.json({ error: "Not available" }, { status: 404 });

  const ua = req.headers.get("user-agent") ?? "";
  const device = /mobile|android|iphone|ipad/i.test(ua) ? "mobile" : "desktop";
  const eventType = type === "phone" ? "click_phone" : "click_email";

  await db.prepare(
    "INSERT INTO analytics_events (surface, surface_id, event_type, device) VALUES ('listing', ?, ?, ?)"
  )
    .bind(listingId, eventType, device)
    .run();

  return NextResponse.json({ value });
}
