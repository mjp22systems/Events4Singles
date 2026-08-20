"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/portal/dashboard",    label: "Dashboard",    icon: "⬛" },
  { href: "/portal/profile",      label: "Profile",      icon: "👤" },
  { href: "/portal/listings",     label: "Listings",     icon: "📋" },
  { href: "/portal/banners",      label: "Banners",      icon: "🖼" },
  { href: "/portal/events",       label: "Events",       icon: "📅" },
  { href: "/portal/analytics",    label: "Analytics",    icon: "📊" },
  { href: "/portal/subscription", label: "Subscription", icon: "💳" },
];

export default function PortalSideNav() {
  const pathname = usePathname();
  return (
    <nav className="p-sidenav">
      {NAV.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`p-sidenav__item${active ? " p-sidenav__item--active" : ""}`}
          >
            <span className="p-sidenav__icon">{item.icon}</span>
            <span className="p-sidenav__label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
