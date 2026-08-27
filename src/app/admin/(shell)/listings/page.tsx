import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdminActionsMenu from "@/components/admin/actions-menu";
import AdminAddModal from "@/components/admin/add-modal";
import AdminBulkSelectAll from "@/components/admin/bulk-select-all";
import { createListing, listListings, countListings, listCategories, listCities, listBusinesses } from "@/lib/admin-db";

export const metadata: Metadata = { title: "Listings" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

const STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "unclaimed", label: "Unclaimed" },
  { value: "paused", label: "Paused" },
  { value: "expired", label: "Expired" },
  { value: "archived", label: "Archived" },
  { value: "deleted", label: "Deleted" },
];

const SORTS = [
  { value: "id_desc", label: "Newest First" },
  { value: "id_asc", label: "Oldest First" },
  { value: "title_asc", label: "Title A-Z" },
  { value: "title_desc", label: "Title Z-A" },
  { value: "status", label: "Status" },
  { value: "score_desc", label: "Score (High)" },
  { value: "city_asc", label: "City A-Z" },
];

const REVIEW_FILTERS = [
  { value: "", label: "All Review States" },
  { value: "needs-review", label: "Needs Review" },
  { value: "tbc", label: "TBC Placement" },
  { value: "missing-contact", label: "Missing Contact" },
];

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
      className="a-inline-db6d29ce" 
    >
      {slug}
    </span>
  );
}

function ReviewPill({ label }: { label: string }) {
  return <span className="a-review-pill">{label}</span>;
}

function reviewReasons(listing: {
  image_url: string | null;
  confidence_score: number | null;
  placement_categories: string | null;
  placement_cities: string | null;
  web: string | null;
  email: string | null;
  phone: string | null;
  mobile: string | null;
}) {
  const cats = listing.placement_categories ? listing.placement_categories.split(",") : [];
  const cities = listing.placement_cities ? listing.placement_cities.split(",") : [];
  const reasons: string[] = [];
  if (!cats.length && !cities.length) reasons.push("no placement");
  if (cats.includes("tbc") || cities.includes("tbc")) reasons.push("TBC");
  if (!listing.image_url?.trim()) reasons.push("image");
  if (listing.confidence_score != null && listing.confidence_score < 70) reasons.push("confidence");
  if (![listing.web, listing.email, listing.phone, listing.mobile].some((value) => value?.trim())) reasons.push("contact");
  return reasons;
}

type PageProps = { searchParams: Promise<Record<string, string>> };

async function addListing(formData: FormData) {
  "use server";
  const title = String(formData.get("title") ?? "").trim();
  const businessId = Number(formData.get("business_id"));
  const status = String(formData.get("status") ?? "pending");
  const locationCity = String(formData.get("location_city") ?? "").trim();
  if (!title) return;
  const id = await createListing({
    title,
    businessId: Number.isFinite(businessId) && businessId > 0 ? businessId : null,
    status,
    locationCity: locationCity || null,
  });
  if (id) redirect(`/admin/listings/${id}`);
}

export default async function AdminListings({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = params.status ?? "all";
  const showAdd = params.add === "1";
  const q = params.q ?? "";
  const city = params.city ?? "";
  const category = params.category ?? "";
  const review = params.review ?? "";
  const sort = params.sort ?? "id_desc";
  const businessId = Number(params.business_id ?? "");
  const page = Math.max(1, Number(params.page ?? 1));
  const offset = (page - 1) * PAGE_SIZE;

  const filterStatus = status === "all" ? undefined : status;
  const filterSearch = q || undefined;
  const filterCity = city || undefined;
  const filterCategory = category || undefined;
  const filterReview = review || undefined;
  const filterBusinessId = Number.isFinite(businessId) && businessId > 0 ? businessId : undefined;

  const [listings, total, categories, cities, businesses] = await Promise.all([
    listListings({ status: filterStatus, search: filterSearch, city: filterCity, category: filterCategory, businessId: filterBusinessId, review: filterReview, sort, limit: PAGE_SIZE, offset }),
    countListings({ status: filterStatus, search: filterSearch, city: filterCity, category: filterCategory, businessId: filterBusinessId, review: filterReview }),
    listCategories(),
    listCities(),
    listBusinesses(),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function filterUrl(overrides: Record<string, string>) {
    const base: Record<string, string> = { status, page: String(page) };
    if (q) base.q = q;
    if (city) base.city = city;
    if (category) base.category = category;
    if (review) base.review = review;
    if (filterBusinessId) base.business_id = String(filterBusinessId);
    if (sort !== "id_desc") base.sort = sort;
    const next = new URLSearchParams({ ...base, ...overrides });
    return `/admin/listings?${next}`;
  }

  const currentPath = `/admin/listings?${new URLSearchParams(Object.fromEntries(Object.entries({ status, q, city, category, review, sort: sort !== "id_desc" ? sort : "", business_id: filterBusinessId ? String(filterBusinessId) : "", page: String(page) }).filter(([, value]) => value)))}`;
  const hasActiveFilters = q || city || category || review || filterBusinessId || status !== "all" || sort !== "id_desc";

  return (
    <>
      <div className="admin-page-header">
        <h1 className="a-page-title a-inline-0ad5d5dc" >
          Listings
          <span className="a-inline-a0bf08bc" >
            {total.toLocaleString()}
          </span>
        </h1>
        <Link href="/admin/listings?add=1" className="a-btn a-btn-primary a-inline-65d1aa8a" >
          + Add Listing
        </Link>
      </div>

      {showAdd && (
        <AdminAddModal title="Add listing" closeHref="/admin/listings">
          <form action={addListing} className="admin-form-grid admin-form-grid--2">
            <div className="a-field admin-field--wide">
              <label className="a-label">Title</label>
              <input className="a-input" name="title" required placeholder="Listing title" />
            </div>
            <div className="a-field">
              <label className="a-label">Business</label>
              <input className="a-input" name="business_id" inputMode="numeric" placeholder="Business ID, optional" />
            </div>
            <div className="a-field">
              <label className="a-label">Status</label>
              <select name="status" className="a-input" defaultValue="pending">
                {STATUSES.filter((s) => s.value !== "all").map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="a-field">
              <label className="a-label">City</label>
              <input className="a-input" name="location_city" placeholder="Sydney" />
            </div>
            <div className="admin-form-actions">
              <Link href="/admin/listings" className="a-btn a-btn-ghost">Cancel</Link>
              <button type="submit" className="a-btn a-btn-primary">Add listing</button>
            </div>
          </form>
        </AdminAddModal>
      )}

      {/* Filters */}
      <div>
        <form method="GET" action="/admin/listings" className="admin-filter-bar">
          <input name="q" type="search" defaultValue={q} placeholder="Search title or business…" className="a-input a-inline-ab674353"  />
          <select name="status" defaultValue={status} className="a-input a-inline-37a89abe" >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select name="review" defaultValue={review} className="a-input a-inline-37a89abe" >
            {REVIEW_FILTERS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select name="city" defaultValue={city} className="a-input a-inline-37a89abe" >
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c.slug} value={c.slug}>{c.label}</option>
            ))}
          </select>
          <select name="category" defaultValue={category} className="a-input a-inline-37a89abe" >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.label}</option>
            ))}
          </select>
          <select name="business_id" defaultValue={filterBusinessId ? String(filterBusinessId) : ""} className="a-input a-inline-37a89abe" >
            <option value="">All Businesses</option>
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>#{b.id} {b.name}</option>
            ))}
          </select>
          <select name="sort" defaultValue={sort} className="a-input a-inline-37a89abe" >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <button type="submit" className="a-btn a-btn-ghost a-inline-47390085" >Filter</button>
          {hasActiveFilters && (
            <Link href="/admin/listings" className="a-btn a-btn-ghost a-inline-d47b2105" >Clear</Link>
          )}
        </form>
      </div>

      <form method="POST" action="/admin/api/listings/bulk">
        <input type="hidden" name="redirect" value={currentPath} />
        <div className="a-card">
          <div className="a-inline-2b655313" >
            <label className="a-inline-3ae3b235" >
              <AdminBulkSelectAll />
              All
            </label>
            <select name="action" className="a-input a-inline-dc2a05f8" >
              <option value="">Bulk Action…</option>
              <option value="activate">Activate</option>
              <option value="pause">Pause (hide)</option>
              <option value="archive">Archive</option>
              <option value="delete">Delete</option>
            </select>
            <button type="submit" className="a-btn a-btn-ghost a-inline-65d1aa8a" >Apply</button>
          </div>
        <div className="a-table-wrap">
          <table className="a-table a-table--single-line a-table--listings">
            <colgroup>
              <col className="a-listings-col-check" />
              <col className="a-listings-col-row" />
              <col className="a-listings-col-id" />
              <col className="a-listings-col-title" />
              <col className="a-listings-col-business" />
              <col className="a-listings-col-location" />
              <col className="a-listings-col-placements" />
              <col className="a-listings-col-status" />
              <col className="a-listings-col-score" />
              <col className="a-listings-col-actions" />
            </colgroup>
            <thead>
              <tr>
                <th></th>
                <th>#</th>
                <th>ID</th>
                <th>Title</th>
                <th>Business</th>
                <th>Location</th>
                <th>Placements</th>
                <th>Status</th>
                <th>Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.length === 0 ? (
                <tr>
                  <td colSpan={10} className="a-inline-ac953bfd" >
                    No listings found
                  </td>
                </tr>
              ) : (
                listings.map((l, index) => {
                  const cats = l.placement_categories ? l.placement_categories.split(",") : [];
                  const citySlugs = l.placement_cities ? l.placement_cities.split(",") : [];
                  return (
                    <tr key={l.id}>
                      <td><input type="checkbox" name="ids" value={l.id} className="bulk-check" /></td>
                      <td className="a-inline-5d69a8cc" >{offset + index + 1}</td>
                      <td className="a-inline-5d69a8cc" >{l.id}</td>
                      <td title={[l.title, l.tagline].filter(Boolean).join(" · ")}>
                        <span className="a-inline-da6c85ac" >{l.title}</span>
                        {reviewReasons(l).length > 0 && (
                          <span className="a-review-pill-row">
                            {reviewReasons(l).map((reason) => <ReviewPill key={reason} label={reason} />)}
                          </span>
                        )}
                      </td>
                      <td className="a-inline-24fc8284"  title={l.business_name ?? (l.business_id ? `#${l.business_id}` : undefined)}>
                        {l.business_name ?? `#${l.business_id}`}
                      </td>
                      <td className="a-inline-691df809" >
                        {l.location_city
                          ? `${l.location_city}${l.location_state ? `, ${l.location_state}` : ""}`
                          : citySlugs.length
                          ? citySlugs[0]
                          : "—"}
                      </td>
                      <td className="a-inline-b7687fbf" >
                        {cats.length === 0 && citySlugs.length === 0 ? (
                          <span className="a-inline-5d69a8cc" >—</span>
                        ) : (
                          <div className="a-inline-abf199b1"  title={[...cats, ...citySlugs].join(", ")}>
                            {cats.slice(0, 2).map((c) => <PlacementPill key={c} slug={c} />)}
                            {cats.length + citySlugs.length > 2 && (
                              <span className="a-inline-43294372" >+{cats.length + citySlugs.length - 2}</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td>{badge(l.status, l.unclaimed_flag)}</td>
                      <td className="a-inline-5d69a8cc" >
                        {l.confidence_score != null ? `${l.confidence_score}%` : "—"}
                      </td>
                      <td className="a-table__actions-cell">
                        <AdminActionsMenu>
                          <Link href={`/admin/listings/${l.id}`}>Edit</Link>
                          <Link
                            href={`/listing/${l.title.toLowerCase().replace(/\s+/g, "-")}-${l.id}`}
                            target="_blank"
                            rel="noopener"
                          >
                            View public
                          </Link>
                        </AdminActionsMenu>
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
            className="a-inline-d39120f1" 
          >
            <span>
              Page {page} of {totalPages} — {total.toLocaleString()} total
            </span>
            <div className="a-inline-2631df32" >
              {page > 1 && (
                <Link href={filterUrl({ page: String(page - 1) })} className="a-btn a-btn-ghost a-inline-fed8595c" >
                  ← Prev
                </Link>
              )}
              {page < totalPages && (
                <Link href={filterUrl({ page: String(page + 1) })} className="a-btn a-btn-ghost a-inline-fed8595c" >
                  Next →
                </Link>
              )}
            </div>
          </div>
        )}
        </div>
      </form>
    </>
  );
}
