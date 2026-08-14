import type { Metadata } from "next";
import Link from "next/link";
import { listListings, countListings, listCategories, listCities } from "@/lib/admin-db";

export const metadata: Metadata = { title: "Listings" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

const STATUSES = ["all", "active", "pending", "unclaimed", "paused", "expired", "archived", "deleted"];

const BADGE: Record<string, string> = {
  active: "a-badge-active",
  pending: "a-badge-pending",
  unclaimed: "a-badge-unclaimed",
  paused: "a-badge-paused",
  expired: "a-badge-expired",
  archived: "a-badge-paused",
  deleted: "a-badge-deleted",
};

function badge(status: string | null, unclaimed: number) {
  if (unclaimed) return <span className="a-badge a-badge-unclaimed">unclaimed</span>;
  const s = status ?? "unknown";
  return <span className={`a-badge ${BADGE[s] ?? "a-badge-paused"}`}>{s}</span>;
}

function PlacementPill({ slug }: { slug: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: "11px",
        padding: "1px 6px",
        borderRadius: "4px",
        background: "var(--a-surface-2)",
        color: "var(--a-ink-muted)",
        marginRight: "3px",
        marginBottom: "2px",
        whiteSpace: "nowrap",
      }}
    >
      {slug}
    </span>
  );
}

type PageProps = { searchParams: Promise<Record<string, string>> };

export default async function AdminListings({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = params.status ?? "all";
  const q = params.q ?? "";
  const city = params.city ?? "";
  const category = params.category ?? "";
  const page = Math.max(1, Number(params.page ?? 1));
  const offset = (page - 1) * PAGE_SIZE;

  const filterStatus = status === "all" ? undefined : status;
  const filterSearch = q || undefined;
  const filterCity = city || undefined;
  const filterCategory = category || undefined;

  const [listings, total, categories, cities] = await Promise.all([
    listListings({ status: filterStatus, search: filterSearch, city: filterCity, category: filterCategory, limit: PAGE_SIZE, offset }),
    countListings({ status: filterStatus, search: filterSearch, city: filterCity, category: filterCategory }),
    listCategories(),
    listCities(),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function filterUrl(overrides: Record<string, string>) {
    const base: Record<string, string> = { status, page: String(page) };
    if (q) base.q = q;
    if (city) base.city = city;
    if (category) base.category = category;
    const next = new URLSearchParams({ ...base, ...overrides });
    return `/admin/listings?${next}`;
  }

  const hasActiveFilters = q || city || category || status !== "all";

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1 className="a-page-title" style={{ margin: 0 }}>
          Listings
          <span style={{ marginLeft: "10px", fontSize: "15px", fontWeight: 500, color: "var(--a-ink-muted)" }}>
            {total.toLocaleString()}
          </span>
        </h1>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
        <form method="GET" action="/admin/listings" style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          {status !== "all" && <input type="hidden" name="status" value={status} />}
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search title or business…"
            className="a-input"
            style={{ width: "240px" }}
          />
          <select name="city" defaultValue={city} className="a-input" style={{ width: "160px" }}>
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
          <select name="category" defaultValue={category} className="a-input" style={{ width: "190px" }}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
          <button type="submit" className="a-btn a-btn-ghost">Filter</button>
          {hasActiveFilters && (
            <Link href="/admin/listings" className="a-btn a-btn-ghost" style={{ color: "var(--a-ink-muted)" }}>
              Clear
            </Link>
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
              fontSize: "12px",
              padding: "4px 10px",
              minHeight: "auto",
              ...(status === s
                ? { background: "var(--a-teal-glow)", color: "var(--a-teal)", borderColor: "var(--a-teal)" }
                : {}),
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
                <th>ID</th>
                <th>Title</th>
                <th>Business</th>
                <th>Location</th>
                <th>Placements</th>
                <th>Status</th>
                <th>Score</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "var(--a-ink-muted)" }}>
                    No listings found
                  </td>
                </tr>
              ) : (
                listings.map((l) => {
                  const cats = l.placement_categories ? l.placement_categories.split(",") : [];
                  const citySlugs = l.placement_cities ? l.placement_cities.split(",") : [];
                  return (
                    <tr key={l.id}>
                      <td style={{ color: "var(--a-ink-muted)", fontSize: "12px" }}>{l.id}</td>
                      <td>
                        <span style={{ fontWeight: 500 }}>{l.title}</span>
                        {l.tagline && (
                          <div style={{ fontSize: "12px", color: "var(--a-ink-muted)", marginTop: "2px" }}>
                            {l.tagline}
                          </div>
                        )}
                      </td>
                      <td style={{ color: "var(--a-ink-muted)", fontSize: "13px" }}>
                        {l.business_name ?? `#${l.business_id}`}
                      </td>
                      <td style={{ fontSize: "12px", color: "var(--a-ink-muted)" }}>
                        {l.location_city
                          ? `${l.location_city}${l.location_state ? `, ${l.location_state}` : ""}`
                          : citySlugs.length
                          ? citySlugs[0]
                          : "—"}
                      </td>
                      <td style={{ maxWidth: "200px" }}>
                        {cats.length === 0 && citySlugs.length === 0 ? (
                          <span style={{ color: "var(--a-ink-muted)", fontSize: "12px" }}>—</span>
                        ) : (
                          <div style={{ lineHeight: 1.6 }}>
                            {cats.map((c) => <PlacementPill key={c} slug={c} />)}
                            {citySlugs.length > 0 && (
                              <div style={{ marginTop: "2px" }}>
                                {citySlugs.map((c) => (
                                  <span
                                    key={c}
                                    style={{
                                      display: "inline-block",
                                      fontSize: "11px",
                                      padding: "1px 6px",
                                      borderRadius: "4px",
                                      background: "color-mix(in oklch, var(--a-teal) 12%, transparent)",
                                      color: "var(--a-teal)",
                                      marginRight: "3px",
                                      marginBottom: "2px",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {c}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td>{badge(l.status, l.unclaimed_flag)}</td>
                      <td style={{ color: "var(--a-ink-muted)", fontSize: "12px" }}>
                        {l.confidence_score != null ? `${l.confidence_score}%` : "—"}
                      </td>
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <Link
                          href={`/admin/listings/${l.id}`}
                          className="a-btn a-btn-ghost"
                          style={{ fontSize: "12px", padding: "4px 10px", minHeight: "auto" }}
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/listing/${l.title.toLowerCase().replace(/\s+/g, "-")}-${l.id}`}
                          target="_blank"
                          rel="noopener"
                          className="a-btn a-btn-ghost"
                          style={{ fontSize: "12px", padding: "4px 10px", minHeight: "auto", marginLeft: "4px" }}
                        >
                          View ↗
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderTop: "1px solid var(--a-border)",
              fontSize: "13px",
              color: "var(--a-ink-muted)",
            }}
          >
            <span>
              Page {page} of {totalPages} — {total.toLocaleString()} total
            </span>
            <div style={{ display: "flex", gap: "6px" }}>
              {page > 1 && (
                <Link href={filterUrl({ page: String(page - 1) })} className="a-btn a-btn-ghost" style={{ fontSize: "12px", padding: "4px 10px", minHeight: "auto" }}>
                  ← Prev
                </Link>
              )}
              {page < totalPages && (
                <Link href={filterUrl({ page: String(page + 1) })} className="a-btn a-btn-ghost" style={{ fontSize: "12px", padding: "4px 10px", minHeight: "auto" }}>
                  Next →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
