import { getD1 } from "@/lib/db";
import { type AdvertiserAccount } from "@/lib/portal-db";
import { getAdvertisingProduct, getConfiguredStripePriceId, type AdvertisingProduct } from "@/lib/advertising-products";

type StripeCreateSessionResult = {
  id: string;
  url: string | null;
  customer?: string;
  subscription?: string | null;
  payment_status?: string;
  status?: string;
  metadata?: Record<string, string>;
};

type StripeCustomerResult = {
  id: string;
};

const STRIPE_API_BASE = "https://api.stripe.com/v1";

function getStripeSecretKey() {
  return process.env.STRIPE_SECRET_KEY?.trim() || null;
}

function getSiteUrl(reqUrl: string) {
  return (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || new URL(reqUrl).origin).replace(/\/$/, "");
}

async function stripePost<T>(path: string, body: URLSearchParams): Promise<T> {
  const secret = getStripeSecretKey();
  if (!secret) {
    throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY before enabling paid checkout.");
  }

  const response = await fetch(`${STRIPE_API_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const payload = await response.json().catch(() => ({})) as { error?: { message?: string } };
  if (!response.ok) {
    throw new Error(payload.error?.message || "Stripe rejected the request.");
  }
  return payload as T;
}

export async function ensureAdvertiserBillingTables(d?: D1Database) {
  const db = d ?? await getD1();
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS advertiser_billing_sessions (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        account_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        checkout_mode TEXT NOT NULL,
        stripe_session_id TEXT UNIQUE,
        stripe_customer_id TEXT,
        stripe_subscription_id TEXT,
        status TEXT NOT NULL DEFAULT 'created',
        amount_label TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (account_id) REFERENCES advertiser_accounts(id)
      )`
    )
    .run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_abs_account ON advertiser_billing_sessions(account_id, created_at)").run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_abs_stripe_session ON advertiser_billing_sessions(stripe_session_id)").run();
}

async function createStripeCustomer(account: AdvertiserAccount, email: string | null): Promise<string> {
  const body = new URLSearchParams();
  if (email) body.set("email", email);
  if (account.display_name) body.set("name", account.display_name);
  body.set("metadata[account_id]", account.id);
  body.set("metadata[clerk_user_id]", account.clerk_user_id);
  const customer = await stripePost<StripeCustomerResult>("/customers", body);
  await updateAccountBillingState(account.id, { stripe_customer_id: customer.id });
  return customer.id;
}

export async function createAdvertiserCheckoutSession(
  account: AdvertiserAccount,
  productId: string,
  reqUrl: string,
): Promise<{ url: string }> {
  const product = getAdvertisingProduct(productId);
  if (!product) throw new Error("Unknown advertising product.");
  if (product.checkoutMode === "free") {
    await updateAccountBillingState(account.id, {
      plan: product.id,
      sub_status: "free",
      sub_expires_at: null,
    });
    return { url: `${getSiteUrl(reqUrl)}/portal/subscription?billing=free` };
  }

  const priceId = getConfiguredStripePriceId(product);
  if (!priceId) {
    throw new Error(`${product.stripePriceEnv} is not configured for ${product.name}.`);
  }

  const customerId = account.stripe_customer_id || await createStripeCustomer(
    account,
    account.billing_email ?? account.portal_email,
  );
  const siteUrl = getSiteUrl(reqUrl);
  const body = new URLSearchParams();
  body.set("mode", product.checkoutMode);
  body.set("customer", customerId);
  body.set("client_reference_id", account.id);
  body.set("line_items[0][price]", priceId);
  body.set("line_items[0][quantity]", "1");
  body.set("success_url", `${siteUrl}/portal/subscription?checkout=success&session_id={CHECKOUT_SESSION_ID}`);
  body.set("cancel_url", `${siteUrl}/portal/subscription?checkout=cancelled`);
  body.set("metadata[account_id]", account.id);
  body.set("metadata[product_id]", product.id);
  if (product.checkoutMode === "subscription") {
    body.set("subscription_data[metadata][account_id]", account.id);
    body.set("subscription_data[metadata][product_id]", product.id);
  } else {
    body.set("payment_intent_data[metadata][account_id]", account.id);
    body.set("payment_intent_data[metadata][product_id]", product.id);
  }

  const session = await stripePost<StripeCreateSessionResult>("/checkout/sessions", body);
  await recordBillingSession(account.id, product, session, "created");

  if (!session.url) throw new Error("Stripe did not return a checkout URL.");
  return { url: session.url };
}

export async function createAdvertiserBillingPortalSession(account: AdvertiserAccount, reqUrl: string): Promise<{ url: string }> {
  if (!account.stripe_customer_id) throw new Error("No Stripe customer exists for this account yet.");
  const siteUrl = getSiteUrl(reqUrl);
  const body = new URLSearchParams();
  body.set("customer", account.stripe_customer_id);
  body.set("return_url", `${siteUrl}/portal/subscription`);
  const session = await stripePost<{ url?: string }>("/billing_portal/sessions", body);
  if (!session.url) throw new Error("Stripe did not return a billing portal URL.");
  return { url: session.url };
}

export async function recordBillingSession(
  accountId: string,
  product: AdvertisingProduct,
  session: StripeCreateSessionResult,
  status: string,
) {
  await ensureAdvertiserBillingTables();
  const db = await getD1();
  await db
    .prepare(
      `INSERT INTO advertiser_billing_sessions
        (account_id, product_id, checkout_mode, stripe_session_id, stripe_customer_id, stripe_subscription_id, status, amount_label)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(stripe_session_id) DO UPDATE SET
         stripe_customer_id = excluded.stripe_customer_id,
         stripe_subscription_id = excluded.stripe_subscription_id,
         status = excluded.status,
         updated_at = datetime('now')`
    )
    .bind(
      accountId,
      product.id,
      product.checkoutMode,
      session.id,
      session.customer ?? null,
      typeof session.subscription === "string" ? session.subscription : null,
      status,
      `${product.price} ${product.cadence}`,
    )
    .run();
}

export async function updateAccountBillingState(
  accountId: string,
  fields: {
    plan?: string;
    stripe_customer_id?: string | null;
    stripe_sub_id?: string | null;
    sub_status?: string;
    sub_expires_at?: string | null;
  },
) {
  const entries = Object.entries(fields).filter(([, value]) => value !== undefined);
  if (!entries.length) return;
  const db = await getD1();
  const sets = entries.map(([key]) => `${key} = ?`).join(", ");
  await db
    .prepare(`UPDATE advertiser_accounts SET ${sets}, updated_at = datetime('now') WHERE id = ?`)
    .bind(...entries.map(([, value]) => value), accountId)
    .run();
}

