import { NextRequest, NextResponse } from "next/server";
import { updateBusiness, logActivity } from "@/lib/admin-db";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

const STATUS_MAP: Record<string, string> = {
  activate: "active",
  pause: "paused",
};

export async function POST(req: NextRequest) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const fd = await req.formData();
  const ids = fd.getAll("ids").map(String).filter(Boolean).map(Number).filter((n) => Number.isFinite(n) && n > 0);
  const action = String(fd.get("action") ?? "");
  const redirectTo = String(fd.get("redirect") ?? "/admin/businesses");

  if (ids.length && action) {
    for (const id of ids) {
      if (action in STATUS_MAP) {
        const status = STATUS_MAP[action];
        await updateBusiness(id, { status });
        await logActivity("business.bulk_update", "business", id, { status });
      } else if (action === "delete") {
        await updateBusiness(id, { status: "deleted" });
        await logActivity("business.bulk_delete", "business", id, {});
      }
    }
  }

  return NextResponse.redirect(new URL(redirectTo, req.url));
}
