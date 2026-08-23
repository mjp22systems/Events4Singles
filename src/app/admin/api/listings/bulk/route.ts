import { NextRequest, NextResponse } from "next/server";
import { updateListing, softDeleteListing, logActivity } from "@/lib/admin-db";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

const STATUS_MAP: Record<string, string> = {
  activate: "active",
  pause: "paused",
  archive: "archived",
};

export async function POST(req: NextRequest) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const fd = await req.formData();
  const ids = fd.getAll("ids").map(String).filter(Boolean).map(Number).filter((n) => Number.isFinite(n) && n > 0);
  const action = String(fd.get("action") ?? "");
  const redirectTo = String(fd.get("redirect") ?? "/admin/listings");

  if (ids.length && action) {
    for (const id of ids) {
      if (action in STATUS_MAP) {
        const status = STATUS_MAP[action];
        await updateListing(id, { status });
        await logActivity("listing.bulk_update", "listing", id, { status });
      } else if (action === "delete") {
        await softDeleteListing(id, "Bulk deleted by admin");
        await logActivity("listing.bulk_delete", "listing", id, {});
      }
    }
  }

  return NextResponse.redirect(new URL(redirectTo, req.url));
}
