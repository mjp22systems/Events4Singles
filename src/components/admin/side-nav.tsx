"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Activity, List, Building2, Users,
  Tag, MapPin, Image, CreditCard, Search, BarChart2,
  Wrench, Settings, LogOut,
} from "lucide-react";

const SECTIONS = [
  [
    { href: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { href: "/admin/activity", label: "Activity", Icon: Activity },
  ],
  [
    { href: "/admin/listings", label: "Listings", Icon: List },
    { href: "/admin/businesses", label: "Businesses", Icon: Building2 },
    { href: "/admin/customers", label: "Customers", Icon: Users },
  ],
  [
    { href: "/admin/categories", label: "Categories", Icon: Tag },
    { href: "/admin/cities", label: "Cities", Icon: MapPin },
    { href: "/admin/banners", label: "Banners", Icon: Image },
  ],
  [
    { href: "/admin/payments", label: "Payments", Icon: CreditCard },
    { href: "/admin/seo", label: "SEO", Icon: Search },
    { href: "/admin/analytics", label: "Analytics", Icon: BarChart2 },
    { href: "/admin/tools", label: "Tools", Icon: Wrench },
    { href: "/admin/settings", label: "Settings", Icon: Settings },
  ],
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <>
      <nav className="admin-sidebar__nav">
        {SECTIONS.map((section, si) => (
          <div key={si} className="admin-nav-section">
            {section.map(({ href, label, Icon }) => {
              const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
              return (
                <Link key={href} href={href} className={`admin-nav-item${active ? " active" : ""}`}>
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="admin-sidebar__footer">
        <form action="/admin/api/logout" method="POST">
          <button type="submit" className="admin-nav-item">
            <LogOut size={16} />
            Sign out
          </button>
        </form>
      </div>
    </>
  );
}
