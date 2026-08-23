import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getAccount, listPortalIntegrations, upsertPortalIntegration, type IntegrationPlatform } from "@/lib/portal-db";

export const dynamic = "force-dynamic";

async function requireAccount() {
  const user = await currentUser();
  if (!user) return null;
  return getAccount(user.id);
}

export async function GET() {
  const account = await requireAccount();
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await listPortalIntegrations(account.id));
}

export async function POST(req: NextRequest) {
  const account = await requireAccount();
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json() as { platform?: IntegrationPlatform; group_url?: string; feed_url?: string; auto_approve?: boolean };
  if (!body.platform) return NextResponse.json({ error: "platform is required" }, { status: 400 });

  const config =
    body.platform === "meetup" ? { group_url: body.group_url ?? "" } :
    body.platform === "ical" ? { feed_url: body.feed_url ?? "" } :
    {};

  await upsertPortalIntegration(account.id, body.platform, config);
  return NextResponse.json({ ok: true });
}
