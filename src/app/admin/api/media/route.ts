import { NextRequest, NextResponse } from "next/server";
import { createMediaAsset, listEventImageOptions, logActivity } from "@/lib/admin-db";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

const MAX_UPLOAD_BYTES = 1_500_000;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function safeFilename(name: string) {
  return name
    .replace(/[/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120) || "upload";
}

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const assets = await listEventImageOptions();
  return NextResponse.json({ assets });
}

export async function POST(req: NextRequest) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Only JPG, PNG, WebP, and GIF images are supported." }, { status: 400 });
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Image is too large. Please upload an image under 1.5 MB." }, { status: 400 });
  }

  const asset = await createMediaAsset({
    filename: safeFilename(file.name),
    contentType: file.type,
    byteSize: file.size,
    data: await file.arrayBuffer(),
    source: String(formData.get("source") ?? "admin"),
  });
  await logActivity("media.upload", "media_asset", asset.id as unknown as number, {
    filename: asset.filename,
    byte_size: asset.byte_size,
  });

  return NextResponse.json({ asset }, { status: 201 });
}
