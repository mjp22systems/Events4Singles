import { NextRequest, NextResponse } from "next/server";
import { approveBusinessClaimRequest, rejectBusinessClaimRequest } from "@/lib/admin-db";
import { requireAdmin } from "@/lib/require-admin";

export async function POST(request: NextRequest) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const data = await request.formData();
  const action = data.get("action") as string;
  const ids = data.getAll("ids") as string[];
  const redirectTo = (data.get("redirect") as string) ?? "/admin/business-requests";

  if (action && ids.length > 0) {
    for (const id of ids) {
      if (action === "approve") {
        await approveBusinessClaimRequest(id);
      } else if (action === "reject") {
        await rejectBusinessClaimRequest(id);
      }
    }
  }

  return NextResponse.redirect(new URL(redirectTo, request.url));
}
