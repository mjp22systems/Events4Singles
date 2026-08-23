import type { Metadata } from "next";
import Link from "next/link";
import AdminActionsMenu from "@/components/admin/actions-menu";
import AdminBulkSelectAll from "@/components/admin/bulk-select-all";
import {
  approveBusinessClaimRequest,
  listBusinessClaimRequests,
  rejectBusinessClaimRequest,
} from "@/lib/admin-db";

export const metadata: Metadata = { title: "Business Requests" };
export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<{ status?: string; sort?: string }> };

const STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All Statuses" },
];

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "status", label: "Status" },
];

const BADGE: Record<string, string> = {
  pending: "a-badge-pending",
  approved: "a-badge-active",
  rejected: "a-badge-deleted",
};

async function approveRequest(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  if (id) await approveBusinessClaimRequest(id);
}

async function rejectRequest(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const notes = String(formData.get("notes") ?? "");
  if (id) await rejectBusinessClaimRequest(id, notes || undefined);
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-AU");
}

export default async function AdminBusinessRequestsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = params.status ?? "pending";
  const sort = params.sort ?? "newest";
  const requests = await listBusinessClaimRequests(status);

  const sorted = [...requests].sort((a, b) => {
    if (sort === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sort === "status") return a.status.localeCompare(b.status);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const hasActiveFilters = status !== "pending" || sort !== "newest";
  const currentPath = `/admin/business-requests?status=${status}${sort !== "newest" ? `&sort=${sort}` : ""}`;

  return (
    <>
      <div className="admin-page-header">
        <h1 className="a-page-title" style={{ margin: 0 }}>
          Business Requests
          <span style={{ marginLeft: "10px", fontSize: "15px", fontWeight: 500, color: "var(--a-ink-muted)" }}>
            {sorted.length.toLocaleString()}
          </span>
        </h1>
      </div>

      <form method="GET" action="/admin/business-requests" className="admin-filter-bar">
        <select name="status" defaultValue={status} className="a-input" style={{ flex: 1, minWidth: "140px" }}>
          {STATUSES.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
        <select name="sort" defaultValue={sort} className="a-input" style={{ flex: 1, minWidth: "140px" }}>
          {SORTS.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
        <button type="submit" className="a-btn a-btn-ghost" style={{ flexShrink: 0 }}>Filter</button>
        {hasActiveFilters && <Link href="/admin/business-requests" className="a-btn a-btn-ghost" style={{ flexShrink: 0 }}>Clear</Link>}
      </form>

      <form method="POST" action="/admin/api/business-requests/bulk">
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
            </select>
            <button type="submit" className="a-btn a-btn-ghost" style={{ fontSize: "13px" }}>Apply</button>
          </div>
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th style={{ width: "36px" }}></th>
                  <th style={{ width: "52px" }}>#</th>
                  <th>Business</th>
                  <th>Requested by</th>
                  <th>Contact</th>
                  <th style={{ width: "90px" }}>Status</th>
                  <th style={{ width: "56px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "var(--a-ink-muted)" }}>
                      No business requests found
                    </td>
                  </tr>
                ) : sorted.map((request, index) => (
                  <tr key={request.id}>
                    <td><input type="checkbox" name="ids" value={request.id} className="bulk-check" /></td>
                    <td style={{ color: "var(--a-ink-muted)", fontSize: "12px" }}>{index + 1}</td>
                    <td>
                      <div style={{ fontWeight: 650 }}>{request.business_name}</div>
                      <div style={{ fontSize: "12px", color: "var(--a-ink-muted)", marginTop: "3px" }}>
                        {[request.city, request.website].filter(Boolean).join(" · ") || "No website/city supplied"}
                      </div>
                      {request.message && (
                        <div style={{ fontSize: "12px", color: "var(--a-ink-muted)", marginTop: "6px" }}>
                          {request.message}
                        </div>
                      )}
                    </td>
                    <td style={{ fontSize: "12px", color: "var(--a-ink-muted)" }}>
                      <div>{request.portal_email ?? "No email"}</div>
                      <div style={{ marginTop: "3px" }}>Account {request.account_id}</div>
                      <div style={{ marginTop: "3px" }}>Requested {formatDate(request.created_at)}</div>
                    </td>
                    <td style={{ fontSize: "12px", color: "var(--a-ink-muted)" }}>
                      <div>{request.contact_email ?? "—"}</div>
                      <div style={{ marginTop: "3px" }}>{request.phone ?? "—"}</div>
                    </td>
                    <td>
                      <span className={`a-badge ${BADGE[request.status] ?? "a-badge-paused"}`}>
                        {request.status}
                      </span>
                      {request.resolved_business_id && (
                        <div style={{ marginTop: "6px", fontSize: "12px" }}>
                          <Link href={`/admin/businesses/${request.resolved_business_id}`} style={{ color: "var(--a-teal)" }}>
                            Business #{request.resolved_business_id}
                          </Link>
                        </div>
                      )}
                    </td>
                    <td className="a-table__actions-cell">
                      {request.status === "pending" ? (
                        <AdminActionsMenu>
                          <form action={approveRequest}>
                            <input type="hidden" name="id" value={request.id} />
                            <button type="submit">Approve as new</button>
                          </form>
                          <form action={rejectRequest}>
                            <input type="hidden" name="id" value={request.id} />
                            <input className="a-input" name="notes" placeholder="Reason" style={{ fontSize: "12px", minHeight: "30px" }} />
                            <button className="admin-actions-menu__danger" type="submit">Reject</button>
                          </form>
                        </AdminActionsMenu>
                      ) : (
                        <span style={{ color: "var(--a-ink-muted)", fontSize: "12px" }}>Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </form>
      <AdminBulkSelectAll />
    </>
  );
}
