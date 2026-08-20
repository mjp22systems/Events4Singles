import { currentUser } from "@clerk/nextjs/server";
import { getAccount, getListingsForAccount, getAnalyticsSummary } from "@/lib/portal-db";

export const dynamic = "force-dynamic";

export default async function PortalDashboard() {
  const user = await currentUser();
  const account = await getAccount(user!.id);

  const listings = account?.business_id ? await getListingsForAccount(account.business_id) : [];
  const listingIds = (listings as { id: string }[]).map((l) => l.id);
  const stats = listingIds.length ? await getAnalyticsSummary(listingIds, 30) : [];

  const sum = (type: string) => stats.filter((s) => s.event_type === type).reduce((a, b) => a + b.total, 0);

  return (
    <>
      <h1 className="p-page-title">Dashboard</h1>
      <div className="p-stat-row">
        <div className="p-stat-card">
          <span className="p-stat-card__value">{sum("impression")}</span>
          <span className="p-stat-card__label">Listing Views (30d)</span>
        </div>
        <div className="p-stat-card">
          <span className="p-stat-card__value">{sum("click_website")}</span>
          <span className="p-stat-card__label">Website Clicks (30d)</span>
        </div>
        <div className="p-stat-card">
          <span className="p-stat-card__value">{sum("click_phone")}</span>
          <span className="p-stat-card__label">Phone Reveals (30d)</span>
        </div>
        <div className="p-stat-card">
          <span className="p-stat-card__value">{sum("click_email")}</span>
          <span className="p-stat-card__label">Email Reveals (30d)</span>
        </div>
      </div>

      {listings.length === 0 && (
        <div className="p-card" style={{ marginTop: "28px" }}>
          <div className="p-card__section">
            <h2 className="p-section-title">Get started</h2>
            <p className="p-muted">Your account is set up. To link your business listing, contact us at{" "}
              <a href="mailto:support@events4singles.com">support@events4singles.com</a>.
            </p>
            <p className="p-muted" style={{ marginTop: "8px" }}>
              Plan: <strong>{account?.plan ?? "free"}</strong>
            </p>
          </div>
        </div>
      )}

      {listings.length > 0 && (
        <div className="p-card" style={{ marginTop: "28px" }}>
          <div className="p-card__section">
            <h2 className="p-section-title">Your listings</h2>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {(listings as { id: string; title: string; status: string }[]).map((l) => (
                <li key={l.id} style={{ padding: "8px 0", borderBottom: "1px solid var(--p-border)", display: "flex", justifyContent: "space-between" }}>
                  <span>{l.title}</span>
                  <span className="p-muted" style={{ fontSize: "12px" }}>{l.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
