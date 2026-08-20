"use client";
import { useState, useCallback } from "react";

export default function MobileMenuToggle() {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
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
