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

const BULK_FORM_ID = "business-requests-bulk-form";

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
        <h1 className="a-page-title a-inline-0ad5d5dc" >
          Business Requests
          <span className="a-inline-a0bf08bc" >
            {sorted.length.toLocaleString()}
          </span>
        </h1>
      </div>

      <form method="GET" action="/admin/business-requests" className="admin-filter-bar">
        <select name="status" defaultValue={status} className="a-input a-filter-control" >
          {STATUSES.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
        <select name="sort" defaultValue={sort} className="a-input a-filter-control" >
          {SORTS.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
        <button type="submit" className="a-btn a-btn-ghost a-inline-47390085" >Filter</button>
        {hasActiveFilters && <Link href="/admin/business-requests" className="a-btn a-btn-ghost a-inline-47390085" >Clear</Link>}
      </form>

      <form id={BULK_FORM_ID} method="POST" action="/admin/api/business-requests/bulk">
        <input type="hidden" name="redirect" value={currentPath} />
      </form>
      <div className="a-card">
        <div className="a-inline-2b655313" >
          <label className="a-inline-3ae3b235" >
            <AdminBulkSelectAll form={BULK_FORM_ID} />
            All
          </label>
          <select form={BULK_FORM_ID} name="action" className="a-input a-inline-dc2a05f8" >
            <option value="">Bulk Action…</option>
            <option value="approve">Approve</option>
            <option value="reject">Reject</option>
          </select>
          <button form={BULK_FORM_ID} type="submit" className="a-btn a-btn-ghost a-inline-65d1aa8a" >Apply</button>
        </div>
        <div className="a-table-wrap">
          <table className="a-table">
            <thead>
              <tr>
                <th className="a-inline-b9c114f7" ></th>
                <th className="a-inline-672380eb" >#</th>
                <th>Business</th>
                <th>Requested by</th>
                <th>Contact</th>
                <th className="a-inline-54442ae7" >Status</th>
                <th className="a-inline-29fbde53" >Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="a-inline-ac953bfd" >
                    No business requests found
                  </td>
                </tr>
              ) : sorted.map((request, index) => (
                <tr key={request.id}>
                  <td><input form={BULK_FORM_ID} type="checkbox" name="ids" value={request.id} className="bulk-check" /></td>
                  <td className="a-muted-small" >{index + 1}</td>
                  <td>
                    <div className="a-inline-11a836b8" >{request.business_name}</div>
                    <div className="a-inline-8054e521" >
                      {[request.city, request.website].filter(Boolean).join(" · ") || "No website/city supplied"}
                    </div>
                    {request.message && (
                      <div className="a-inline-98f16669" >
                        {request.message}
                      </div>
                    )}
                  </td>
                  <td className="a-inline-691df809" >
                    <div>{request.portal_email ?? "No email"}</div>
                    <div className="a-inline-046a013e" >Account {request.account_id}</div>
                    <div className="a-inline-046a013e" >Requested {formatDate(request.created_at)}</div>
                  </td>
                  <td className="a-inline-691df809" >
                    <div>{request.contact_email ?? "—"}</div>
                    <div className="a-inline-046a013e" >{request.phone ?? "—"}</div>
                  </td>
                  <td>
                    <span className={`a-badge ${BADGE[request.status] ?? "a-badge-paused"}`}>
                      {request.status}
                    </span>
                    {request.resolved_business_id && (
                      <div className="a-inline-8d47a182" >
                        <Link href={`/admin/businesses/${request.resolved_business_id}`} className="a-inline-b3f1b3c6" >
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
                          <input className="a-input a-inline-a71566a6" name="notes" placeholder="Reason"  />
                          <button className="admin-actions-menu__danger" type="submit">Reject</button>
                        </form>
                      </AdminActionsMenu>
                    ) : (
                      <span className="a-muted-small" >Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
