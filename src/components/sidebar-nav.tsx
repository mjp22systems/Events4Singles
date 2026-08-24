"use client";
import { useState } from "react";
import Link from "next/link";

interface NavItem {
  key: string;
  label: string;
  href: string;
  count: number;
  isActive?: boolean;
}

interface Props {
  heading: string;
  items: NavItem[];
  topItem?: { label: string; href: string; isActive?: boolean };
}

export default function SidebarNav({ heading, items, topItem }: Props) {
  const [sort, setSort] = useState<"popular" | "alpha">("popular");

  const sorted = [...items].sort((a, b) =>
    sort === "alpha"
      ? a.label.localeCompare(b.label)
      : b.count - a.count
  );

  return (
    <div className="e4s-sidebar-block">
      <div className="e4s-sidebar-block__header">
        <p className="e4s-sidebar-block__heading">{heading}</p>
        <div className="e4s-sidebar-sort" aria-label="Sort order">
          <button
            className={sort === "popular" ? "active" : ""}
            onClick={() => setSort("popular")}
            title="Sort by popularity"
            type="button"
          >
            ↓
          </button>
          <button
            className={sort === "alpha" ? "active" : ""}
            onClick={() => setSort("alpha")}
            title="Sort A–Z"
            type="button"
          >
            A–Z
          </button>
        </div>
      </div>
      <nav className="e4s-sidebar-nav" aria-label={heading}>
        {topItem && (
          <Link href={topItem.href} aria-current={topItem.isActive ? "page" : undefined}>
            <span>{topItem.label}</span>
          </Link>
        )}
        {sorted.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            aria-current={item.isActive ? "page" : undefined}
          >
            <span>{item.label}</span>
            {item.count > 0 && (
              <span className="e4s-sidebar-nav__count">{item.count}</span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}
