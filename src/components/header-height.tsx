"use client";
import { useEffect } from "react";

export default function HeaderHeight() {
  useEffect(() => {
    const header = document.querySelector(".e4s-header") as HTMLElement | null;
    if (!header) return;
    const apply = () => {
      const h = header.offsetHeight;
      document.documentElement.style.setProperty("--e4s-header-height", `${h}px`);
      document.documentElement.style.setProperty("--e4s-sticky-top", `${h - 1}px`);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);
  return null;
}
