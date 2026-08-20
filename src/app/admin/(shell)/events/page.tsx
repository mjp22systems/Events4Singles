import type { Metadata } from "next";
import Link from "next/link";
import { listEvents, countEvents } from "@/lib/admin-db";
import { listCities } from "@/lib/admin-db";

export const metadata: Metadata = { title: "Events" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

const STATUSES = ["all", "pending", "approved", "rejected", "cancelled"];

const BADGE: Record<string, string> = {
  approved: "a-badge-active",
  pending: "a-badge-pending",
  rejected: "a-badge-deleted",
  cancelled: "a-badge-paused",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

function formatPrice(min: number | null, max: number | null) {
  if (min === null) return "—";
  if (min === 0) return "Free";
  const fmt = (n: number) => `$${(n / 100).toFixed(0)}`;
  return max && max !== min ? `${fmt(min)}–${fmt(max)}` : fmt(min);
}

type PageProps = { searchParams: Promise<Record<string, string>> };

export default async function AdminEventsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = params.status ?? "all";
  const city = params.city ?? "";
  const page = Math.max(1, Number(params.page ?? 1));

  const filterStatus = status === "all" ? undefined : status;
  const filterCity = city || undefined;

  const [events, total, cities, pendingCount] = await Promise.all([
    listEvents({ status: filterStatus, city: filterCity, page, limit: PAGE_SIZE }),
    countEvents({ status: filterStatus, city: filterCity }),
    listCities(),
    countEvents({ status: "pending" }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function filterUrl(overrides: Record<string, string>) {
    const base: Record<string, string> = { status, page: String(page) };
    if (city) base.city = city;
    return `/admin/events?${new URLSearchParams({ ...base, ...overrides })}`;
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1 className="a-page-title" style={{ margin: 0 }}>
          Events
          <span style={{ marginLeft: "10px", fontSize: "15px", fontWeight: 500, color: "var(--a-ink-muted)" }}>
            {total.toLocaleString()}
          </span>
          {pendingCount > 0 && (
            <span style={{ marginLeft: "8px", fontSize: "12px", background: "var(--a-amber)", color: "#fff", padding: "2px 8px", borderRadius: "99px" }}>
              {pendingCount} pending
            </span>
          )}
        </h1>
        <Link href="/admin/events/new" className="a-btn a-btn-primary" style={{ fontSize: "13px" }}>
          + Add Event
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
        <form method="GET" action="/admin/events" style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          {status !== "all" && <input type="hidden" name="status" value={status} />}
          <select name="city" defaultValue={city} className="a-input" style={{ width: "160px" }}>
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c.slug} value={c.slug}>{c.label}</option>
            ))}
          </select>
          <button type="submit" className="a-btn a-btn-ghost">Filter</button>
          {city && (
            <Link href="/admin/events" className="a-btn a-btn-ghost" style={{ color: "var(--a-ink-muted)" }}>Clear</Link>
          )}
        </form>
      </div>

      {/* Status tabs */}
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "16px" }}>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={filterUrl({ status: s, page: "1" })}
            className="a-btn a-btn-ghost"
            style={{
              fontSize: "12px", padding: "4px 10px", minHeight: "auto",
              ...(status === s ? { background: "var(--a-teal-glow)", color: "var(--a-teal)", borderColor: "var(--a-teal)" } : {}),
            }}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="a-card">
        <div className="a-table-wrap">
          <table className="a-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>City</th>
                <th>Venue</th>
                <th>Price</th>
                <th>Source</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "var(--a-ink-muted)" }}>
                    No events found
                  </td>
                </tr>
              ) : (
                events.map((ev) => (
                  <tr key={ev.id}>
                    <td>
                      <span style={{ fontWeight: 500 }}>{ev.title}</span>
                      {ev.category && (
                        <div style={{ fontSize: "11px", color: "var(--a-ink-muted)", marginTop: "2px" }}>{ev.category}</div>
                      )}
                    </td>
                    <td style={{ fontSize: "12px", whiteSpace: "nowrap" }}>{formatDate(ev.starts_at)}</td>
                    <td style={{ fontSize: "13px" }}>{ev.city}</td>
                    <td style={{ fontSize: "12px", color: "var(--a-ink-muted)" }}>
                      {[ev.venue_name, ev.suburb].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td style={{ fontSize: "12px" }}>{formatPrice(ev.price_min, ev.price_max)}</td>
                    <td style={{ fontSize: "11px", color: "var(--a-ink-muted)" }}>{ev.source}</td>
                    <td>
                      <span className={`a-badge ${BADGE[ev.status] ?? "a-badge-paused"}`}>{ev.status}</span>
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <Link
                        href={`/admin/events/${ev.id}`}
                        className="a-btn a-btn-ghost"
                        style={{ fontSize: "12px", padding: "4px 10px", minHeight: "auto" }}
                      >
                        Edit
                      </Link>
                      {ev.ticket_url && (
                        <a
                          href={ev.ticket_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="a-btn a-btn-ghost"
                          style={{ fontSize: "12px", padding: "4px 10px", minHeight: "auto", marginLeft: "4px" }}
                        >
                          Tickets ↗
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid var(--a-border)", fontSize: "13px", color: "var(--a-ink-muted)" }}>
            <span>Page {page} of {totalPages} — {total.toLocaleString()} total</span>
            <div style={{ display: "flex", gap: "6px" }}>
              {page > 1 && (
                <Link href={filterUrl({ page: String(page - 1) })} className="a-btn a-btn-ghost" style={{ fontSize: "12px", padding: "4px 10px", minHeight: "auto" }}>← Prev</Link>
              )}
              {page < totalPages && (
                <Link href={filterUrl({ page: String(page + 1) })} className="a-btn a-btn-ghost" style={{ fontSize: "12px", padding: "4px 10px", minHeight: "auto" }}>Next →</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
