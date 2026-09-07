import { NextRequest, NextResponse } from "next/server";
import { getAdvertisingProduct } from "@/lib/advertising-products";
import { ensureAdvertiserBillingTables, updateAccountBillingState } from "@/lib/stripe-billing";
import { getD1 } from "@/lib/db";

type StripeEvent = {
  id: string;
  type: string;
  data: { object: Record<string, unknown> };
};

export const dynamic = "force-dynamic";

function hexToBytes(hex: string) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

function bytesToHex(bytes: ArrayBuffer | Uint8Array) {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return [...view].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function verifyStripeSignature(rawBody: string, signature: string | null) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) throw new Error("Stripe webhook secret is not configured.");
  if (!signature) throw new Error("Missing Stripe signature.");

  const parts = Object.fromEntries(
    signature.split(",").map((part) => {
      const [key, value] = part.split("=");
      return [key, value];
    }),
  );
  if (!parts.t || !parts.v1) throw new Error("Invalid Stripe signature.");

  const signedPayload = `${parts.t}.${rawBody}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedPayload));
  if (!safeEqual(bytesToHex(digest), bytesToHex(hexToBytes(parts.v1)))) {
    throw new Error("Invalid Stripe signature.");
  }
}

function textField(object: Record<string, unknown>, key: string) {
  const value = object[key];
  return typeof value === "string" ? value : null;
}

function metadataField(object: Record<string, unknown>, key: string) {
  const metadata = object.metadata;
  if (!metadata || typeof metadata !== "object") return null;
  const value = (metadata as Record<string, unknown>)[key];
  return typeof value === "string" ? value : null;
}

async function recordWebhookEvent(event: StripeEvent) {
  const db = await getD1();
  await ensureAdvertiserBillingTables(db);
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS stripe_webhook_events (
        id TEXT PRIMARY KEY,
        event_type TEXT NOT NULL,
        processed_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`
    )
    .run();
  const result = await db
    .prepare("INSERT OR IGNORE INTO stripe_webhook_events (id, event_type) VALUES (?, ?)")
    .bind(event.id, event.type)
    .run();
  return result.meta.changes !== 0;
}

async function handleCheckoutCompleted(object: Record<string, unknown>) {
  const accountId = metadataField(object, "account_id") ?? textField(object, "client_reference_id");
  const productId = metadataField(object, "product_id");
  const product = getAdvertisingProduct(productId);
  if (!accountId || !product) return;

  const customer = textField(object, "customer");
  const subscription = textField(object, "subscription");
  const paymentStatus = textField(object, "payment_status");
  const checkoutStatus = textField(object, "status");
  const activeStatus = product.checkoutMode === "payment"
    ? (paymentStatus === "paid" ? "paid" : paymentStatus ?? "pending")
    : (checkoutStatus === "complete" ? "active" : checkoutStatus ?? "pending");

  await updateAccountBillingState(accountId, {
    plan: product.id,
    stripe_customer_id: customer,
    stripe_sub_id: subscription,
    sub_status: activeStatus,
  });
}

async function handleSubscriptionChanged(object: Record<string, unknown>) {
  const accountId = metadataField(object, "account_id");
  const productId = metadataField(object, "product_id");
  if (!accountId) return;

  const subscriptionId = textField(object, "id");
  const status = textField(object, "status") ?? "unknown";
  const currentPeriodEnd = typeof object.current_period_end === "number"
    ? new Date(object.current_period_end * 1000).toISOString()
    : null;

  await updateAccountBillingState(accountId, {
    ...(productId ? { plan: productId } : {}),
    stripe_sub_id: subscriptionId,
    sub_status: status,
    sub_expires_at: currentPeriodEnd,
  });
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  try {
    await verifyStripeSignature(rawBody, req.headers.get("stripe-signature"));
    const event = JSON.parse(rawBody) as StripeEvent;
    const shouldProcess = await recordWebhookEvent(event);
    if (!shouldProcess) return NextResponse.json({ ok: true, duplicate: true });

    if (event.type === "checkout.session.completed") await handleCheckoutCompleted(event.data.object);
    if (event.type === "customer.subscription.updated") await handleSubscriptionChanged(event.data.object);
    if (event.type === "customer.subscription.deleted") await handleSubscriptionChanged(event.data.object);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
