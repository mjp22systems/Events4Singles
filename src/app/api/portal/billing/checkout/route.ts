import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdvertiserCheckoutSession } from "@/lib/stripe-billing";
import { getOrCreateAccount } from "@/lib/portal-db";

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const productId = String(form.get("product_id") ?? "");
  const account = await getOrCreateAccount(user.id, user.emailAddresses[0]?.emailAddress);

  try {
    const session = await createAdvertiserCheckoutSession(account, productId, req.url);
    return NextResponse.redirect(session.url, { status: 303 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start checkout.";
    const url = new URL("/portal/subscription", req.url);
    url.searchParams.set("billing_error", message);
    return NextResponse.redirect(url, { status: 303 });
  }
}

