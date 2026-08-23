import { NextRequest, NextResponse } from "next/server";
import { getMediaAssetBlob } from "@/lib/admin-db";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const asset = await getMediaAssetBlob(id);
  if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const headers = new Headers({
    "Content-Type": asset.content_type,
    "Content-Length": String(asset.byte_size),
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  });

  if (req.method === "HEAD") return new NextResponse(null, { headers });
  return new NextResponse(asset.data, { headers });
}

export async function HEAD(req: NextRequest, ctx: Ctx) {
  return GET(req, ctx);
}
