import { NextRequest, NextResponse } from "next/server";
import { logActivity, updateAdvertiserAccountStatus } from "@/lib/admin-db";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const data = await req.formData();
  const action = String(data.get("action") ?? "");
  const ids = data.getAll("ids").map(String).filter(Boolean);
  const redirectTo = String(data.get("redirect") ?? "/admin/users");

  const statusMap: Record<string, string> = {
    activate: "active",
    pause: "paused",
    cancel: "cancelled",
  };

  const nextStatus = statusMap[action];
  if (nextStatus) {
    for (const id of ids) {
      await updateAdvertiserAccountStatus(id, nextStatus);
      await logActivity("user.bulk_update", "advertiser_account", id, { sub_status: nextStatus });
    }
  }

  return NextResponse.redirect(new URL(redirectTo, req.url));
}
