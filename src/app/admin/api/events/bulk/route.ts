import { NextRequest, NextResponse } from "next/server";
import { updateEvent, deleteEvent, logActivity } from "@/lib/admin-db";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

const STATUS_MAP: Record<string, string> = {
  approve: "approved",
  reject: "rejected",
  cancel: "cancelled",
  pause: "paused",
  activate: "approved",
};

export async function POST(req: NextRequest) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const fd = await req.formData();
  const ids = fd.getAll("ids").map(String).filter(Boolean);
  const action = String(fd.get("action") ?? "");
  const redirectTo = String(fd.get("redirect") ?? "/admin/events");

  if (ids.length && action) {
    for (const id of ids) {
      if (action in STATUS_MAP) {
        const status = STATUS_MAP[action];
        await updateEvent(id, { status });
        await logActivity("event.bulk_update", "event", id as unknown as number, { status });
      } else if (action === "delete") {
        await deleteEvent(id);
        await logActivity("event.bulk_delete", "event", id as unknown as number, {});
      }
    }
  }

  return NextResponse.redirect(new URL(redirectTo, req.url));
}
