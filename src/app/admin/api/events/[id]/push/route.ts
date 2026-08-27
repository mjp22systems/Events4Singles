import { NextRequest, NextResponse } from "next/server";
import { getD1 } from "@/lib/db";
import { pushEventToEventbrite } from "@/lib/eventbrite-push-service";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Ctx) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  const contentType = req.headers.get("content-type") ?? "";
  const isForm = contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data");
  let platform = "eventbrite";
  let redirectTo: string | null = null;

  if (isForm) {
    const fd = await req.formData();
    platform = String(fd.get("platform") ?? "eventbrite");
    redirectTo = fd.get("redirect") ? String(fd.get("redirect")) : null;
  } else {
    const body = await req.json().catch(() => ({})) as { platform?: string };
    platform = body.platform ?? "eventbrite";
  }

  const result = await pushEventToEventbrite({
    db: await getD1(),
    eventId: id,
    platform,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, ...(result.push_url ? { push_url: result.push_url } : {}) },
      { status: result.status },
    );
  }

  if (redirectTo) {
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  return NextResponse.json(result);
}
