import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";


const VALID_SURFACES = new Set(["listing", "banner", "event"]);
const VALID_EVENTS = new Set([
  "impression",
  "click_website",
  "click_phone",
  "click_email",
  "click_booking",
  "click_business",
  "click_banner",
]);

export async function POST(req: NextRequest) {
  let body: { surface?: string; surface_id?: string; event_type?: string; city?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }

  const { surface, surface_id, event_type, city } = body;
  if (!surface || !surface_id || !event_type) return NextResponse.json({ ok: false }, { status: 400 });
  if (!VALID_SURFACES.has(surface) || !VALID_EVENTS.has(event_type)) return NextResponse.json({ ok: false }, { status: 400 });

  const ua = req.headers.get("user-agent") ?? "";
  const device = /mobile|android|iphone|ipad/i.test(ua) ? "mobile" : "desktop";

  const { env } = await getCloudflareContext({ async: true });

  await env.DB.prepare(
    "INSERT INTO analytics_events (surface, surface_id, event_type, city, device) VALUES (?, ?, ?, ?, ?)"
  )
    .bind(surface, surface_id, event_type, city ?? null, device)
    .run();

  return NextResponse.json({ ok: true });
}
