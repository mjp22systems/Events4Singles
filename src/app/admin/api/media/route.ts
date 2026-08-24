import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { createMediaAsset, listCategoryImageOptions, listEventImageOptions, logActivity } from "@/lib/admin-db";
import { requireAdmin } from "@/lib/require-admin";
import type { MediaAssetPurpose } from "@/lib/media-assets";

export const dynamic = "force-dynamic";

const MAX_UPLOAD_BYTES = 1_500_000;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const ALLOWED_PURPOSES = new Set<MediaAssetPurpose>(["event_image", "category_image", "banner", "profile"]);

function safeFilename(name: string) {
  return name
    .replace(/[/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120) || "upload";
}

function webpFilename(name: string) {
  return safeFilename(name).replace(/\.[a-z0-9]+$/i, "") + ".webp";
}

async function categoryImagePayload(file: File) {
  const data = await file.arrayBuffer();
  const optimized = await sharp(Buffer.from(data), { animated: false })
    .rotate()
    .resize({
      width: 1600,
      height: 1000,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toBuffer();

  return {
    filename: webpFilename(file.name),
    contentType: "image/webp",
    byteSize: optimized.byteLength,
    data: optimized.buffer.slice(optimized.byteOffset, optimized.byteOffset + optimized.byteLength),
  };
}

function mediaPurpose(value: FormDataEntryValue | string | null): MediaAssetPurpose {
  const purpose = String(value ?? "event_image");
  return ALLOWED_PURPOSES.has(purpose as MediaAssetPurpose) ? purpose as MediaAssetPurpose : "event_image";
}

export async function GET(req: NextRequest) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const purpose = mediaPurpose(req.nextUrl.searchParams.get("purpose"));
  const assets = purpose === "category_image"
    ? await listCategoryImageOptions()
    : await listEventImageOptions();
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

  const purpose = mediaPurpose(formData.get("purpose"));
  const payload = purpose === "category_image"
    ? await categoryImagePayload(file)
    : {
        filename: safeFilename(file.name),
        contentType: file.type,
        byteSize: file.size,
        data: await file.arrayBuffer(),
      };

  const asset = await createMediaAsset({
    filename: payload.filename,
    contentType: payload.contentType,
    byteSize: payload.byteSize,
    data: payload.data,
    source: String(formData.get("source") ?? "admin"),
    purpose,
  });
  await logActivity("media.upload", "media_asset", asset.id as unknown as number, {
    filename: asset.filename,
    byte_size: asset.byte_size,
  });

  return NextResponse.json({ asset }, { status: 201 });
}
