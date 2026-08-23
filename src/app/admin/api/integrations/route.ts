import { NextResponse } from "next/server";
import { listAdminIntegrations } from "@/lib/admin-db";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  return NextResponse.json(await listAdminIntegrations());
}
