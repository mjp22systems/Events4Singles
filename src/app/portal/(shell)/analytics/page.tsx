import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateAccount, getBusinessIdsForAccount, getListingsForBusinessIds, getAnalyticsSummary, getAnalyticsDaily } from "@/lib/portal-db";

export const dynamic = "force-dynamic";

export default async function PortalAnalytics({
  searchParams,
}: {
  searchParams: Promise<{ listing?: string; days?: string }>;
}) {
  const params = await searchParams;
  const user = await currentUser();
  if (!user) redirect("/portal/sign-in");
  const account = await getOrCreateAccount(user.id, user.emailAddresses[0]?.emailAddress);
  const businessIds = await getBusinessIdsForAccount(account);
  const allListings = businessIds.length ? await getListingsForBusinessIds(businessIds) : [];
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
      <div className="p-inline-66703592" >
        <h1 className="p-page-title p-inline-b646589c" >Analytics</h1>
        {filteredListing && (
          <span className="p-inline-fed45b63" >
            {filteredListing.title}
            <a href="/portal/analytics" className="p-inline-1e76b197" >×</a>
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

      <div className="p-stat-row p-inline-ba93ebdf" >
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
        <div className="p-card p-inline-94d668c2" >
          <div className="p-card__section">
            <h2 className="p-section-title">By listing</h2>
            <table className="p-inline-3d9ff13f" >
              <thead>
                <tr className="p-inline-b7e3c804" >
                  <th className="p-label p-inline-29909338" >Listing</th>
                  <th className="p-label p-inline-cf6e47e1" >Views</th>
                  <th className="p-label p-inline-cf6e47e1" >Clicks</th>
                  <th className="p-inline-c576062a"  />
                </tr>
              </thead>
              <tbody>
                {typed.map((l) => {
                  const lStats = stats.filter((s) => s.surface_id === l.id);
                  const views = lStats.filter((s) => s.event_type === "impression").reduce((a, b) => a + b.total, 0);
                  const clicks = lStats.filter((s) => s.event_type !== "impression").reduce((a, b) => a + b.total, 0);
                  return (
                    <tr key={l.id} className="p-inline-b7e3c804" >
                      <td className="p-inline-3d73efb4" >{l.title}</td>
                      <td className="p-inline-ebe0b1e6" >{views}</td>
                      <td className="p-inline-ebe0b1e6" >{clicks}</td>
                      <td className="p-inline-3534e1cf" >
                        <a href={`/portal/analytics?listing=${l.id}&days=${days}`} className="p-btn p-inline-d0cb2021" >
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
        <div className="p-card p-inline-180c4ed5" >
          <div className="p-card__section">
            <h2 className="p-section-title">Daily breakdown</h2>
            <table className="p-inline-3d9ff13f" >
              <thead>
                <tr className="p-inline-b7e3c804" >
                  <th className="p-label p-inline-29909338" >Date</th>
                  <th className="p-label p-inline-29909338" >Event</th>
                  <th className="p-label p-inline-cf6e47e1" >Count</th>
                </tr>
              </thead>
              <tbody>
                {daily.map((row, i) => (
                  <tr key={i} className="p-inline-b7e3c804" >
                    <td className="p-inline-f5f379af" >{row.date}</td>
                    <td className="p-inline-13032d21" >{row.event_type}</td>
                    <td className="p-inline-2d5b0580" >{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {surfaceIds.length === 0 && (
        <div className="p-card p-inline-94d668c2" >
          <div className="p-empty"><p>No data yet — analytics appear once your listings are active.</p></div>
        </div>
      )}
    </>
  );
}
