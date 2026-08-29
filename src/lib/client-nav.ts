"use client";

const NAV_OPEN_STORAGE_KEY = "e4s-nav-open";
const CLOSE_NAV_EVENT = "e4s:close-nav";

export function closeHeaderMenu() {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(NAV_OPEN_STORAGE_KEY, "0");
  document.body.classList.remove("e4s-nav-open");
  window.dispatchEvent(new Event(CLOSE_NAV_EVENT));
}
