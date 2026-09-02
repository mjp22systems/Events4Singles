"use client";

import { useEffect } from "react";

const TARGETS: Record<string, string> = {
  "#pathway-fit": "pathway-fit-heading",
  "#pathway-fit-heading": "pathway-fit-heading",
  "#pathway-categories": "pathway-categories-heading",
  "#pathway-categories-heading": "pathway-categories-heading",
  "#pathways": "pathways-heading",
  "#pathways-heading": "pathways-heading",
};

function targetTop(target: HTMLElement) {
  const headerOffset =
    parseInt(getComputedStyle(document.documentElement).getPropertyValue("--e4s-header-height"), 10) || 86;
  return Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerOffset - 48);
}

export default function SectionAnchorCleaner() {
  useEffect(() => {
    const cleanAnchor = () => {
      const targetId = TARGETS[window.location.hash];
      if (!targetId) return;

      const cleanUrl = `${window.location.pathname}${window.location.search}`;
      const target = document.getElementById(targetId);
      if (!target) return;
      window.scrollTo({ top: targetTop(target), behavior: "auto" });
      window.history.replaceState(null, "", cleanUrl);
    };

    requestAnimationFrame(() => {
      cleanAnchor();
      window.setTimeout(cleanAnchor, 120);
    });

    window.addEventListener("hashchange", cleanAnchor);
    return () => window.removeEventListener("hashchange", cleanAnchor);
  }, []);

  return null;
}
