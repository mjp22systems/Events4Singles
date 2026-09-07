import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ADVERTISING_PRODUCTS, getConfiguredStripePriceId } from "@/lib/advertising-products";
import { getOrCreateAccount } from "@/lib/portal-db";

export const dynamic = "force-dynamic";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function paramValue(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function formatPlan(plan: string) {
  const normalizedPlan = plan === "free" ? "free_listing" : plan;
  const product = ADVERTISING_PRODUCTS.find((item) => item.id === normalizedPlan);
  return product?.name ?? plan.replace(/_/g, " ");
}

export default async function PortalSubscription({ searchParams }: Props) {
  const user = await currentUser();
  if (!user) redirect("/portal/sign-in");

  const params = await searchParams;
  const account = await getOrCreateAccount(user.id, user.emailAddresses[0]?.emailAddress);
  const billingError = params ? paramValue(params, "billing_error") : null;
  const checkout = params ? paramValue(params, "checkout") : null;
  const billing = params ? paramValue(params, "billing") : null;
  const activePlan = account.plan === "free" ? "free_listing" : account.plan || "free_listing";

  return (
    <>
      <div className="p-page-heading">
        <div>
          <h1 className="p-page-title">Subscription</h1>
          <p className="p-muted">Choose the visibility you need now. Listings, events and creative still go through review before they appear live.</p>
        </div>
      </div>

      {billingError && <div className="p-alert p-alert--error">{billingError}</div>}
      {checkout === "success" && <div className="p-alert p-alert--success">Checkout completed. Your billing status will update after Stripe confirms the payment.</div>}
      {checkout === "cancelled" && <div className="p-alert p-alert--warn">Checkout was cancelled. No plan change was applied.</div>}
      {billing === "free" && <div className="p-alert p-alert--success">Free listing plan selected.</div>}

      <section className="p-card p-subscription-summary">
        <div className="p-card__section">
          <div>
            <span className="p-kicker">Current plan</span>
            <h2 className="p-subscription-summary__plan">{formatPlan(activePlan)}</h2>
            <p className="p-muted">
              Status: <strong>{account.sub_status.replace(/_/g, " ")}</strong>
              {account.sub_expires_at ? ` · Renews/expires ${new Date(account.sub_expires_at).toLocaleDateString("en-AU")}` : ""}
            </p>
          </div>
          {account.stripe_customer_id && (
            <form method="post" action="/api/portal/billing/portal">
              <button className="p-btn" type="submit">Manage Billing</button>
            </form>
          )}
        </div>
      </section>

      <div className="p-plan-grid p-plan-grid--billing">
        {ADVERTISING_PRODUCTS.map((plan) => {
          const isActive = plan.id === activePlan;
          const priceConfigured = plan.checkoutMode === "free" || Boolean(getConfiguredStripePriceId(plan));
          return (
            <article key={plan.id} className={`p-plan-card${plan.recommended ? " p-plan-card--featured" : ""}${isActive ? " p-plan-card--active" : ""}`}>
              <div className="p-plan-card__header">
                <div>
                  {plan.recommended && <span className="p-plan-card__eyebrow">Popular</span>}
                  {isActive && <span className="p-plan-card__eyebrow p-plan-card__eyebrow--active">Current</span>}
                  <h2 className="p-plan-card__name">{plan.name}</h2>
                </div>
                <p className="p-plan-card__price"><strong>{plan.price}</strong><span>{plan.cadence}</span></p>
              </div>
              <p className="p-muted">{plan.note}</p>
              <ul className="p-plan-card__features">
                {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <form method="post" action="/api/portal/billing/checkout">
                <input type="hidden" name="product_id" value={plan.id} />
                <button className="p-btn p-btn--primary" type="submit" disabled={isActive || !priceConfigured}>
                  {isActive ? "Current Plan" : plan.cta}
                </button>
              </form>
              {!priceConfigured && (
                <p className="p-plan-card__disabled-note p-muted">
                  Stripe price not configured yet: <code>{plan.stripePriceEnv}</code>
                </p>
              )}
            </article>
          );
        })}
      </div>

      <section className="p-card p-card--section-spaced">
        <div className="p-card__section">
          <h2 className="p-section-title">How the flow works</h2>
          <ol className="p-billing-steps">
            <li><strong>Create or claim</strong><span>Start with a free business/listing presence.</span></li>
            <li><strong>Choose visibility</strong><span>Upgrade only the listing, event, city/category page, banner or campaign that needs attention.</span></li>
            <li><strong>Checkout</strong><span>Paid products redirect to Stripe Checkout once price IDs are configured.</span></li>
            <li><strong>Review</strong><span>Listings, banners, events and creative remain pending until approved.</span></li>
          </ol>
        </div>
      </section>
    </>
  );
}
