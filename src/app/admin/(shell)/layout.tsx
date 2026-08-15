import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken, SESSION_COOKIE } from "@/lib/admin-auth";
import SideNav from "@/components/admin/side-nav";

export const dynamic = "force-dynamic";

export default async function AdminShellLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) {
    redirect("/admin/login");
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <div className="admin-sidebar__logo-mark">e4s</div>
          <div className="admin-sidebar__logo-text">
            <span className="admin-sidebar__logo-name">Events4Singles</span>
            <span className="admin-sidebar__logo-sub">Admin</span>
          </div>
        </div>
        <SideNav />
      </aside>
      <div className="admin-right">
        <header className="admin-topbar">
          <span className="admin-topbar__title">Admin Console</span>
          <div className="admin-topbar__actions">
            <div className="admin-user-chip">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              Matt
            </div>
          </div>
        </header>
        <main className="admin-main">
          <div className="admin-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
