import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdminActionsMenu from "@/components/admin/actions-menu";
import AdminAddModal from "@/components/admin/add-modal";
import AdminBulkSelectAll from "@/components/admin/bulk-select-all";
import { createAdminBanner, listAdminBannerPlacements, listAdminBanners } from "@/lib/admin-db";

export const metadata: Metadata = { title: "Banners" };
export const dynamic = "force-dynamic";

const STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "approved", label: "Approved" },
  { value: "paused", label: "Paused" },
  { value: "rejected", label: "Rejected" },
];

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "title_asc", label: "Title A-Z" },
  { value: "status", label: "Status" },
];

const BADGE: Record<string, string> = {
  active: "a-badge-active",
  approved: "a-badge-active",
  pending: "a-badge-pending",
  paused: "a-badge-paused",
  rejected: "a-badge-deleted",
};

type PageProps = { searchParams: Promise<Record<string, string>> };

async function addBanner(formData: FormData) {
  "use server";
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  const linkUrl = String(formData.get("link_url") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const status = String(formData.get("status") ?? "pending");
  const placement = String(formData.get("placement") ?? "").trim();
  if (!imageUrl) return;
  await createAdminBanner({
    imageUrl,
    linkUrl: linkUrl || null,
    title: title || null,
    status,
    placement: placement || null,
  });
  redirect("/admin/banners");
}

function bannerLink(row: Awaited<ReturnType<typeof listAdminBanners>>[number]) {
  return row.link_url || row.click_url || "";
}

export default async function AdminBannersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = params.status ?? "all";
  const showAdd = params.add === "1";
  const q = params.q ?? "";
  const placement = params.placement ?? "";
  const sort = params.sort ?? "newest";
  const [banners, placements] = await Promise.all([
    listAdminBanners({
      search: q || undefined,
      status: status === "all" ? undefined : status,
      placement: placement || undefined,
      sort,
    }),
    listAdminBannerPlacements(),
  ]);

  const hasActiveFilters = q || placement || sort !== "newest" || status !== "all";

  return (
    <>
      <div className="admin-page-header">
        <h1 className="a-page-title" style={{ margin: 0 }}>
          Banners
          <span style={{ marginLeft: "10px", fontSize: "15px", fontWeight: 500, color: "var(--a-ink-muted)" }}>
            {banners.length.toLocaleString()}
          </span>
        </h1>
        <Link href="/admin/banners?add=1" className="a-btn a-btn-primary" style={{ fontSize: "13px" }}>
          + Add Banner
        </Link>
      </div>

      {showAdd && (
        <AdminAddModal title="Add banner" closeHref="/admin/banners">
          <form action={addBanner} className="admin-form-grid admin-form-grid--2">
            <div className="a-field">
              <label className="a-label">Title</label>
              <input className="a-input" name="title" placeholder="Banner title" />
            </div>
            <div className="a-field">
              <label className="a-label">Image URL</label>
              <input className="a-input" name="image_url" required placeholder="https://..." />
            </div>
            <div className="a-field">
              <label className="a-label">Link URL</label>
              <input className="a-input" name="link_url" placeholder="https://..." />
            </div>
            <div className="a-field">
              <label className="a-label">Status</label>
              <select className="a-input" name="status" defaultValue="pending">
                {STATUSES.filter((item) => item.value !== "all").map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>
            <div className="a-field">
              <label className="a-label">Placement</label>
              <input className="a-input" name="placement" placeholder="homepage" />
            </div>
            <div className="admin-form-actions">
              <Link href="/admin/banners" className="a-btn a-btn-ghost">Cancel</Link>
              <button type="submit" className="a-btn a-btn-primary">Add banner</button>
            </div>
          </form>
        </AdminAddModal>
      )}

      <form method="GET" action="/admin/banners" className="admin-filter-bar">
        <input name="q" type="search" defaultValue={q} placeholder="Search title, business, link..." className="a-input" style={{ flex: 1, minWidth: "160px" }} />
        <select name="status" defaultValue={status} className="a-input" style={{ flex: 1, minWidth: "140px" }}>
          {STATUSES.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
        <select name="placement" defaultValue={placement} className="a-input" style={{ flex: 1, minWidth: "140px" }}>
          <option value="">All Placements</option>
          {placements.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <select name="sort" defaultValue={sort} className="a-input" style={{ flex: 1, minWidth: "140px" }}>
          {SORTS.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
        <button className="a-btn a-btn-ghost" type="submit" style={{ flexShrink: 0 }}>Filter</button>
        {hasActiveFilters && <Link href="/admin/banners" className="a-btn a-btn-ghost" style={{ flexShrink: 0 }}>Clear</Link>}
      </form>

      <form method="POST" action="/admin/api/banners/bulk">
        <input type="hidden" name="redirect" value="/admin/banners" />
        <div className="a-card">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", borderBottom: "1px solid var(--a-border)" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--a-ink-muted)", cursor: "pointer" }}>
              <AdminBulkSelectAll />
              All
            </label>
            <select name="action" className="a-input" style={{ width: "160px" }}>
              <option value="">Bulk Action…</option>
              <option value="approve">Approve</option>
              <option value="reject">Reject</option>
              <option value="pause">Pause (hide)</option>
              <option value="activate">Reactivate</option>
              <option value="delete">Delete</option>
            </select>
            <button type="submit" className="a-btn a-btn-ghost" style={{ fontSize: "13px" }}>Apply</button>
          </div>
        <div className="a-table-wrap">
          <table className="a-table a-table--single-line a-table--banners">
            <colgroup>
              <col style={{ width: "36px" }} />
              <col style={{ width: "52px" }} />
              <col style={{ width: "50px" }} />
              <col style={{ width: "28%" }} />
              <col style={{ width: "19%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "90px" }} />
              <col style={{ width: "90px" }} />
              <col style={{ width: "72px" }} />
            </colgroup>
            <thead>
              <tr>
                <th></th>
                <th>#</th>
                <th>ID</th>
                <th>Banner</th>
                <th>Owner</th>
                <th>Placement</th>
                <th>Created</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "40px", color: "var(--a-ink-muted)" }}>
                    No banners found
                  </td>
                </tr>
              ) : banners.map((banner, index) => {
                const link = bannerLink(banner);
                const statusValue = banner.status ?? "active";
                return (
                  <tr key={banner.id}>
                    <td><input type="checkbox" name="ids" value={banner.id} className="bulk-check" /></td>
                    <td style={{ color: "var(--a-ink-muted)", fontSize: "12px" }}>{index + 1}</td>
                    <td style={{ color: "var(--a-ink-muted)", fontSize: "12px" }}>{banner.id}</td>
                    <td>
                      <div className="admin-banner-cell">
                        <img
                          className="admin-banner-cell__image"
                          src={banner.image_url}
                          alt={banner.alt_text ?? banner.title ?? "Banner"}
                        />
                        <div className="admin-banner-cell__text">{banner.title ?? banner.alt_text ?? "Untitled banner"}</div>
                      </div>
                    </td>
                    <td style={{ fontSize: "12px", color: "var(--a-ink-muted)" }}>
                      <div>{banner.business_name ?? banner.billing_email ?? "No owner linked"}</div>
                      {banner.account_id && <div style={{ marginTop: "3px" }}>Account {banner.account_id}</div>}
                    </td>
                    <td style={{ fontSize: "12px", color: "var(--a-ink-muted)" }}>{banner.placement ?? "—"}</td>
                    <td style={{ fontSize: "12px", color: "var(--a-ink-muted)" }}>
                      {banner.created_at ? new Date(banner.created_at).toLocaleDateString("en-AU") : "—"}
                    </td>
                    <td>
                      <span className={`a-badge ${BADGE[statusValue] ?? "a-badge-paused"}`}>{statusValue}</span>
                    </td>
                    <td className="a-table__actions-cell">
                      {link ? (
                        <AdminActionsMenu>
                          <a href={link} target="_blank" rel="noopener">Visit</a>
                        </AdminActionsMenu>
                      ) : (
                        <span style={{ color: "var(--a-ink-muted)", fontSize: "12px" }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        </div>
      </form>
    </>
  );
}
