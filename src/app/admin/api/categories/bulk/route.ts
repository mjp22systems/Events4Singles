import { NextRequest, NextResponse } from "next/server";
import { deleteCategory, logActivity } from "@/lib/admin-db";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const data = await req.formData();
  const action = String(data.get("action") ?? "");
  const ids = data.getAll("ids").map(String).filter(Boolean);
  const redirectTo = String(data.get("redirect") ?? "/admin/categories");

  if (action === "delete") {
    for (const slug of ids) {
      await deleteCategory(slug);
      await logActivity("category.bulk_delete", "category", slug);
    }
  }

  return NextResponse.redirect(new URL(redirectTo, req.url));
}
