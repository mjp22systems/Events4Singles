import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getD1 } from "@/lib/db";
import { pushEventToEventbrite } from "@/lib/eventbrite-push-service";
import { getAccount } from "@/lib/portal-db";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Ctx) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const account = await getAccount(user.id);
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({})) as { platform?: string };
  const result = await pushEventToEventbrite({
    db: await getD1(),
    eventId: id,
    accountId: account.id,
    platform: body.platform ?? "eventbrite",
    requireApproved: true,
    requirePushEnabled: true,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, ...(result.push_url ? { push_url: result.push_url } : {}) },
      { status: result.status },
    );
  }

  return NextResponse.json(result);
}
