import type { Metadata } from "next";
import Link from "next/link";
import AdminActionsMenu from "@/components/admin/actions-menu";
import AdminBulkSelectAll from "@/components/admin/bulk-select-all";
import { getNoImageListings, getLowConfidenceListings, getUnplacedListings } from "@/lib/admin-db";

export const metadata: Metadata = { title: "Listing Review" };
export const dynamic = "force-dynamic";

const TABS = [
  { id: "no-image", label: "No Image" },
  { id: "low-confidence", label: "Low Confidence" },
  { id: "unplaced", label: "Unplaced" },
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

type PageProps = { searchParams: Promise<Record<string, string>> };

export default async function AdminTools({ searchParams }: PageProps) {
  const params = await searchParams;
  const tab = params.tab ?? "no-image";

  const noImage = tab === "no-image" ? await getNoImageListings() : [];
  const lowConf = tab === "low-confidence" ? await getLowConfidenceListings(70) : [];
  const unplaced = tab === "unplaced" ? await getUnplacedListings() : [];

  const rows = tab === "no-image" ? noImage : tab === "low-confidence" ? lowConf : unplaced;

  return (
    <>
      <div className="admin-page-header">
        <h1 className="a-page-title" style={{ margin: 0 }}>
          Listing Review
          <span style={{ marginLeft: "10px", fontSize: "15px", fontWeight: 500, color: "var(--a-ink-muted)" }}>
            {rows.length} issues
          </span>
        </h1>
      </div>

      <form method="GET" action="/admin/tools" className="admin-filter-bar">
        <select name="tab" defaultValue={tab} className="a-input" style={{ flex: 1, minWidth: "160px" }}>
          {TABS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
        <button type="submit" className="a-btn a-btn-ghost" style={{ flexShrink: 0 }}>Filter</button>
      </form>

      <form method="POST" action="/admin/api/listings/bulk">
        <input type="hidden" name="redirect" value={`/admin/tools?tab=${tab}`} />
        <div className="a-card">
          {rows.length === 0 ? (
            <div className="a-empty" style={{ padding: "48px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>✓</div>
              <div className="a-empty__text">No issues found</div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", borderBottom: "1px solid var(--a-border)" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--a-ink-muted)", cursor: "pointer" }}>
                  <AdminBulkSelectAll />
                  All
                </label>
                <select name="action" className="a-input" style={{ width: "160px" }}>
                  <option value="">Bulk Action…</option>
                  <option value="activate">Activate</option>
                  <option value="archive">Archive</option>
                  <option value="delete">Delete</option>
                </select>
                <button type="submit" className="a-btn a-btn-ghost" style={{ fontSize: "13px" }}>Apply</button>
              </div>
              <div className="a-table-wrap">
                <table className={`a-table a-table--single-line a-table--listing-review a-table--listing-review-${tab}`}>
                  <colgroup>
                    <col className="a-review-col-check" />
                    <col className="a-review-col-row" />
                    <col className="a-review-col-id" />
                    <col className="a-review-col-title" />
                    <col className="a-review-col-business" />
                    {tab === "low-confidence" && <col className="a-review-col-score" />}
                    {tab === "no-image" && <col className="a-review-col-image" />}
                    <col className="a-review-col-status" />
                    <col className="a-review-col-actions" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th></th>
                      <th>#</th>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Business</th>
                      {tab === "low-confidence" && <th>Score</th>}
                      {tab === "no-image" && <th>Image URL</th>}
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((l, index) => (
                      <tr key={l.id}>
                        <td><input type="checkbox" name="ids" value={l.id} className="bulk-check" /></td>
                        <td style={{ color: "var(--a-ink-muted)", fontSize: "12px" }}>{index + 1}</td>
                        <td style={{ color: "var(--a-ink-muted)", fontSize: "12px" }}>{l.id}</td>
                        <td title={l.title} style={{ fontWeight: 500 }}>{l.title}</td>
                        <td style={{ color: "var(--a-ink-muted)", fontSize: "13px" }} title={l.business_name ?? undefined}>{l.business_name ?? "—"}</td>
                        {tab === "low-confidence" && (
                          <td style={{ fontWeight: 600, fontSize: "12px", color: (l.confidence_score ?? 0) < 50 ? "var(--a-danger)" : "var(--a-warning)" }}>
                            {l.confidence_score}%
                          </td>
                        )}
                        {tab === "no-image" && (
                          <td title={l.image_url || undefined} style={{ fontSize: "11px", color: "var(--a-ink-muted)" }}>
                            {l.image_url || "null"}
                          </td>
                        )}
                        <td>
                          <span className={`a-badge ${BADGE[l.status ?? ""] ?? "a-badge-paused"}`}>
                            {l.status ?? "unknown"}
                          </span>
                        </td>
                        <td className="a-table__actions-cell">
                          <AdminActionsMenu>
                            <Link href={`/admin/listings/${l.id}`}>Edit</Link>
                          </AdminActionsMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </form>
    </>
  );
}
