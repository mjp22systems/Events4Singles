import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdvertiserBillingPortalSession } from "@/lib/stripe-billing";
import { getAccount } from "@/lib/portal-db";

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const account = await getAccount(user.id);
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const session = await createAdvertiserBillingPortalSession(account, req.url);
    return NextResponse.redirect(session.url, { status: 303 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not open billing portal.";
    const url = new URL("/portal/subscription", req.url);
    url.searchParams.set("billing_error", message);
    return NextResponse.redirect(url, { status: 303 });
  }
}

