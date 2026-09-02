"use client";

const NAV_OPEN_STORAGE_KEY = "e4s-nav-open";
const CLOSE_NAV_EVENT = "e4s:close-nav";
const SCROLL_TOP_AFTER_NAV_KEY = "e4s_scroll_top_after_nav";

function shouldCloseHeaderMenu() {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 700px)").matches;
}

export function closeHeaderMenu() {
  if (!shouldCloseHeaderMenu()) return;

  window.localStorage.setItem(NAV_OPEN_STORAGE_KEY, "0");
  document.body.classList.remove("e4s-nav-open");
  window.dispatchEvent(new Event(CLOSE_NAV_EVENT));
}

export function markScrollTopAfterNavigation(href: string) {
  if (typeof window === "undefined") return;

  const url = new URL(href, window.location.href);
  window.sessionStorage.setItem(SCROLL_TOP_AFTER_NAV_KEY, url.pathname);

  if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
    window.scrollTo({ top: 0, behavior: "auto" });
  }
}

export function consumeScrollTopAfterNavigation(pathname: string) {
  if (typeof window === "undefined") return false;

  const target = window.sessionStorage.getItem(SCROLL_TOP_AFTER_NAV_KEY);
  if (target !== pathname) return false;

  window.sessionStorage.removeItem(SCROLL_TOP_AFTER_NAV_KEY);
  return true;
}
