"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { consumeScrollTopAfterNavigation } from "@/lib/client-nav";

const RESTORE_ON_POP_KEY = "e4s_restore_scroll_on_next_route";
const PENDING_RESTORE_PATH_KEY = "e4s_pending_restore_path";
const SUPPRESS_SCROLL_SAVE_UNTIL_KEY = "e4s_suppress_scroll_save_until";

export default function NavigationTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  useEffect(() => {
    const onPopState = () => {
      sessionStorage.setItem(RESTORE_ON_POP_KEY, "1");
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const link = target?.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const href = new URL(link.href, window.location.href);
      if (!href.pathname.startsWith("/listing/") && !href.pathname.startsWith("/profile/")) return;

      sessionStorage.setItem("e4s_prev_path", currentPath);
      sessionStorage.setItem(`e4s_scroll_${currentPath}`, String(window.scrollY));
      sessionStorage.setItem(PENDING_RESTORE_PATH_KEY, currentPath);
      sessionStorage.setItem(SUPPRESS_SCROLL_SAVE_UNTIL_KEY, String(Date.now() + 1200));

      const card = target?.closest<HTMLElement>("[data-e4s-listing-card]");
      if (card?.id) {
        sessionStorage.setItem("e4s_listing_source_path", currentPath);
        sessionStorage.setItem("e4s_listing_source_card", card.id);
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [currentPath]);

  // Restore scroll position when navigating back to a non-detail page
  useEffect(() => {
    if (pathname.startsWith("/listing/") || pathname.startsWith("/profile/")) return;

    sessionStorage.setItem("e4s_prev_path", currentPath);

    if (consumeScrollTopAfterNavigation(currentPath) || consumeScrollTopAfterNavigation(pathname)) {
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
      return;
    }

    const listingSourcePath = sessionStorage.getItem("e4s_listing_source_path");
    const listingSourceCard = sessionStorage.getItem("e4s_listing_source_card");
    if ((listingSourcePath === currentPath || listingSourcePath === pathname) && listingSourceCard) {
      sessionStorage.removeItem("e4s_listing_source_path");
      sessionStorage.removeItem("e4s_listing_source_card");
      requestAnimationFrame(() => {
        const card = document.getElementById(listingSourceCard);
        if (card) {
          const headerOffset = parseInt(
            getComputedStyle(document.documentElement).getPropertyValue("--e4s-header-height"),
            10
          ) || 150;
          const toolbarHeight = document.querySelector<HTMLElement>(".e4s-toolbar-shield")
            ?.getBoundingClientRect().height || 0;
          const top = card.getBoundingClientRect().top + window.scrollY - headerOffset - toolbarHeight - 22;
          window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
        }
      });
      return;
    }

    const backTarget = sessionStorage.getItem("e4s_back_nav");
    const pendingRestorePath = sessionStorage.getItem(PENDING_RESTORE_PATH_KEY);
    const shouldRestorePopScroll = sessionStorage.getItem(RESTORE_ON_POP_KEY) === "1";
    if (
      backTarget === currentPath ||
      backTarget === pathname ||
      pendingRestorePath === currentPath ||
      pendingRestorePath === pathname ||
      shouldRestorePopScroll
    ) {
      sessionStorage.removeItem("e4s_back_nav");
      sessionStorage.removeItem(PENDING_RESTORE_PATH_KEY);
      sessionStorage.removeItem(RESTORE_ON_POP_KEY);
      const savedY = sessionStorage.getItem(`e4s_scroll_${currentPath}`) ?? sessionStorage.getItem(`e4s_scroll_${pathname}`);
      if (savedY) {
        sessionStorage.setItem(SUPPRESS_SCROLL_SAVE_UNTIL_KEY, String(Date.now() + 1200));
        const restore = () => window.scrollTo(0, parseInt(savedY, 10));
        requestAnimationFrame(() => {
          restore();
          window.setTimeout(restore, 120);
          window.setTimeout(restore, 350);
        });
      }
    }
  }, [currentPath, pathname]);

  // Save scroll position continuously for non-listing pages
  useEffect(() => {
    if (pathname.startsWith("/listing/") || pathname.startsWith("/profile/")) return;
    const key = `e4s_scroll_${currentPath}`;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const suppressUntil = parseInt(sessionStorage.getItem(SUPPRESS_SCROLL_SAVE_UNTIL_KEY) || "0", 10);
          if (suppressUntil && Date.now() < suppressUntil) {
            ticking = false;
            return;
          }
          sessionStorage.setItem(key, String(window.scrollY));
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [currentPath, pathname]);

  return null;
}
