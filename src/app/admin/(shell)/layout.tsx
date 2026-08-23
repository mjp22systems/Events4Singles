import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminSession, SESSION_COOKIE } from "@/lib/admin-auth";
import { findAdminAccountForLogin, getAdminAccountById } from "@/lib/admin-db";
import SideNav from "@/components/admin/side-nav";
import Link from "next/link";
import AdminThemeToggle from "@/components/admin/theme-toggle";

export const dynamic = "force-dynamic";

export default async function AdminShellLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? await getAdminSession(token) : null;
  if (!session) {
    redirect("/admin/login");
  }
  const account = session.accountId
    ? await getAdminAccountById(session.accountId)
    : await findAdminAccountForLogin();
  const displayName = account?.display_name ?? session.displayName ?? "Admin";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "A";

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <div className="admin-sidebar__logo-mark">e4s</div>
          <div className="admin-sidebar__logo-text">
            <span className="admin-sidebar__logo-name">Events4Singles</span>
            <span className="admin-sidebar__logo-sub">Admin Console</span>
          </div>
        </div>
        <SideNav />
      </aside>
      <div className="admin-right">
        <header className="admin-topbar">
          <div className="admin-topbar__actions">
            <AdminThemeToggle />
            <Link href="/admin/profile" className="admin-user-chip">
              <span className="admin-user-avatar">{initials}</span>
              <span className="admin-user-chip__text">
                <span>{displayName}</span>
              </span>
            </Link>
            <form action="/admin/api/logout" method="POST">
              <button type="submit" className="admin-topbar__sign-out">Sign out</button>
            </form>
          </div>
        </header>
        <main className="admin-main">
          <div className="admin-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
