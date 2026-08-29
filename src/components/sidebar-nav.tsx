"use client";
import { MouseEvent, useEffect, useState, useTransition } from "react";
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

const PIN_TOOLBAR_KEY = "e4s_pin_toolbar_after_refine";
const NAV_OPEN_STORAGE_KEY = "e4s-nav-open";
const CLOSE_NAV_EVENT = "e4s:close-nav";

function shouldCloseHeaderMenu() {
  return window.matchMedia("(max-width: 700px)").matches;
}

function getPinnedToolbarTarget() {
  const toolbar = document.querySelector<HTMLElement>(".e4s-toolbar-shield");
  if (!toolbar) return null;

  const stickyTop = parseFloat(getComputedStyle(toolbar).top) || 0;
  const toolbarTop = toolbar.getBoundingClientRect().top;
  return toolbarTop <= stickyTop + 2
    ? Math.max(0, toolbarTop + window.scrollY - stickyTop)
    : null;
}

function getToolbarAnchorTarget() {
  const toolbar = document.querySelector<HTMLElement>(".e4s-toolbar-shield");
  if (!toolbar) return null;

  const stickyTop = parseFloat(getComputedStyle(toolbar).top) || 0;
  return Math.max(0, toolbar.getBoundingClientRect().top + window.scrollY - stickyTop);
}

function closeTopNavigation() {
  if (!shouldCloseHeaderMenu()) return;

  localStorage.setItem(NAV_OPEN_STORAGE_KEY, "0");
  document.body.classList.remove("e4s-nav-open");
  window.dispatchEvent(new Event(CLOSE_NAV_EVENT));
}

function restorePinnedToolbar() {
  const restore = () => {
    const targetTop = getToolbarAnchorTarget();
    if (targetTop === null) return;
    window.scrollTo({ top: targetTop, behavior: "auto" });
  };

  requestAnimationFrame(() => requestAnimationFrame(() => {
    restore();
    window.setTimeout(restore, 120);
  }));
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
      if (getPinnedToolbarTarget() !== null) {
        sessionStorage.setItem(PIN_TOOLBAR_KEY, "1");
      }
      closeTopNavigation();
      startTransition(() => {
        router.push(href, { scroll: false });
      });
    };
  }

  useEffect(() => {
    if (isPending || sessionStorage.getItem(PIN_TOOLBAR_KEY) !== "1") return;
    sessionStorage.removeItem(PIN_TOOLBAR_KEY);
    restorePinnedToolbar();
  }, [isPending]);

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
