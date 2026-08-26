import { NextRequest, NextResponse } from "next/server";
import { getNotFoundSuggestions, recordNotFoundHit } from "@/lib/not-found";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as { path?: string; referrer?: string | null };
  const path = body.path || "/";
  const referrer = body.referrer || req.headers.get("referer");
  const userAgent = req.headers.get("user-agent");

  await recordNotFoundHit({ path, referrer, userAgent });
  const suggestions = await getNotFoundSuggestions(path);

  return NextResponse.json({ suggestions });
}
