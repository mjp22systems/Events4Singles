import { currentUser } from "@clerk/nextjs/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";
import { createMediaAsset, listMediaAssetsForAccount } from "@/lib/media-assets";
import { getAccount } from "@/lib/portal-db";

export const dynamic = "force-dynamic";

const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

async function requireAccount() {
  const user = await currentUser();
  if (!user) return null;
  return getAccount(user.id);
}

export async function GET() {
  const account = await requireAccount();
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { env } = await getCloudflareContext({ async: true });
  const assets = await listMediaAssetsForAccount(env.DB, account.id);
  return NextResponse.json({ assets });
}

export async function POST(req: NextRequest) {
  const account = await requireAccount();
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an image file to upload." }, { status: 422 });
  }
  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Images must be JPG, PNG, WebP or GIF." }, { status: 422 });
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "Images must be 2MB or smaller." }, { status: 422 });
  }

  const { env } = await getCloudflareContext({ async: true });
  const asset = await createMediaAsset(env.DB, {
    accountId: account.id,
    filename: file.name || "event-image",
    contentType: file.type,
    byteSize: file.size,
    data: await file.arrayBuffer(),
    source: "portal_upload",
    purpose: "event_image",
    altText: typeof form.get("alt_text") === "string" ? String(form.get("alt_text")) : null,
  });

  return NextResponse.json({ asset });
}
