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
        <h1 className="a-page-title a-inline-0ad5d5dc" >
          Banners
          <span className="a-inline-a0bf08bc" >
            {banners.length.toLocaleString()}
          </span>
        </h1>
        <Link href="/admin/banners?add=1" className="a-btn a-btn-primary a-inline-65d1aa8a" >
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
        <input name="q" type="search" defaultValue={q} placeholder="Search title, business, link..." className="a-input a-inline-ab674353"  />
        <select name="status" defaultValue={status} className="a-input a-inline-37a89abe" >
          {STATUSES.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
        <select name="placement" defaultValue={placement} className="a-input a-inline-37a89abe" >
          <option value="">All Placements</option>
          {placements.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <select name="sort" defaultValue={sort} className="a-input a-inline-37a89abe" >
          {SORTS.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
        <button className="a-btn a-btn-ghost a-inline-47390085" type="submit" >Filter</button>
        {hasActiveFilters && <Link href="/admin/banners" className="a-btn a-btn-ghost a-inline-47390085" >Clear</Link>}
      </form>

      <form method="POST" action="/admin/api/banners/bulk">
        <input type="hidden" name="redirect" value="/admin/banners" />
        <div className="a-card">
          <div className="a-inline-2b655313" >
            <label className="a-inline-3ae3b235" >
              <AdminBulkSelectAll />
              All
            </label>
            <select name="action" className="a-input a-inline-dc2a05f8" >
              <option value="">Bulk Action…</option>
              <option value="approve">Approve</option>
              <option value="reject">Reject</option>
              <option value="pause">Pause (hide)</option>
              <option value="activate">Reactivate</option>
              <option value="delete">Delete</option>
            </select>
            <button type="submit" className="a-btn a-btn-ghost a-inline-65d1aa8a" >Apply</button>
          </div>
        <div className="a-table-wrap">
          <table className="a-table a-table--single-line a-table--banners">
            <colgroup>
              <col className="a-inline-b9c114f7"  />
              <col className="a-inline-672380eb"  />
              <col className="a-inline-ab8ba9f4"  />
              <col className="a-inline-94308b39"  />
              <col className="a-inline-e68ac0ac"  />
              <col className="a-inline-48c753a6"  />
              <col className="a-inline-54442ae7"  />
              <col className="a-inline-54442ae7"  />
              <col className="a-inline-49412b1d"  />
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
                  <td colSpan={9} className="a-inline-ac953bfd" >
                    No banners found
                  </td>
                </tr>
              ) : banners.map((banner, index) => {
                const link = bannerLink(banner);
                const statusValue = banner.status ?? "active";
                return (
                  <tr key={banner.id}>
                    <td><input type="checkbox" name="ids" value={banner.id} className="bulk-check" /></td>
                    <td className="a-inline-5d69a8cc" >{index + 1}</td>
                    <td className="a-inline-5d69a8cc" >{banner.id}</td>
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
                    <td className="a-inline-691df809" >
                      <div>{banner.business_name ?? banner.billing_email ?? "No owner linked"}</div>
                      {banner.account_id && <div className="a-inline-046a013e" >Account {banner.account_id}</div>}
                    </td>
                    <td className="a-inline-691df809" >{banner.placement ?? "—"}</td>
                    <td className="a-inline-691df809" >
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
                        <span className="a-inline-5d69a8cc" >—</span>
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
