import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import PortalSideNav from "@/components/portal/side-nav";
import { getOrCreateAccount } from "@/lib/portal-db";

export const dynamic = "force-dynamic";

export default async function PortalShellLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/portal/sign-in");

  const account = await getOrCreateAccount(user.id, user.emailAddresses[0]?.emailAddress);

  const providerName = user.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
    : user.emailAddresses[0]?.emailAddress ?? "Advertiser";
  const displayName = account.display_name ?? providerName;
  const accountEmail = account.portal_email ?? user.emailAddresses[0]?.emailAddress;
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "A";

  return (
    <div className="p-shell">
      <input type="checkbox" id="p-sidebar-toggle" className="p-sidebar__toggle" aria-label="Toggle navigation" />
      <label htmlFor="p-sidebar-toggle" className="p-sidebar__toggle-label" aria-hidden="true">☰</label>
      <aside className="p-sidebar">
        <div className="p-sidebar__logo">
          <div className="p-sidebar__logo-mark">e4s</div>
          <div className="p-sidebar__logo-text">
            <span className="p-sidebar__logo-name">Events4Singles</span>
            <span className="p-sidebar__logo-sub">Advertiser Portal</span>
          </div>
        </div>
        <PortalSideNav />
        <div className="p-sidebar__footer">
          <Link href="/" className="p-sidebar__site-link">← View site</Link>
        </div>
      </aside>
      <div className="p-right">
        <header className="p-topbar">
          <span className="p-topbar__title" />
          <div className="p-topbar__user">
            <span className="p-user-chip">
              <span className="p-user-avatar">{initials}</span>
              {accountEmail ?? displayName}
            </span>
            <Link href="/portal/sign-out" className="p-btn p-topbar__sign-out">Sign out</Link>
          </div>
        </header>
        <main className="p-main">
          <div className="p-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
