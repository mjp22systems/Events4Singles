import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdminActionsMenu from "@/components/admin/actions-menu";
import AdminAddModal from "@/components/admin/add-modal";
import AdminBulkSelectAll from "@/components/admin/bulk-select-all";
import { createBusiness, listBusinesses } from "@/lib/admin-db";

export const metadata: Metadata = { title: "Businesses" };
export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<Record<string, string>> };

const SORTS = [
  { value: "name_asc", label: "Name A-Z" },
  { value: "name_desc", label: "Name Z-A" },
  { value: "listings_desc", label: "Most Listings" },
  { value: "listings_asc", label: "Fewest Listings" },
  { value: "newest", label: "Newest" },
];

async function addBusiness(formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const logoUrl = String(formData.get("logo_url") ?? "").trim();
  if (!name) return;
  const id = await createBusiness({
    name,
    website: website || null,
    description: description || null,
    logoUrl: logoUrl || null,
  });
  if (id) redirect(`/admin/businesses/${id}`);
}

export default async function AdminBusinesses({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q ?? "";
  const sort = params.sort ?? "name_asc";
  const showAdd = params.add === "1";
  const businesses = await listBusinesses(q || undefined, sort);
  const hasActiveFilters = q || sort !== "name_asc";

  return (
    <>
      <div className="admin-page-header">
        <h1 className="a-page-title" style={{ margin: 0 }}>
          Businesses
          <span style={{ marginLeft: "10px", fontSize: "15px", fontWeight: 500, color: "var(--a-ink-muted)" }}>
            {businesses.length.toLocaleString()}
          </span>
        </h1>
        <Link href="/admin/businesses?add=1" className="a-btn a-btn-primary" style={{ fontSize: "13px" }}>
          + Add Business
        </Link>
      </div>

      {showAdd && (
        <AdminAddModal title="Add business" closeHref="/admin/businesses">
          <form action={addBusiness} className="admin-form-grid admin-form-grid--2">
            <div className="a-field">
              <label className="a-label">Name</label>
              <input className="a-input" name="name" required placeholder="Business name" />
            </div>
            <div className="a-field">
              <label className="a-label">Website</label>
              <input className="a-input" name="website" type="url" placeholder="https://example.com" />
            </div>
            <div className="a-field">
              <label className="a-label">Logo URL</label>
              <input className="a-input" name="logo_url" type="url" placeholder="https://..." />
            </div>
            <div className="a-field">
              <label className="a-label">Description</label>
              <input className="a-input" name="description" placeholder="Short internal note or public description" />
            </div>
            <div className="admin-form-actions">
              <Link href="/admin/businesses" className="a-btn a-btn-ghost">Cancel</Link>
              <button type="submit" className="a-btn a-btn-primary">Add business</button>
            </div>
          </form>
        </AdminAddModal>
      )}

      <form method="GET" action="/admin/businesses" className="admin-filter-bar">
        <input name="q" type="search" defaultValue={q} placeholder="Search business name…" className="a-input" style={{ flex: 1, minWidth: "160px" }} />
        <select name="sort" defaultValue={sort} className="a-input" style={{ flex: 1, minWidth: "140px" }}>
          {SORTS.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
        <button type="submit" className="a-btn a-btn-ghost" style={{ flexShrink: 0 }}>Filter</button>
        {hasActiveFilters && <Link href="/admin/businesses" className="a-btn a-btn-ghost" style={{ flexShrink: 0 }}>Clear</Link>}
      </form>

      <form method="POST" action="/admin/api/businesses/bulk">
        <input type="hidden" name="redirect" value="/admin/businesses" />
        <div className="a-card">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", borderBottom: "1px solid var(--a-border)" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--a-ink-muted)", cursor: "pointer" }}>
              <AdminBulkSelectAll />
              All
            </label>
            <select name="action" className="a-input" style={{ width: "160px" }}>
              <option value="">Bulk Action…</option>
              <option value="activate">Activate</option>
              <option value="pause">Pause (hide)</option>
              <option value="delete">Delete</option>
            </select>
            <button type="submit" className="a-btn a-btn-ghost" style={{ fontSize: "13px" }}>Apply</button>
          </div>
        <div className="a-table-wrap">
          <table className="a-table a-table--single-line">
            <thead>
              <tr>
                <th style={{ width: "36px" }}></th>
                <th style={{ width: "52px" }}>#</th>
                <th style={{ width: "50px" }}>ID</th>
                <th>Name</th>
                <th style={{ width: "60px" }}>Listings</th>
                <th>Website</th>
                <th style={{ width: "85px" }}>Status</th>
                <th style={{ width: "56px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {businesses.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "var(--a-ink-muted)" }}>
                    No businesses found
                  </td>
                </tr>
              ) : (
                businesses.map((b, index) => (
                  <tr key={b.id}>
                    <td><input type="checkbox" name="ids" value={b.id} className="bulk-check" /></td>
                    <td style={{ color: "var(--a-ink-muted)", fontSize: "12px" }}>{index + 1}</td>
                    <td style={{ color: "var(--a-ink-muted)", fontSize: "12px" }}>{b.id}</td>
                    <td style={{ fontWeight: 500 }}>{b.name}</td>
                    <td>
                      <Link href={`/admin/listings?business_id=${b.id}`} style={{ color: "var(--a-teal)", fontSize: "13px" }}>
                        {b.listing_count}
                      </Link>
                    </td>
                    <td style={{ fontSize: "12px", color: "var(--a-ink-muted)" }} title={b.website ?? undefined}>
                      {b.website ? (
                        <a href={b.website} target="_blank" rel="noopener" style={{ color: "var(--a-teal)", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {b.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                        </a>
                      ) : "—"}
                    </td>
                    <td>
                      <span className={`a-badge ${b.status === "paused" ? "a-badge-paused" : b.status === "deleted" ? "a-badge-deleted" : "a-badge-active"}`}>
                        {b.status ?? "active"}
                      </span>
                    </td>
                    <td className="a-table__actions-cell">
                      <AdminActionsMenu>
                        <Link href={`/admin/businesses/${b.id}`}>Edit</Link>
                      </AdminActionsMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </div>
      </form>
    </>
  );
}
