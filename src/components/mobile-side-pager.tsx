"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { closeHeaderMenu, markScrollTopAfterNavigation } from "@/lib/client-nav";

export interface MobileSidePagerTarget {
  href: string;
  label: string;
}

interface Props {
  previous?: MobileSidePagerTarget | null;
  next?: MobileSidePagerTarget | null;
  label?: string;
  className?: string;
}

export default function MobileSidePager({ className, previous, next, label = "Related page navigation" }: Props) {
  const router = useRouter();
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const previousRef = useRef(previous);
  const nextRef = useRef(next);

  const prepareNavigation = useCallback((href: string) => {
    closeHeaderMenu();
    markScrollTopAfterNavigation(href);
  }, []);

  useEffect(() => {
    previousRef.current = previous;
    nextRef.current = next;
  }, [previous, next]);

  useEffect(() => {
    if (!previous && !next) return;

    const isInteractiveTarget = (target: EventTarget | null) => {
      return target instanceof Element && Boolean(target.closest("a, button, input, select, textarea, label, summary, [role='button'], [data-e4s-no-swipe]"));
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1 || isInteractiveTarget(event.target)) {
        touchStart.current = null;
        return;
      }
      const touch = event.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    };

    const onTouchEnd = (event: TouchEvent) => {
      const start = touchStart.current;
      touchStart.current = null;
      if (!start || event.changedTouches.length !== 1 || isInteractiveTarget(event.target)) return;

      const touch = event.changedTouches[0];
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      if (Math.abs(dx) < 78 || Math.abs(dx) < Math.abs(dy) * 1.8) return;

      const target = dx < 0 ? nextRef.current : previousRef.current;
      if (target) {
        prepareNavigation(target.href);
        router.push(target.href, { scroll: false });
      }
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [next, prepareNavigation, previous, router]);

  if (!previous && !next) return null;

  return (
    <nav className={`e4s-mobile-side-pager${className ? ` ${className}` : ""}`} aria-label={label}>
      {previous ? (
        <Link
          className="e4s-mobile-side-pager__button e4s-mobile-side-pager__button--prev"
          href={previous.href}
          aria-label={`Previous: ${previous.label}`}
          onClick={() => prepareNavigation(previous.href)}
        >
          <span className="e4s-mobile-side-pager__icon" />
        </Link>
      ) : null}
      {next ? (
        <Link
          className="e4s-mobile-side-pager__button e4s-mobile-side-pager__button--next"
          href={next.href}
          aria-label={`Next: ${next.label}`}
          onClick={() => prepareNavigation(next.href)}
        >
          <span className="e4s-mobile-side-pager__icon" />
        </Link>
      ) : null}
    </nav>
  );
}
