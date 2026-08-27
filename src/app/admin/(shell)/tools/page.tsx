import type { Metadata } from "next";
import Link from "next/link";
import AdminActionsMenu from "@/components/admin/actions-menu";
import AdminBulkSelectAll from "@/components/admin/bulk-select-all";
import { getNeedsReviewListings, getNoImageListings, getLowConfidenceListings, getTbcPlacementListings, getUnplacedListings } from "@/lib/admin-db";

export const metadata: Metadata = { title: "Listing Review" };
export const dynamic = "force-dynamic";

const TABS = [
  { id: "needs-review", label: "Needs Review" },
  { id: "tbc", label: "TBC Placement" },
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
  const tab = params.tab ?? "needs-review";

  const needsReview = tab === "needs-review" ? await getNeedsReviewListings() : [];
  const tbc = tab === "tbc" ? await getTbcPlacementListings() : [];
  const noImage = tab === "no-image" ? await getNoImageListings() : [];
  const lowConf = tab === "low-confidence" ? await getLowConfidenceListings(70) : [];
  const unplaced = tab === "unplaced" ? await getUnplacedListings() : [];

  const rows =
    tab === "needs-review"
      ? needsReview
      : tab === "tbc"
        ? tbc
        : tab === "no-image"
          ? noImage
          : tab === "low-confidence"
            ? lowConf
            : unplaced;

  return (
    <>
      <div className="admin-page-header">
        <h1 className="a-page-title a-inline-0ad5d5dc" >
          Listing Review
          <span className="a-inline-a0bf08bc" >
            {rows.length} issues
          </span>
        </h1>
      </div>

      <form method="GET" action="/admin/tools" className="admin-filter-bar">
        <select name="tab" defaultValue={tab} className="a-input a-inline-ab674353" >
          {TABS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
        <button type="submit" className="a-btn a-btn-ghost a-inline-47390085" >Filter</button>
      </form>

      <form method="POST" action="/admin/api/listings/bulk">
        <input type="hidden" name="redirect" value={`/admin/tools?tab=${tab}`} />
        <div className="a-card">
          {rows.length === 0 ? (
            <div className="a-empty a-inline-1d446031" >
              <div className="a-inline-afcda366" >✓</div>
              <div className="a-empty__text">No issues found</div>
            </div>
          ) : (
            <>
              <div className="a-inline-2b655313" >
                <label className="a-inline-3ae3b235" >
                  <AdminBulkSelectAll />
                  All
                </label>
                <select name="action" className="a-input a-inline-dc2a05f8" >
                  <option value="">Bulk Action…</option>
                  <option value="activate">Activate</option>
                  <option value="archive">Archive</option>
                  <option value="delete">Delete</option>
                </select>
                <button type="submit" className="a-btn a-btn-ghost a-inline-65d1aa8a" >Apply</button>
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
                        <td className="a-muted-small" >{index + 1}</td>
                        <td className="a-muted-small" >{l.id}</td>
                        <td title={l.title} className="a-inline-da6c85ac" >{l.title}</td>
                        <td className="a-inline-24fc8284"  title={l.business_name ?? undefined}>{l.business_name ?? "—"}</td>
                        {tab === "low-confidence" && (
                          <td className={`a-confidence-score${(l.confidence_score ?? 0) < 50 ? " is-danger" : " is-warning"}`}>
                            {l.confidence_score}%
                          </td>
                        )}
                        {tab === "no-image" && (
                          <td title={l.image_url || undefined} className="a-inline-bb3abc5b" >
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
