"use client";
import { useState, useCallback, useEffect } from "react";

const NAV_OPEN_STORAGE_KEY = "e4s-nav-open";
const CLOSE_NAV_EVENT = "e4s:close-nav";

export default function MobileMenuToggle() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    localStorage.setItem(NAV_OPEN_STORAGE_KEY, "0");
    document.body.classList.remove("e4s-nav-open");
    setOpen(false);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(NAV_OPEN_STORAGE_KEY);
    if (saved === null) return;

    const next = saved === "1";
    // Hydrate persisted browser-only state after the server render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(next);
    document.body.classList.toggle("e4s-nav-open", next);
  }, []);

  useEffect(() => {
    window.addEventListener(CLOSE_NAV_EVENT, close);
    return () => window.removeEventListener(CLOSE_NAV_EVENT, close);
  }, [close]);

  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      localStorage.setItem(NAV_OPEN_STORAGE_KEY, next ? "1" : "0");
      document.body.classList.toggle("e4s-nav-open", next);
      return next;
    });
  }, []);

  return (
    <button
      aria-expanded={open}
      aria-label={open ? "Close navigation" : "Open navigation"}
      className={`e4s-header__menu-btn${open ? " is-open" : ""}`}
      onClick={toggle}
      type="button"
    >
      <span aria-hidden="true">{open ? "✕" : "☰"}</span>
      <span>{open ? "Close" : "Menu"}</span>
    </button>
  );
}
