export const dynamic = "force-dynamic";

const PLANS = [
  {
    name: "Starter",
    price: "Coming soon",
    features: ["1 listing placement", "Sidebar banner", "Basic analytics"],
  },
  {
    name: "Professional",
    price: "Coming soon",
    features: ["Up to 3 listings", "Priority placement", "Full analytics", "Events calendar listing"],
  },
  {
    name: "Premium",
    price: "Coming soon",
    features: ["Unlimited listings", "Featured placement", "Full analytics + city breakdown", "Events calendar priority", "Dedicated account manager"],
  },
];

export default function PortalSubscription() {
  return (
    <>
      <h1 className="p-page-title">Subscription</h1>

      <div className="p-card" style={{ marginBottom: "24px" }}>
        <div className="p-card__section">
          <p className="p-muted">Current plan: <strong>Free</strong></p>
        </div>
      </div>

      <div className="p-plan-grid">
        {PLANS.map((plan) => (
          <div key={plan.name} className="p-plan-card">
            <h2 className="p-plan-card__name">{plan.name}</h2>
            <p className="p-plan-card__price">{plan.price}</p>
            <ul className="p-plan-card__features">
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button className="p-btn p-btn--primary" disabled>Coming soon</button>
          </div>
        ))}
      </div>

      <p className="p-muted" style={{ marginTop: "24px", fontSize: "13px" }}>
        Subscription plans launching soon. <a href="mailto:support@events4singles.com">Contact us</a> for early access pricing.
      </p>
    </>
  );
}
