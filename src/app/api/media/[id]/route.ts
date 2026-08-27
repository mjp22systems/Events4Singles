import { NextResponse } from "next/server";
import { getD1 } from "@/lib/db";
import { getMediaAsset } from "@/lib/media-assets";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const db = await getD1();
  const asset = await getMediaAsset(db, id);
  if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return new Response(asset.data, {
    headers: {
      "Content-Type": asset.content_type,
      "Content-Length": String(asset.byte_size),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
