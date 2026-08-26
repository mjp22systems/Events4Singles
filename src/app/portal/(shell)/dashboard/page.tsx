import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getOrCreateAccount,
  getBusinessesForAccount,
  getListingsForBusinessIds,
  getBannersForAccount,
  getPortalEvents,
  listPortalIntegrations,
  getAnalyticsSummary,
} from "@/lib/portal-db";

export const dynamic = "force-dynamic";

export default async function PortalDashboard() {
  const user = await currentUser();
  if (!user) redirect("/portal/sign-in");
  const account = await getOrCreateAccount(user.id, user.emailAddresses[0]?.emailAddress);

  const [businesses, banners, events, integrations] = await Promise.all([
    getBusinessesForAccount(account),
    getBannersForAccount(account.id),
    getPortalEvents(account.id),
    listPortalIntegrations(account.id),
  ]);
  const businessIds = businesses.map((business) => business.id);
  if (account.business_id && !businessIds.includes(account.business_id)) businessIds.push(account.business_id);
  const listings = businessIds.length ? await getListingsForBusinessIds(businessIds) : [];
  const listingIds = (listings as { id: string }[]).map((l) => l.id);
  const stats = listingIds.length ? await getAnalyticsSummary(listingIds, 30) : [];

  const sum = (type: string) => stats.filter((s) => s.event_type === type).reduce((a, b) => a + b.total, 0);

  return (
    <>
      <h1 className="p-page-title">Dashboard</h1>
      <h2 className="p-section-title p-dashboard-section-title">Portal items</h2>
      <div className="p-stat-row">
        <div className="p-stat-card">
          <span className="p-stat-card__value">{businessIds.length}</span>
          <span className="p-stat-card__label">Businesses</span>
        </div>
        <div className="p-stat-card">
          <span className="p-stat-card__value">{listings.length}</span>
          <span className="p-stat-card__label">Listings</span>
        </div>
        <div className="p-stat-card">
          <span className="p-stat-card__value">{banners.length}</span>
          <span className="p-stat-card__label">Banners</span>
        </div>
        <div className="p-stat-card">
          <span className="p-stat-card__value">{events.length}</span>
          <span className="p-stat-card__label">Events</span>
        </div>
        <div className="p-stat-card">
          <span className="p-stat-card__value">{integrations.length}</span>
          <span className="p-stat-card__label">Integrations</span>
        </div>
      </div>

      <h2 className="p-section-title p-dashboard-section-title">Analytics summary</h2>
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
        <div className="p-card p-inline-a5e938b2" >
          <div className="p-card__section">
            <h2 className="p-section-title">Get started</h2>
            <p className="p-muted">Your account is set up. To link your business listing, contact us at{" "}
              <a href="mailto:support@events4singles.com">support@events4singles.com</a>.
            </p>
            <p className="p-muted p-inline-4be13c81" >
              Plan: <strong>{account?.plan ?? "free"}</strong>
            </p>
          </div>
        </div>
      )}

      {listings.length > 0 && (
        <div className="p-card p-inline-a5e938b2" >
          <div className="p-card__section">
            <h2 className="p-section-title">Your listings</h2>
            <ul className="p-inline-30213900" >
              {(listings as { id: string; title: string; status: string }[]).map((l) => (
                <li key={l.id} className="p-inline-678f4d5a" >
                  <span>{l.title}</span>
                  <span className="p-muted p-inline-c0e576d8" >{l.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
