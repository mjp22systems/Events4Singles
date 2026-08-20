import type { Metadata } from "next";
import { getDashboardStats, getRecentActivity, type ActivityRow } from "@/lib/admin-db";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const activity: ActivityRow[] = await getRecentActivity(20);

  return (
    <>
      <h1 className="a-page-title">Dashboard</h1>

      <div className="a-stat-grid" style={{ marginBottom: "28px" }}>
        <div className="a-stat">
          <div className="a-stat__label">Active Listings</div>
          <div className="a-stat__value">{stats.activeListings.toLocaleString()}</div>
          <div className="a-stat__sub">
            <Link href="/admin/listings?status=active" style={{ color: "var(--a-teal)" }}>
              View all →
            </Link>
          </div>
        </div>
        <div className="a-stat">
          <div className="a-stat__label">Pending Review</div>
          <div
            className="a-stat__value"
            style={{ color: stats.pendingReview > 0 ? "var(--a-warning)" : undefined }}
          >
            {stats.pendingReview.toLocaleString()}
          </div>
          {stats.pendingReview > 0 && (
            <div className="a-stat__sub">
              <Link href="/admin/listings?status=pending" style={{ color: "var(--a-warning)" }}>
                Review now →
              </Link>
            </div>
          )}
        </div>
        <div className="a-stat">
          <div className="a-stat__label">Unclaimed</div>
          <div className="a-stat__value">{stats.unclaimedListings.toLocaleString()}</div>
          <div className="a-stat__sub">
            <Link href="/admin/listings?status=unclaimed" style={{ color: "var(--a-teal)" }}>
              View →
            </Link>
          </div>
        </div>
        <div className="a-stat">
          <div className="a-stat__label">Businesses</div>
          <div className="a-stat__value">{stats.totalBusinesses.toLocaleString()}</div>
          <div className="a-stat__sub">
            <Link href="/admin/businesses" style={{ color: "var(--a-teal)" }}>
              View all →
            </Link>
          </div>
        </div>
        <div className="a-stat">
          <div className="a-stat__label">Events Pending</div>
          <div
            className="a-stat__value"
            style={{ color: stats.pendingEvents > 0 ? "var(--a-warning)" : undefined }}
          >
            {stats.pendingEvents.toLocaleString()}
          </div>
          {stats.pendingEvents > 0 && (
            <div className="a-stat__sub">
              <Link href="/admin/events?status=pending" style={{ color: "var(--a-warning)" }}>
                Review now →
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="a-card">
        <div className="a-card-header">
          <span className="a-card-title">Recent Activity</span>
          <Link href="/admin/activity" className="a-btn a-btn-ghost" style={{ fontSize: "12px", padding: "4px 10px", minHeight: "auto" }}>
            View all
          </Link>
        </div>
        {activity.length === 0 ? (
          <div className="a-empty">
            <div className="a-empty__text">No activity yet</div>
          </div>
        ) : (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {activity.map((row) => (
                  <tr key={row.id}>
                    <td>{row.action}</td>
                    <td style={{ color: "var(--a-ink-muted)" }}>
                      {row.entity_type} {row.entity_id ? `#${row.entity_id}` : ""}
                    </td>
                    <td style={{ color: "var(--a-ink-muted)", whiteSpace: "nowrap" }}>
                      {new Date(row.created_at * 1000).toLocaleString("en-AU", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
