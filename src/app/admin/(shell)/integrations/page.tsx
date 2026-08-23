import type { Metadata } from "next";
import Link from "next/link";
import AdminActionsMenu from "@/components/admin/actions-menu";
import AdminBulkSelectAll from "@/components/admin/bulk-select-all";
import { listAdminIntegrations } from "@/lib/admin-db";

export const metadata: Metadata = { title: "Integrations" };
export const dynamic = "force-dynamic";

const STATUS_CLASS: Record<string, string> = {
  idle: "a-badge-active",
  syncing: "a-badge-pending",
  error: "a-badge-deleted",
};

const PLATFORMS = ["eventbrite", "meetup", "humanitix", "trybooking", "ical"];
const STATUSES = ["idle", "syncing", "error"];
const SORTS = [
  { value: "updated_desc", label: "Recently updated" },
  { value: "updated_asc", label: "Oldest updated" },
  { value: "account_asc", label: "Account A-Z" },
  { value: "platform_asc", label: "Platform A-Z" },
  { value: "status", label: "Status" },
  { value: "events_desc", label: "Most events" },
];

function accountLabel(row: Awaited<ReturnType<typeof listAdminIntegrations>>[number]) {
  return row.business_name || row.billing_email || row.account_id;
}

type PageProps = { searchParams: Promise<Record<string, string>> };

export default async function AdminIntegrationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q ?? "";
  const platform = params.platform ?? "";
  const status = params.status ?? "";
  const sort = params.sort ?? "updated_desc";
  const integrations = await listAdminIntegrations({
    search: q || undefined,
    platform: platform || undefined,
    status: status || undefined,
    sort,
  });
  const hasActiveFilters = q || platform || status || sort !== "updated_desc";
  const currentPath = `/admin/integrations?${new URLSearchParams(Object.fromEntries(Object.entries({
    q,
    platform,
    status,
    sort: sort !== "updated_desc" ? sort : "",
  }).filter(([, value]) => value)))}`;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1 className="a-page-title" style={{ margin: 0 }}>
          Integrations
          <span style={{ marginLeft: "10px", fontSize: "15px", fontWeight: 500, color: "var(--a-ink-muted)" }}>
            {integrations.length.toLocaleString()}
          </span>
        </h1>
        <form method="POST" action="/admin/api/integrations/sync-all">
          <button className="a-btn a-btn-primary" type="submit">Force Sync All</button>
        </form>
      </div>

      <form method="GET" action="/admin/integrations" style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center", width: "100%" }}>
        <input name="q" type="search" defaultValue={q} placeholder="Search account or business..." className="a-input" style={{ flex: 1, minWidth: "160px" }} />
        <select name="platform" defaultValue={platform} className="a-input" style={{ flex: 1, minWidth: "140px" }}>
          <option value="">All platforms</option>
          {PLATFORMS.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <select name="status" defaultValue={status} className="a-input" style={{ flex: 1, minWidth: "140px" }}>
          <option value="">All statuses</option>
          {STATUSES.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <select name="sort" defaultValue={sort} className="a-input" style={{ flex: 1, minWidth: "140px" }}>
          {SORTS.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
        <button className="a-btn a-btn-ghost" type="submit" style={{ flexShrink: 0 }}>Filter</button>
        {hasActiveFilters && <Link href="/admin/integrations" className="a-btn a-btn-ghost" style={{ flexShrink: 0 }}>Clear</Link>}
      </form>

      <form method="POST" action="/admin/api/integrations/bulk">
        <input type="hidden" name="redirect" value={currentPath} />
      <div className="a-card">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", borderBottom: "1px solid var(--a-border)" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--a-ink-muted)", cursor: "pointer" }}>
            <AdminBulkSelectAll />
            All
          </label>
          <select name="action" className="a-input" style={{ width: "190px" }}>
            <option value="">Bulk action...</option>
            <option value="sync">Force sync</option>
            <option value="auto_approve_on">Auto-approve on</option>
            <option value="auto_approve_off">Auto-approve off</option>
            <option value="push_on">Push enabled on</option>
            <option value="push_off">Push enabled off</option>
            <option value="disconnect">Disconnect</option>
          </select>
          <button type="submit" className="a-btn a-btn-ghost" style={{ fontSize: "13px" }}>Apply</button>
        </div>
        <div className="a-table-wrap">
          <table className="a-table a-table--single-line a-table--integrations">
            <colgroup>
              <col className="a-integrations-col-check" />
              <col className="a-integrations-col-row" />
              <col className="a-integrations-col-account" />
              <col className="a-integrations-col-platform" />
              <col className="a-integrations-col-synced" />
              <col className="a-integrations-col-events" />
              <col className="a-integrations-col-status" />
              <col className="a-integrations-col-error" />
              <col className="a-integrations-col-auto" />
              <col className="a-integrations-col-push" />
              <col className="a-integrations-col-actions" />
            </colgroup>
            <thead>
              <tr>
                <th></th>
                <th>#</th>
                <th>Account</th>
                <th>Platform</th>
                <th>Last synced</th>
                <th>Events</th>
                <th>Status</th>
                <th>Error</th>
                <th>Auto-approve</th>
                <th>Push enabled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {integrations.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ padding: "40px", textAlign: "center", color: "var(--a-ink-muted)" }}>
                    No integrations connected yet
                  </td>
                </tr>
              ) : integrations.map((row, index) => (
                <tr key={row.id}>
                  <td><input type="checkbox" name="ids" value={row.id} className="bulk-check" /></td>
                  <td style={{ color: "var(--a-ink-muted)", fontSize: "12px" }}>{index + 1}</td>
                  <td title={`${accountLabel(row)} (${row.account_id})`}>
                    <span style={{ fontWeight: 600 }}>{accountLabel(row)}</span>
                    <div style={{ fontSize: "11px", color: "var(--a-ink-muted)" }}>{row.account_id}</div>
                  </td>
                  <td style={{ textTransform: "capitalize" }}>{row.platform}</td>
                  <td style={{ fontSize: "12px", color: "var(--a-ink-muted)" }}>
                    {row.last_synced ? new Date(row.last_synced).toLocaleString("en-AU") : "Never"}
                  </td>
                  <td>{row.event_count}</td>
                  <td className="a-table__badge-cell"><span className={`a-badge ${STATUS_CLASS[row.sync_status] ?? "a-badge-paused"}`}>{row.sync_status}</span></td>
                  <td title={row.sync_error || undefined} style={{ color: row.sync_error ? "#991b1b" : "var(--a-ink-muted)", fontSize: "12px" }}>
                    {row.sync_error || "-"}
                  </td>
                  <td className="a-table__toggle-cell">
                    <form method="POST" action={`/admin/api/integrations/${row.id}`}>
                      <input type="hidden" name="_method" value="PATCH" />
                      <input type="hidden" name="field" value="auto_approve" />
                      <input
                        type="hidden"
                        name="value"
                        value={row.auto_approve === 1 ? "0" : "1"}
                      />
                      <button
                        type="submit"
                        title={row.auto_approve === 1 ? "Auto-approve ON — click to disable" : "Auto-approve OFF — click to enable"}
                        className={`admin-toggle-pill ${row.auto_approve === 1 ? "admin-toggle-pill--on" : ""}`}
                      >
                        {row.auto_approve === 1 ? "On" : "Off"}
                      </button>
                    </form>
                  </td>
                  <td className="a-table__toggle-cell">
                    <form method="POST" action={`/admin/api/integrations/${row.id}`}>
                      <input type="hidden" name="_method" value="PATCH" />
                      <input type="hidden" name="field" value="push_enabled" />
                      <input
                        type="hidden"
                        name="value"
                        value={row.push_enabled === 1 ? "0" : "1"}
                      />
                      <button
                        type="submit"
                        title={row.push_enabled === 1 ? "Push enabled ON — click to disable" : "Push enabled OFF — click to enable"}
                        className={`admin-toggle-pill ${row.push_enabled === 1 ? "admin-toggle-pill--on" : ""}`}
                      >
                        {row.push_enabled === 1 ? "On" : "Off"}
                      </button>
                    </form>
                  </td>
                  <td className="a-table__actions-cell">
                    <AdminActionsMenu>
                      <form method="POST" action={`/admin/api/integrations/${row.id}/sync`}>
                        <button type="submit">Force sync</button>
                      </form>
                      <form method="POST" action={`/admin/api/integrations/${row.id}`}>
                        <input type="hidden" name="_method" value="DELETE" />
                        <button className="admin-actions-menu__danger" type="submit">Disconnect</button>
                      </form>
                    </AdminActionsMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </form>
    </>
  );
}
