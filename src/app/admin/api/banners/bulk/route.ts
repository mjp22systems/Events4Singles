import { NextRequest, NextResponse } from "next/server";
import { updateBanner, deleteBanner, logActivity } from "@/lib/admin-db";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

const STATUS_MAP: Record<string, string> = {
  approve: "active",
  reject: "rejected",
  pause: "paused",
  activate: "active",
};

export async function POST(req: NextRequest) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const fd = await req.formData();
  const ids = fd.getAll("ids").map(String).filter(Boolean);
  const action = String(fd.get("action") ?? "");
  const redirectTo = String(fd.get("redirect") ?? "/admin/banners");

  if (ids.length && action) {
    for (const id of ids) {
      if (action in STATUS_MAP) {
        const status = STATUS_MAP[action];
        await updateBanner(id, status);
        await logActivity("banner.bulk_update", "banner", id as unknown as number, { status });
      } else if (action === "delete") {
        await deleteBanner(id);
        await logActivity("banner.bulk_delete", "banner", id as unknown as number, {});
      }
    }
  }

  return NextResponse.redirect(new URL(redirectTo, req.url));
}
