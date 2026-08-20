import { currentUser } from "@clerk/nextjs/server";
import { getAccount, getListingsForAccount, getAnalyticsSummary, getAnalyticsDaily } from "@/lib/portal-db";

export const dynamic = "force-dynamic";

export default async function PortalAnalytics({
  searchParams,
}: {
  searchParams: Promise<{ listing?: string; days?: string }>;
}) {
  const params = await searchParams;
  const user = await currentUser();
  const account = await getAccount(user!.id);
  const allListings = account?.business_id ? await getListingsForAccount(account.business_id) : [];
  const typed = allListings as { id: string; title: string; status: string }[];

  const days = Number(params.days ?? 30);
  const filteredId = params.listing;
  const surfaceIds = filteredId
    ? [filteredId]
    : typed.map((l) => l.id);

  const stats = surfaceIds.length ? await getAnalyticsSummary(surfaceIds, days) : [];
  const daily = surfaceIds.length ? await getAnalyticsDaily(surfaceIds, days) : [];

  const sum = (type: string) => stats.filter((s) => s.event_type === type).reduce((a, b) => a + b.total, 0);

  const filteredListing = filteredId ? typed.find((l) => l.id === filteredId) : null;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
        <h1 className="p-page-title" style={{ margin: 0 }}>Analytics</h1>
        {filteredListing && (
          <span style={{ fontSize: "13px", background: "var(--p-border)", padding: "2px 10px", borderRadius: "12px", color: "var(--p-ink)" }}>
            {filteredListing.title}
            <a href="/portal/analytics" style={{ marginLeft: "8px", color: "var(--p-muted)", textDecoration: "none" }}>×</a>
          </span>
        )}
      </div>

      <div className="p-tab-row">
        {[30, 90, 365].map((d) => (
          <a key={d} href={`/portal/analytics?days=${d}${filteredId ? `&listing=${filteredId}` : ""}`}
            className={`p-tab${days === d ? " p-tab--active" : ""}`}>
            {d === 365 ? "This year" : `${d} days`}
          </a>
        ))}
      </div>

      <div className="p-stat-row" style={{ marginTop: "20px" }}>
        {[
          ["impression", "Impressions"],
          ["click_website", "Website Clicks"],
          ["click_phone", "Phone Reveals"],
          ["click_email", "Email Reveals"],
          ["click_banner", "Banner Clicks"],
          ["click_booking", "Booking Clicks"],
        ].map(([type, label]) => (
          <div key={type} className="p-stat-card">
            <span className="p-stat-card__value">{sum(type)}</span>
            <span className="p-stat-card__label">{label}</span>
          </div>
        ))}
      </div>

      {typed.length > 0 && !filteredId && (
        <div className="p-card" style={{ marginTop: "24px" }}>
          <div className="p-card__section">
            <h2 className="p-section-title">By listing</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--p-border)" }}>
                  <th className="p-label" style={{ textAlign: "left", padding: "8px 0", fontWeight: 600 }}>Listing</th>
                  <th className="p-label" style={{ textAlign: "right", padding: "8px 0", fontWeight: 600 }}>Views</th>
                  <th className="p-label" style={{ textAlign: "right", padding: "8px 0", fontWeight: 600 }}>Clicks</th>
                  <th style={{ width: "100px" }} />
                </tr>
              </thead>
              <tbody>
                {typed.map((l) => {
                  const lStats = stats.filter((s) => s.surface_id === l.id);
                  const views = lStats.filter((s) => s.event_type === "impression").reduce((a, b) => a + b.total, 0);
                  const clicks = lStats.filter((s) => s.event_type !== "impression").reduce((a, b) => a + b.total, 0);
                  return (
                    <tr key={l.id} style={{ borderBottom: "1px solid var(--p-border)" }}>
                      <td style={{ padding: "10px 0", fontSize: "14px", color: "var(--p-ink)" }}>{l.title}</td>
                      <td style={{ padding: "10px 0", fontSize: "14px", textAlign: "right" }}>{views}</td>
                      <td style={{ padding: "10px 0", fontSize: "14px", textAlign: "right" }}>{clicks}</td>
                      <td style={{ padding: "10px 0", textAlign: "right" }}>
                        <a href={`/portal/analytics?listing=${l.id}&days=${days}`} className="p-btn" style={{ fontSize: "12px", height: "28px", padding: "0 10px" }}>
                          Details
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {daily.length > 0 && (
        <div className="p-card" style={{ marginTop: "16px" }}>
          <div className="p-card__section">
            <h2 className="p-section-title">Daily breakdown</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--p-border)" }}>
                  <th className="p-label" style={{ textAlign: "left", padding: "8px 0", fontWeight: 600 }}>Date</th>
                  <th className="p-label" style={{ textAlign: "left", padding: "8px 0", fontWeight: 600 }}>Event</th>
                  <th className="p-label" style={{ textAlign: "right", padding: "8px 0", fontWeight: 600 }}>Count</th>
                </tr>
              </thead>
              <tbody>
                {daily.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--p-border)" }}>
                    <td style={{ padding: "8px 0", fontSize: "13px", color: "var(--p-muted)" }}>{row.date}</td>
                    <td style={{ padding: "8px 0", fontSize: "13px", color: "var(--p-ink)" }}>{row.event_type}</td>
                    <td style={{ padding: "8px 0", fontSize: "13px", textAlign: "right" }}>{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {surfaceIds.length === 0 && (
        <div className="p-card" style={{ marginTop: "24px" }}>
          <div className="p-empty"><p>No data yet — analytics appear once your listings are active.</p></div>
        </div>
      )}
    </>
  );
}
