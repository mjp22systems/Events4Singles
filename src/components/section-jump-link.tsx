"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

type SectionJumpLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: `#${string}`;
};

function targetTop(target: HTMLElement) {
  const headerOffset =
    parseInt(getComputedStyle(document.documentElement).getPropertyValue("--e4s-header-height"), 10) || 86;
  return Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerOffset - 48);
}

export default function SectionJumpLink({ children, href, onClick, ...props }: SectionJumpLinkProps) {
  return (
    <a
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        const target = document.getElementById(href.slice(1));
        if (!target) return;

        event.preventDefault();
        window.scrollTo({ top: targetTop(target), behavior: "smooth" });
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
