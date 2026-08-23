import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getAccount, getPortalEvents } from "@/lib/portal-db";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const account = await getAccount(user.id);
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getPortalEvents(account.id));
}
