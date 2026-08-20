"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function NavigationTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const link = target?.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const href = new URL(link.href, window.location.href);
      if (!href.pathname.startsWith("/listing/")) return;

      const card = target?.closest<HTMLElement>("[data-e4s-listing-card]");
      if (!card?.id) return;

      sessionStorage.setItem("e4s_listing_source_path", pathname);
      sessionStorage.setItem("e4s_listing_source_card", card.id);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);

  // Restore scroll position when navigating back to a non-listing page
  useEffect(() => {
    if (pathname.startsWith("/listing/") || pathname.startsWith("/profile/")) return;

    sessionStorage.setItem("e4s_prev_path", pathname);

    const listingSourcePath = sessionStorage.getItem("e4s_listing_source_path");
    const listingSourceCard = sessionStorage.getItem("e4s_listing_source_card");
    if (listingSourcePath === pathname && listingSourceCard) {
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
    if (backTarget === pathname) {
      sessionStorage.removeItem("e4s_back_nav");
      const savedY = sessionStorage.getItem(`e4s_scroll_${pathname}`);
      if (savedY) {
        requestAnimationFrame(() => window.scrollTo(0, parseInt(savedY, 10)));
      }
    }
  }, [pathname]);

  // Save scroll position continuously for non-listing pages
  useEffect(() => {
    if (pathname.startsWith("/listing/") || pathname.startsWith("/profile/")) return;
    const key = `e4s_scroll_${pathname}`;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          sessionStorage.setItem(key, String(window.scrollY));
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}
