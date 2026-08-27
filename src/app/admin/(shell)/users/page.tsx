import type { Metadata } from "next";
import { clerkClient } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdminActionsMenu from "@/components/admin/actions-menu";
import AdminAddModal from "@/components/admin/add-modal";
import AdminBulkSelectAll from "@/components/admin/bulk-select-all";
import {
  createAdvertiserAccount,
  linkAccountBusiness,
  listAdvertiserAccounts,
  listBusinesses,
  unlinkAccountBusiness,
  updateAdvertiserAccount,
} from "@/lib/admin-db";

export const metadata: Metadata = { title: "Users" };
export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<Record<string, string>> };

type ClerkIdentity = {
  loginEmail: string | null;
  authMethod: string;
  authProvider: string;
  lastSignInAt: string | null;
  lastActiveAt: number | null;
  status: string;
};

type UserFilters = {
  q: string;
  role: string;
  plan: string;
  status: string;
  sort: string;
};

function parseBusinesses(value: string | null) {
  if (!value) return [];
  return value.split(",").map((item) => {
    const parts = item.split(":");
    const id = Number(parts.shift());
    const isPrimary = parts.pop() === "1";
    const role = parts.pop() ?? "owner";
    const name = parts.join(":");
    return { id, name, role, isPrimary };
  }).filter((business) => Number.isFinite(business.id));
}

function usersHref(filters: UserFilters, extra?: Record<string, string>) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.role !== "all") params.set("role", filters.role);
  if (filters.plan !== "all") params.set("plan", filters.plan);
  if (filters.status !== "all") params.set("status", filters.status);
  if (filters.sort !== "name_asc") params.set("sort", filters.sort);
  for (const [key, value] of Object.entries(extra ?? {})) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `/admin/users?${query}` : "/admin/users";
}

function formatDate(value: string | null) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return value;
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatTimestamp(value: number | null) {
  if (!value) return "Never";
  return formatDate(new Date(value).toISOString());
}

function formatRelativeTime(value: number | null) {
  if (!value) return "No activity";
  const diffMs = Date.now() - value;
  if (diffMs < 0) return "Just now";
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function presenceFromActivity(value: number | null) {
  if (!value) {
    return { label: "Unknown", detail: "No Clerk activity", className: "a-badge-paused" };
  }
  const ageMs = Date.now() - value;
  if (ageMs <= 5 * 60_000) {
    return { label: "Online", detail: formatRelativeTime(value), className: "a-badge-active" };
  }
  if (ageMs <= 24 * 60 * 60_000) {
    return { label: "Recent", detail: formatRelativeTime(value), className: "a-badge-pending" };
  }
  return { label: "Away", detail: formatRelativeTime(value), className: "a-badge-paused" };
}

function formatProvider(value: string) {
  return value
    .replace(/^oauth_/, "")
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatAccountRole(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function getClerkIdentity(clerkUserId: string): Promise<ClerkIdentity> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(clerkUserId);
    const providers = user.externalAccounts.map((account) => account.provider).filter(Boolean);
    const authProvider = providers.length
      ? providers.map(formatProvider).join(", ")
      : user.passwordEnabled
        ? "Email/password"
        : "Unknown";

    return {
      loginEmail: user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? null,
      authMethod: providers.length ? "OAuth" : user.passwordEnabled ? "Email and password" : "Other",
      authProvider,
      lastSignInAt: formatTimestamp(user.lastSignInAt),
      lastActiveAt: user.lastActiveAt ?? user.lastSignInAt ?? null,
      status: user.banned ? "Banned" : user.locked ? "Locked" : "Active",
    };
  } catch {
    return {
      loginEmail: null,
      authMethod: "Unknown",
      authProvider: "Clerk user not found",
      lastSignInAt: null,
      lastActiveAt: null,
      status: "Unknown",
    };
  }
}

async function linkBusiness(formData: FormData) {
  "use server";
  const accountId = String(formData.get("account_id") ?? "");
  const businessId = Number(formData.get("business_id"));
  const role = String(formData.get("role") ?? "owner");
  const isPrimary = formData.get("is_primary") === "on";
  if (!accountId || !Number.isFinite(businessId)) return;
  await linkAccountBusiness(accountId, businessId, role, isPrimary);
}

async function addUser(formData: FormData) {
  "use server";
  const clerkUserId = String(formData.get("clerk_user_id") ?? "").trim();
  const displayName = String(formData.get("display_name") ?? "").trim();
  const portalEmail = String(formData.get("portal_email") ?? "").trim();
  const billingEmail = String(formData.get("billing_email") ?? "").trim();
  const businessId = Number(formData.get("business_id"));
  const role = String(formData.get("role") ?? "owner");
  const isPrimary = formData.get("is_primary") === "on";
  if (!clerkUserId) return;
  await createAdvertiserAccount({
    clerkUserId,
    displayName: displayName || null,
    portalEmail: portalEmail || billingEmail || null,
    billingEmail: billingEmail || null,
    businessId: Number.isFinite(businessId) && businessId > 0 ? businessId : null,
    role,
    isPrimary,
  });
}

async function updateUser(formData: FormData) {
  "use server";
  const accountId = String(formData.get("account_id") ?? "").trim();
  const displayName = String(formData.get("display_name") ?? "").trim();
  const portalEmail = String(formData.get("portal_email") ?? "").trim();
  const billingEmail = String(formData.get("billing_email") ?? "").trim();
  const returnTo = String(formData.get("return_to") ?? "/admin/users");
  if (!accountId) return;

  await updateAdvertiserAccount(accountId, {
    displayName: displayName || null,
    portalEmail: portalEmail || null,
    billingEmail: billingEmail || null,
  });

  redirect(returnTo.startsWith("/admin/users") ? returnTo : "/admin/users");
}

async function unlinkBusiness(formData: FormData) {
  "use server";
  const accountId = String(formData.get("account_id") ?? "");
  const businessId = Number(formData.get("business_id"));
  if (!accountId || !Number.isFinite(businessId)) return;
  await unlinkAccountBusiness(accountId, businessId);
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q ?? "";
  const role = params.role ?? "all";
  const plan = params.plan ?? "all";
  const status = params.status ?? "all";
  const sort = params.sort ?? "name_asc";
  const filters = { q, role, plan, status, sort };
  const showAdd = params.add === "1";
  const detailAccountId = params.detail ?? "";
  const [accounts, businesses] = await Promise.all([
    listAdvertiserAccounts({
      search: q || undefined,
      role,
      plan,
      status,
      sort,
    }),
    listBusinesses(),
  ]);
  const closeHref = usersHref(filters);
  const detailAccount = detailAccountId ? accounts.find((account) => account.id === detailAccountId) : undefined;
  const detailIdentity = detailAccount ? await getClerkIdentity(detailAccount.clerk_user_id) : null;
  const hasActiveFilters = q || role !== "all" || plan !== "all" || status !== "all" || sort !== "name_asc";

  return (
    <>
      <div className="admin-page-header">
        <h1 className="a-page-title a-inline-0ad5d5dc" >
          Users
          <span className="a-inline-a0bf08bc" >
            {accounts.length.toLocaleString()}
          </span>
        </h1>
        <Link href={usersHref(filters, { add: "1" })} className="a-btn a-btn-primary a-inline-65d1aa8a" >
          + Add User
        </Link>
      </div>

      {showAdd && (
        <AdminAddModal title="Add user" closeHref={closeHref}>
          <form action={addUser} className="admin-form-grid admin-form-grid--2">
            <div className="a-field">
              <label className="a-label">Name</label>
              <input className="a-input" name="display_name" placeholder="Admin" />
            </div>
            <div className="a-field">
              <label className="a-label">Contact email</label>
              <input className="a-input" name="portal_email" type="email" placeholder="owner@example.com" />
            </div>
            <div className="a-field">
              <label className="a-label">Billing email</label>
              <input className="a-input" name="billing_email" type="email" placeholder="owner@example.com" />
            </div>
            <div className="a-field">
              <label className="a-label">Clerk user ID</label>
              <input className="a-input" name="clerk_user_id" required placeholder="user_..." />
            </div>
            <div className="a-field">
              <label className="a-label">Initial business</label>
              <select name="business_id" className="a-input" defaultValue="">
                <option value="">No business yet</option>
                {businesses.map((business) => (
                  <option key={business.id} value={business.id}>
                    #{business.id} {business.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="a-field">
              <label className="a-label">Role</label>
              <select name="role" className="a-input" defaultValue="owner">
                <option value="owner">Owner</option>
                <option value="manager">Manager</option>
                <option value="billing">Billing</option>
              </select>
            </div>
            <label className="admin-check-row">
              <input type="checkbox" name="is_primary" defaultChecked /> Primary relationship
            </label>
            <div className="admin-form-actions">
              <Link href={closeHref} className="a-btn a-btn-ghost">Cancel</Link>
              <button type="submit" className="a-btn a-btn-primary">Add user</button>
            </div>
          </form>
        </AdminAddModal>
      )}

      {detailAccount && (
        <AdminAddModal eyebrow="Account" title={detailAccount.display_name ?? "Unnamed user"} closeHref={closeHref}>
          <form action={updateUser} className="admin-user-profile-form">
            <input type="hidden" name="account_id" value={detailAccount.id} />
            <input type="hidden" name="return_to" value={closeHref} />
            <div className="admin-user-modal-section__head">
              <h3>Editable profile</h3>
            </div>
            <div className="admin-form-grid admin-form-grid--2">
              <div className="a-field admin-field--wide">
                <label className="a-label">Name</label>
                <input className="a-input" name="display_name" defaultValue={detailAccount.display_name ?? ""} placeholder="Admin" />
              </div>
              <div className="a-field">
                <label className="a-label">Contact email</label>
                <input className="a-input" name="portal_email" type="email" defaultValue={detailAccount.portal_email ?? ""} placeholder="owner@example.com" />
              </div>
              <div className="a-field">
                <label className="a-label">Billing email</label>
                <input className="a-input" name="billing_email" type="email" defaultValue={detailAccount.billing_email ?? ""} placeholder="billing@example.com" />
              </div>
            </div>
            <div className="admin-form-actions">
              <Link href={closeHref} className="a-btn a-btn-ghost">Cancel</Link>
              <button type="submit" className="a-btn a-btn-primary">Save changes</button>
            </div>
          </form>

          <section className="admin-user-modal-section">
            <div className="admin-user-modal-section__head">
              <h3>Linked businesses</h3>
              <span>{detailAccount.business_count.toLocaleString()}</span>
            </div>
            {parseBusinesses(detailAccount.businesses).length === 0 ? (
              <p className="admin-muted-note">No businesses linked</p>
            ) : (
              <div className="admin-user-business-list">
                {parseBusinesses(detailAccount.businesses).map((business) => (
                  <div key={business.id} className="admin-user-business-item">
                    <div>
                      <Link href={`/admin/businesses/${business.id}`}>{business.name || `#${business.id}`}</Link>
                      <span>{business.role}{business.isPrimary ? " · primary" : ""}</span>
                    </div>
                    <form action={unlinkBusiness}>
                      <input type="hidden" name="account_id" value={detailAccount.id} />
                      <input type="hidden" name="business_id" value={business.id} />
                      <button type="submit" className="a-btn a-btn-ghost">Remove</button>
                    </form>
                  </div>
                ))}
              </div>
            )}

            <form action={linkBusiness} className="admin-user-link-form">
              <input type="hidden" name="account_id" value={detailAccount.id} />
              <select name="business_id" className="a-input" required>
                <option value="">Select business...</option>
                {businesses.map((business) => (
                  <option key={business.id} value={business.id}>
                    #{business.id} {business.name}
                  </option>
                ))}
              </select>
              <select name="role" className="a-input" defaultValue="owner">
                <option value="owner">Owner</option>
                <option value="manager">Manager</option>
                <option value="billing">Billing</option>
              </select>
              <label className="admin-check-row">
                <input type="checkbox" name="is_primary" /> Primary
              </label>
              <button type="submit" className="a-btn a-btn-primary">Add relationship</button>
            </form>
          </section>

          <section className="admin-user-modal-section admin-user-modal-section--meta">
            <div className="admin-user-modal-section__head">
              <h3>Account metadata</h3>
              <span>Read-only</span>
            </div>
            <div className="admin-user-detail-readonly">
              <div>
                <span>Account role</span>
                <strong>{formatAccountRole(detailAccount.account_role)}</strong>
              </div>
              <div>
                <span>Login email</span>
                <strong>{detailIdentity?.loginEmail ?? "Not available"}</strong>
              </div>
              <div>
                <span>Login method</span>
                <strong>{detailIdentity?.authMethod ?? "Unknown"}</strong>
              </div>
              <div>
                <span>Auth provider</span>
                <strong>{detailIdentity?.authProvider ?? "Unknown"}</strong>
              </div>
              <div>
                <span>Auth status</span>
                <strong>{detailIdentity?.status ?? "Unknown"}</strong>
              </div>
              <div>
                <span>Account ID</span>
                <code>{detailAccount.id}</code>
              </div>
              <div>
                <span>Clerk ID</span>
                <code>{detailAccount.clerk_user_id}</code>
              </div>
              <div>
                <span>Created</span>
                <strong>{formatDate(detailAccount.created_at)}</strong>
              </div>
              <div>
                <span>Updated</span>
                <strong>{formatDate(detailAccount.updated_at)}</strong>
              </div>
              <div>
                <span>Last sign-in</span>
                <strong>{detailIdentity?.lastSignInAt ?? "Unknown"}</strong>
              </div>
              <div>
                <span>Website source</span>
                <strong>Not tracked yet</strong>
              </div>
            </div>
          </section>
        </AdminAddModal>
      )}

      <form method="GET" action="/admin/users" className="admin-filter-bar">
        <input name="q" type="search" defaultValue={q} placeholder="Search name, contact email, Clerk id, business..." className="a-input a-inline-69fd621e"  />
        <select name="role" defaultValue={role} className="a-input a-inline-e6992af7" >
          <option value="all">All Roles</option>
          <option value="super_admin">Super Admins</option>
          <option value="admin">Admins</option>
          <option value="advertiser">Advertisers</option>
        </select>
        <select name="plan" defaultValue={plan} className="a-input a-inline-9cf50eca" >
          <option value="all">All Plans</option>
          <option value="free">Free</option>
          <option value="starter">Starter</option>
          <option value="pro">Pro</option>
          <option value="premium">Premium</option>
        </select>
        <select name="status" defaultValue={status} className="a-input a-inline-e6992af7" >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="trialing">Trialing</option>
          <option value="past_due">Past Due</option>
          <option value="cancelled">Cancelled</option>
          <option value="paused">Paused</option>
        </select>
        <select name="sort" defaultValue={sort} className="a-input a-filter-control" >
          <option value="name_asc">Name A-Z</option>
          <option value="name_desc">Name Z-A</option>
          <option value="email_asc">Email A-Z</option>
          <option value="businesses_desc">Most Businesses</option>
          <option value="newest">Newest</option>
          <option value="updated">Recently Updated</option>
        </select>
        <button className="a-btn a-btn-ghost a-inline-47390085" type="submit" >Search</button>
        {hasActiveFilters && <Link href="/admin/users" className="a-btn a-btn-ghost a-inline-47390085" >Clear</Link>}
      </form>

      <form method="POST" action="/admin/api/users/bulk">
        <input type="hidden" name="redirect" value="/admin/users" />
        <div className="a-card">
          <div className="a-inline-2b655313" >
            <label className="a-inline-3ae3b235" >
              <AdminBulkSelectAll />
              All
            </label>
            <select name="action" className="a-input a-inline-e621d310" >
              <option value="">Bulk Action...</option>
              <option value="activate">Activate</option>
              <option value="pause">Pause</option>
              <option value="cancel">Cancel</option>
            </select>
            <button type="submit" className="a-btn a-btn-ghost a-inline-65d1aa8a" >Apply</button>
        </div>
        <div className="a-table-wrap">
          <table className="a-table a-table--single-line a-table--users">
            <colgroup>
              <col className="a-users-col-check" />
              <col className="a-users-col-row" />
              <col className="a-users-col-user" />
              <col className="a-users-col-email" />
              <col className="a-users-col-plan" />
              <col className="a-users-col-business" />
              <col className="a-users-col-presence" />
              <col className="a-users-col-role" />
              <col className="a-users-col-actions" />
            </colgroup>
            <thead>
              <tr>
                <th></th>
                <th>#</th>
                <th>User</th>
                <th>Contact email</th>
                <th className="a-inline-7c53fa98" >Plan</th>
                <th>Primary business</th>
                <th className="a-inline-7c53fa98" >Presence</th>
                <th className="a-inline-7c53fa98" >Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="a-inline-ac953bfd" >
                    No users found
                  </td>
                </tr>
              ) : accounts.map((account, index) => {
                const owned = parseBusinesses(account.businesses);
                const primary = owned.find((business) => business.isPrimary) ?? owned[0];
                const presence = presenceFromActivity(null);
                return (
                  <tr key={account.id}>
                    <td><input type="checkbox" name="ids" value={account.id} className="bulk-check" /></td>
                    <td className="a-muted-small" >{index + 1}</td>
                    <td className="a-inline-16a1f861" >
                      <span
                        className="a-inline-aa54abcb" 
                        title={account.display_name ?? "Unnamed user"}
                      >
                        {account.display_name ?? "Unnamed user"}
                      </span>
                    </td>
                    <td className="a-inline-bcd3d86e" >
                      <span
                        className={`a-user-email${account.portal_email || account.billing_email ? "" : " is-muted"}`}
                        title={account.portal_email ?? account.billing_email ?? undefined}
                      >
                        {account.portal_email ?? account.billing_email ?? "No email"}
                      </span>
                    </td>
                    <td className="a-inline-7c53fa98" >
                      <span className={`a-badge ${account.sub_status === "active" ? "a-badge-active" : "a-badge-paused"}`}>
                        {account.plan} · {account.sub_status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="a-inline-b7687fbf" >
                      {primary ? (
                        <div className="a-inline-5b1c161c" >
                          <Link
                            href={`/admin/businesses/${primary.id}`}
                            className="a-inline-84fdde33" 
                            title={primary.name || `#${primary.id}`}
                          >
                            {primary.name || `#${primary.id}`}
                          </Link>
                          {owned.length > 1 && (
                            <span className="a-badge a-badge-paused a-inline-47390085" >
                              +{owned.length - 1}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="a-inline-24fc8284" >—</span>
                      )}
                    </td>
                    <td className="a-inline-7c53fa98" >
                      <span className={`a-badge ${presence.className}`} title={presence.detail}>
                        {presence.label}{presence.detail ? ` · ${presence.detail}` : ""}
                      </span>
                    </td>
                    <td className="a-inline-7c53fa98" >
                      <span className={`a-badge ${account.account_role === "advertiser" ? "a-badge-paused" : "a-badge-active"}`}>
                        {formatAccountRole(account.account_role)}
                      </span>
                    </td>
                    <td className="a-table__actions-cell">
                      <AdminActionsMenu>
                        <Link href={usersHref(filters, { detail: account.id })}>Details</Link>
                      </AdminActionsMenu>
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
