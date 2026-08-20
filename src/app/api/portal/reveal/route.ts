import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const listingId = searchParams.get("id");
  const type = searchParams.get("type"); // phone | email

  if (!listingId || (type !== "phone" && type !== "email")) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const { env } = await getCloudflareContext({ async: true });

  const column = type === "phone" ? "phone" : "email";
  const row = await env.DB.prepare(
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

  await env.DB.prepare(
    "INSERT INTO analytics_events (surface, surface_id, event_type, device) VALUES ('listing', ?, ?, ?)"
  )
    .bind(listingId, eventType, device)
    .run();

  return NextResponse.json({ value });
}
