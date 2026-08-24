"use client";
import { MouseEvent, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [sort, setSort] = useState<"popular" | "alpha">("popular");
  const [isPending, startTransition] = useTransition();

  const sorted = [...items].sort((a, b) =>
    sort === "alpha"
      ? a.label.localeCompare(b.label)
      : b.count - a.count
  );

  function navigateInPlace(href: string) {
    return (event: MouseEvent<HTMLAnchorElement>) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return;
      }

      event.preventDefault();
      startTransition(() => {
        router.push(href, { scroll: false });
      });
    };
  }

  return (
    <div className={`e4s-sidebar-block${isPending ? " e4s-sidebar-block--pending" : ""}`}>
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
          <Link
            href={topItem.href}
            aria-current={topItem.isActive ? "page" : undefined}
            onClick={navigateInPlace(topItem.href)}
          >
            <span>{topItem.label}</span>
          </Link>
        )}
        {sorted.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            aria-current={item.isActive ? "page" : undefined}
            onClick={navigateInPlace(item.href)}
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
