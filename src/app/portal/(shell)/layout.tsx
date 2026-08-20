import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PortalSideNav from "@/components/portal/side-nav";
import { getOrCreateAccount } from "@/lib/portal-db";

export const dynamic = "force-dynamic";

export default async function PortalShellLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/portal/sign-in");

  await getOrCreateAccount(user.id, user.emailAddresses[0]?.emailAddress);

  const displayName = user.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
    : user.emailAddresses[0]?.emailAddress ?? "Advertiser";

  return (
    <div className="p-shell">
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
          <a href="/" className="p-sidebar__site-link">← View site</a>
        </div>
      </aside>
      <div className="p-right">
        <header className="p-topbar">
          <span className="p-topbar__title" />
          <div className="p-topbar__user">
            <span className="p-user-chip">{displayName}</span>
            <a href="/portal/sign-out" className="p-btn" style={{ fontSize: "12px", height: "28px", padding: "0 10px", marginLeft: "8px" }}>Sign out</a>
          </div>
        </header>
        <main className="p-main">
          <div className="p-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
