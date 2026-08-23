"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Activity, List, Building2, Users, Calendar,
  Tag, MapPin, Image, CreditCard, Route, BarChart2, Plug,
  ClipboardCheck, Settings,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  Icon: ComponentType<{ size?: number }>;
  child?: boolean;
};

const SECTIONS: NavItem[][] = [
  [
    { href: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { href: "/admin/activity", label: "Activity", Icon: Activity },
  ],
  [
    { href: "/admin/users", label: "Users", Icon: Users },
    { href: "/admin/businesses", label: "Businesses", Icon: Building2 },
    { href: "/admin/business-requests", label: "Requests", Icon: ClipboardCheck, child: true },
    { href: "/admin/listings", label: "Listings", Icon: List },
    { href: "/admin/tools", label: "Listing Review", Icon: ClipboardCheck, child: true },
    { href: "/admin/events", label: "Events", Icon: Calendar },
    { href: "/admin/banners", label: "Banners", Icon: Image },
  ],
  [
    { href: "/admin/categories", label: "Categories", Icon: Tag },
    { href: "/admin/cities", label: "Cities", Icon: MapPin },
  ],
  [
    { href: "/admin/integrations", label: "Integrations", Icon: Plug },
    { href: "/admin/payments", label: "Payments", Icon: CreditCard },
    { href: "/admin/seo", label: "Redirects", Icon: Route },
    { href: "/admin/analytics", label: "Analytics", Icon: BarChart2 },
    { href: "/admin/settings", label: "Settings", Icon: Settings },
  ],
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="admin-sidebar__nav">
      {SECTIONS.map((section, si) => (
        <div key={si} className="admin-nav-section">
          {section.map(({ href, label, Icon, child }) => {
            const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
            return (
              <Link key={href} href={href} className={`admin-nav-item${child ? " admin-nav-item--child" : ""}${active ? " active" : ""}`}>
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
