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

const BULK_FORM_ID = "integrations-bulk-form";

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
      <div className="a-inline-32e1f70f" >
        <h1 className="a-page-title a-inline-0ad5d5dc" >
          Integrations
          <span className="a-inline-a0bf08bc" >
            {integrations.length.toLocaleString()}
          </span>
        </h1>
        <form method="POST" action="/admin/api/integrations/sync-all">
          <button className="a-btn a-btn-primary" type="submit">Force Sync All</button>
        </form>
      </div>

      <form method="GET" action="/admin/integrations" className="a-inline-8ff7e847" >
        <input name="q" type="search" defaultValue={q} placeholder="Search account or business..." className="a-input a-inline-ab674353"  />
        <select name="platform" defaultValue={platform} className="a-input a-inline-37a89abe" >
          <option value="">All platforms</option>
          {PLATFORMS.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <select name="status" defaultValue={status} className="a-input a-inline-37a89abe" >
          <option value="">All statuses</option>
          {STATUSES.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <select name="sort" defaultValue={sort} className="a-input a-inline-37a89abe" >
          {SORTS.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
        <button className="a-btn a-btn-ghost a-inline-47390085" type="submit" >Filter</button>
        {hasActiveFilters && <Link href="/admin/integrations" className="a-btn a-btn-ghost a-inline-47390085" >Clear</Link>}
      </form>

      <form id={BULK_FORM_ID} method="POST" action="/admin/api/integrations/bulk">
        <input type="hidden" name="redirect" value={currentPath} />
      </form>
      <div className="a-card">
        <div className="a-inline-2b655313" >
          <label className="a-inline-3ae3b235" >
            <AdminBulkSelectAll form={BULK_FORM_ID} />
            All
          </label>
          <select form={BULK_FORM_ID} name="action" className="a-input a-inline-94c78c41" >
            <option value="">Bulk action...</option>
            <option value="sync">Force sync</option>
            <option value="auto_approve_on">Auto-approve on</option>
            <option value="auto_approve_off">Auto-approve off</option>
            <option value="push_on">Push enabled on</option>
            <option value="push_off">Push enabled off</option>
            <option value="disconnect">Disconnect</option>
          </select>
          <button form={BULK_FORM_ID} type="submit" className="a-btn a-btn-ghost a-inline-65d1aa8a" >Apply</button>
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
                  <td colSpan={11} className="a-inline-f61db55c" >
                    No integrations connected yet
                  </td>
                </tr>
              ) : integrations.map((row, index) => (
                <tr key={row.id}>
                  <td><input form={BULK_FORM_ID} type="checkbox" name="ids" value={row.id} className="bulk-check" /></td>
                  <td className="a-inline-5d69a8cc" >{index + 1}</td>
                  <td title={`${accountLabel(row)} (${row.account_id})`}>
                    <span className="a-inline-6c835a8d" >{accountLabel(row)}</span>
                    <div className="a-inline-bb3abc5b" >{row.account_id}</div>
                  </td>
                  <td className="a-inline-056f71dd" >{row.platform}</td>
                  <td className="a-inline-691df809" >
                    {row.last_synced ? new Date(row.last_synced).toLocaleString("en-AU") : "Never"}
                  </td>
                  <td>{row.event_count}</td>
                  <td className="a-table__badge-cell"><span className={`a-badge ${STATUS_CLASS[row.sync_status] ?? "a-badge-paused"}`}>{row.sync_status}</span></td>
                  <td title={row.sync_error || undefined} className={`a-status-message${row.sync_error ? " is-danger" : ""}`}>
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
    </>
  );
}
