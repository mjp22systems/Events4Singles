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
        <h1 className="a-page-title a-inline-0ad5d5dc" >
          Businesses
          <span className="a-inline-a0bf08bc" >
            {businesses.length.toLocaleString()}
          </span>
        </h1>
        <Link href="/admin/businesses?add=1" className="a-btn a-btn-primary a-inline-65d1aa8a" >
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
        <input name="q" type="search" defaultValue={q} placeholder="Search business name…" className="a-input a-inline-ab674353"  />
        <select name="sort" defaultValue={sort} className="a-input a-filter-control" >
          {SORTS.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
        <button type="submit" className="a-btn a-btn-ghost a-inline-47390085" >Filter</button>
        {hasActiveFilters && <Link href="/admin/businesses" className="a-btn a-btn-ghost a-inline-47390085" >Clear</Link>}
      </form>

      <form method="POST" action="/admin/api/businesses/bulk">
        <input type="hidden" name="redirect" value="/admin/businesses" />
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
              <option value="delete">Delete</option>
            </select>
            <button type="submit" className="a-btn a-btn-ghost a-inline-65d1aa8a" >Apply</button>
          </div>
        <div className="a-table-wrap">
          <table className="a-table a-table--single-line">
            <thead>
              <tr>
                <th className="a-inline-b9c114f7" ></th>
                <th className="a-inline-672380eb" >#</th>
                <th className="a-inline-ab8ba9f4" >ID</th>
                <th>Name</th>
                <th className="a-inline-65906ce8" >Listings</th>
                <th>Website</th>
                <th className="a-inline-228c8711" >Status</th>
                <th className="a-inline-29fbde53" >Actions</th>
              </tr>
            </thead>
            <tbody>
              {businesses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="a-inline-ac953bfd" >
                    No businesses found
                  </td>
                </tr>
              ) : (
                businesses.map((b, index) => (
                  <tr key={b.id}>
                    <td><input type="checkbox" name="ids" value={b.id} className="bulk-check" /></td>
                    <td className="a-muted-small" >{index + 1}</td>
                    <td className="a-muted-small" >{b.id}</td>
                    <td className="a-inline-da6c85ac" >{b.name}</td>
                    <td>
                      <Link href={`/admin/listings?business_id=${b.id}`} className="a-inline-d862cb1b" >
                        {b.listing_count}
                      </Link>
                    </td>
                    <td className="a-inline-691df809"  title={b.website ?? undefined}>
                      {b.website ? (
                        <a href={b.website} target="_blank" rel="noopener" className="a-inline-bd37cbb4" >
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
