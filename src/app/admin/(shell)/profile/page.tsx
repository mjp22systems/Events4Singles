import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getAdminSession, SESSION_COOKIE } from "@/lib/admin-auth";
import { findAdminAccountForLogin, getAdminAccountById } from "@/lib/admin-db";

export const metadata: Metadata = { title: "Admin Profile" };
export const dynamic = "force-dynamic";

function formatDate(value: string | null) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return value;
  return new Intl.DateTimeFormat("en-AU", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function formatRole(value: string | null | undefined) {
  if (!value) return "Admin";
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function AdminProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? await getAdminSession(token) : null;
  const account = session?.accountId
    ? await getAdminAccountById(session.accountId)
    : await findAdminAccountForLogin();
  const displayName = account?.display_name ?? session?.displayName ?? "Admin";
  const email = account?.portal_email ?? account?.billing_email ?? session?.email ?? "Not set";

  return (
    <>
      <h1 className="a-page-title">Admin Profile</h1>
      <div className="a-card a-inline-b52bebf2" >
        <div className="a-card-header">
          <span className="a-card-title">Login</span>
        </div>
        <div className="a-card-body a-inline-7b050c66" >
          <div>
            <span className="a-label">Display name</span>
            <p className="a-inline-7fdb314a" >{displayName}</p>
          </div>
          <div>
            <span className="a-label">Email</span>
            <p className="a-inline-b12c8a54" >{email}</p>
          </div>
          <div>
            <span className="a-label">Account role</span>
            <p className="a-inline-0ad5d5dc" >
              <span className={`a-badge ${account?.account_role === "super_admin" ? "a-badge-active" : "a-badge-paused"}`}>
                {formatRole(account?.account_role)}
              </span>
            </p>
          </div>
          <div>
            <span className="a-label">Auth model</span>
            <p className="a-inline-b12c8a54" >
              Admin console uses the shared admin password and links the session to an admin user record when available.
            </p>
          </div>
          <div>
            <span className="a-label">Session</span>
            <p className="a-inline-0ad5d5dc" >
              <span className={`a-badge ${session ? "a-badge-active" : "a-badge-deleted"}`}>
                {session ? "Active" : "Missing"}
              </span>
            </p>
          </div>
          {account && (
            <div className="admin-user-detail-readonly">
              <div>
                <span>Account ID</span>
                <code>{account.id}</code>
              </div>
              <div>
                <span>Clerk ID</span>
                <code>{account.clerk_user_id}</code>
              </div>
              <div>
                <span>Created</span>
                <strong>{formatDate(account.created_at)}</strong>
              </div>
              <div>
                <span>Updated</span>
                <strong>{formatDate(account.updated_at)}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
