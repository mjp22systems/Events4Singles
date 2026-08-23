import type { Metadata } from "next";
import Link from "next/link";
import AdminActionsMenu from "@/components/admin/actions-menu";
import AdminAddModal from "@/components/admin/add-modal";
import AdminBulkSelectAll from "@/components/admin/bulk-select-all";
import { listEvents, countEvents } from "@/lib/admin-db";
import { listCities } from "@/lib/admin-db";
import NewEventForm from "./new/new-event-form";

export const metadata: Metadata = { title: "Events" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

const STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];
const SOURCES = [
  { value: "", label: "All Sources" },
  { value: "admin", label: "EFS Native" },
  { value: "advertiser", label: "Advertiser" },
  { value: "eventbrite", label: "Eventbrite" },
  { value: "meetup", label: "Meetup" },
  { value: "humanitix", label: "Humanitix" },
  { value: "ical", label: "iCal" },
];

const SORTS = [
  { value: "date_asc", label: "Date (Soonest)" },
  { value: "date_desc", label: "Date (Latest)" },
  { value: "title_asc", label: "Title A-Z" },
  { value: "title_desc", label: "Title Z-A" },
  { value: "city_asc", label: "City A-Z" },
  { value: "status", label: "Status" },
];

const BADGE: Record<string, string> = {
  approved: "a-badge-active",
  pending: "a-badge-pending",
  rejected: "a-badge-deleted",
  cancelled: "a-badge-paused",
};

const SOURCE_BADGE: Record<string, string> = {
  admin: "a-badge-paused",
  advertiser: "a-badge-active",
  eventbrite: "a-badge-pending",
  meetup: "a-badge-pending",
  humanitix: "a-badge-pending",
  ical: "a-badge-paused",
};

const SOURCE_LABELS: Record<string, string> = {
  admin: "Native",
  advertiser: "Advertiser",
  eventbrite: "Eventbrite",
  meetup: "Meetup",
  humanitix: "Humanitix",
  ical: "iCal",
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

function formatCityName(value: string | null) {
  return (value ?? "—")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

type PageProps = { searchParams: Promise<Record<string, string>> };

export default async function AdminEventsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = params.status ?? "all";
  const showAdd = params.add === "1";
  const q = params.q ?? "";
  const city = params.city ?? "";
  const source = params.source ?? "";
  const sort = params.sort ?? "date_asc";
  const page = Math.max(1, Number(params.page ?? 1));
  const offset = (page - 1) * PAGE_SIZE;

  const filterStatus = status === "all" ? undefined : status;
  const filterSearch = q || undefined;
  const filterCity = city || undefined;
  const filterSource = source || undefined;

  const [events, total, cities, pendingCount] = await Promise.all([
    listEvents({ status: filterStatus, search: filterSearch, city: filterCity, source: filterSource, sort, page, limit: PAGE_SIZE }),
    countEvents({ status: filterStatus, search: filterSearch, city: filterCity, source: filterSource }),
    listCities(),
    countEvents({ status: "pending" }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function filterUrl(overrides: Record<string, string>) {
    const base: Record<string, string> = { status, page: String(page) };
    if (q) base.q = q;
    if (city) base.city = city;
    if (source) base.source = source;
    if (sort !== "date_asc") base.sort = sort;
    return `/admin/events?${new URLSearchParams({ ...base, ...overrides })}`;
  }

  const currentPath = `/admin/events?${new URLSearchParams(Object.fromEntries(Object.entries({ status, q, city, source, sort: sort !== "date_asc" ? sort : "", page: String(page) }).filter(([, value]) => value)))}`;
  const hasActiveFilters = q || city || source || status !== "all" || sort !== "date_asc";

  return (
    <>
      <div className="admin-page-header">
        <h1 className="a-page-title" style={{ margin: 0 }}>
          Events
          <span style={{ marginLeft: "10px", fontSize: "15px", fontWeight: 500, color: "var(--a-ink-muted)" }}>
            {total.toLocaleString()}
          </span>
          {pendingCount > 0 && (
            <span className="a-page-count-pill a-page-count-pill--pending">
              {pendingCount} pending
            </span>
          )}
        </h1>
        <Link href="/admin/events?add=1" className="a-btn a-btn-primary" style={{ fontSize: "13px" }}>
          + Add Event
        </Link>
      </div>

      {showAdd && (
        <AdminAddModal title="Add event" closeHref="/admin/events">
          <NewEventForm variant="plain" />
        </AdminAddModal>
      )}

      {/* Filters */}
      <div>
        <form method="GET" action="/admin/events" className="admin-filter-bar">
          <input name="q" type="search" defaultValue={q} placeholder="Search title, venue, category..." className="a-input" style={{ flex: 1, minWidth: "160px" }} />
          <select name="status" defaultValue={status} className="a-input" style={{ flex: 1, minWidth: "140px" }}>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select name="city" defaultValue={city} className="a-input" style={{ flex: 1, minWidth: "140px" }}>
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c.slug} value={c.slug}>{c.label}</option>
            ))}
          </select>
          <select name="source" defaultValue={source} className="a-input" style={{ flex: 1, minWidth: "140px" }}>
            {SOURCES.map((s) => (
              <option key={s.value || "all"} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select name="sort" defaultValue={sort} className="a-input" style={{ flex: 1, minWidth: "140px" }}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <button type="submit" className="a-btn a-btn-ghost" style={{ flexShrink: 0 }}>Filter</button>
          {hasActiveFilters && (
            <Link href="/admin/events" className="a-btn a-btn-ghost" style={{ color: "var(--a-ink-muted)", flexShrink: 0 }}>Clear</Link>
          )}
        </form>
      </div>

      <form method="POST" action="/admin/api/events/bulk">
        <input type="hidden" name="redirect" value={currentPath} />
        <div className="a-card">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", borderBottom: "1px solid var(--a-border)" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--a-ink-muted)", cursor: "pointer" }}>
              <input type="checkbox" id="bulk-select-all" />
              All
            </label>
            <select name="action" className="a-input" style={{ width: "160px" }}>
              <option value="">Bulk Action…</option>
              <option value="approve">Approve</option>
              <option value="reject">Reject</option>
              <option value="pause">Pause (hide)</option>
              <option value="activate">Reactivate</option>
              <option value="cancel">Cancel</option>
              <option value="delete">Delete</option>
            </select>
            <button type="submit" className="a-btn a-btn-ghost" style={{ fontSize: "13px" }}>Apply</button>
          </div>
        <div className="a-table-wrap a-table-wrap--events">
          <table className="a-table a-table--single-line a-table--events">
            <colgroup>
              <col className="a-events-col-check" />
              <col className="a-events-col-row" />
              <col className="a-events-col-title" />
              <col className="a-events-col-date" />
              <col className="a-events-col-city" />
              <col className="a-events-col-price" />
              <col className="a-events-col-source" />
              <col className="a-events-col-status" />
              <col className="a-events-col-actions" />
            </colgroup>
            <thead>
              <tr>
                <th></th>
                <th>#</th>
                <th>Title</th>
                <th>Date</th>
                <th>City</th>
                <th>Price</th>
                <th>Source</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "40px", color: "var(--a-ink-muted)" }}>
                    No events found
                  </td>
                </tr>
              ) : (
                events.map((ev, index) => (
                  <tr key={ev.id}>
                    <td><input type="checkbox" name="ids" value={ev.id} className="bulk-check" /></td>
                    <td style={{ color: "var(--a-ink-muted)", fontSize: "12px" }}>{offset + index + 1}</td>
                    <td className="a-events-title-cell" title={[ev.title, ev.category].filter(Boolean).join(" · ")}>
                      <span className="a-events-title-text">{ev.title}</span>
                      {ev.category && <span className="a-events-category-text">· {ev.category}</span>}
                    </td>
                    <td style={{ fontSize: "12px" }}>{formatDate(ev.starts_at)}</td>
                    <td className="a-events-city-cell" style={{ fontSize: "13px" }}>{formatCityName(ev.city)}</td>
                    <td style={{ fontSize: "12px" }}>{formatPrice(ev.price_min, ev.price_max)}</td>
                    <td className="a-table__badge-cell"><span className={`a-badge ${SOURCE_BADGE[ev.source] ?? "a-badge-paused"}`}>{SOURCE_LABELS[ev.source] ?? ev.source}</span></td>
                    <td className="a-table__badge-cell">
                      <span className={`a-badge ${BADGE[ev.status] ?? "a-badge-paused"}`}>{ev.status}</span>
                    </td>
                    <td className="a-table__actions-cell">
                      <AdminActionsMenu>
                        <Link href={`/admin/events/${ev.id}`}>Edit</Link>
                      </AdminActionsMenu>
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
      </form>
      <AdminBulkSelectAll />
    </>
  );
}
