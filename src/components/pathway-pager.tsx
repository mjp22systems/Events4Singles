"use client";

import Link from "next/link";
import MobileSidePager from "@/components/mobile-side-pager";
import { PATHWAYS } from "@/lib/pathways";
import { markScrollTopAfterNavigation } from "@/lib/client-nav";

function handlePathwayClick(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  markScrollTopAfterNavigation(href);
}

export default function PathwayPager({ currentSlug }: { currentSlug: string }) {
  const idx = PATHWAYS.findIndex((pathway) => pathway.slug === currentSlug);
  if (idx === -1 || PATHWAYS.length < 2) return null;

  const prev = PATHWAYS[(idx - 1 + PATHWAYS.length) % PATHWAYS.length];
  const next = PATHWAYS[(idx + 1) % PATHWAYS.length];
  const prevHref = `/${prev.slug}`;
  const nextHref = `/${next.slug}`;
  const previous = { href: prevHref, label: prev.title };
  const nextTarget = { href: nextHref, label: next.title };

  return (
    <>
      <MobileSidePager
        className="e4s-pathway-mobile-pager"
        label="Pathway page navigation"
        previous={previous}
        next={nextTarget}
      />
      <Link
        aria-label={`Previous pathway: ${prev.title}`}
        className="e4s-location-pager e4s-location-pager--prev e4s-pathway-side-pager"
        href={prevHref}
        onClick={(event) => handlePathwayClick(event, prevHref)}
        scroll={false}
      >
        <span className="e4s-location-pager__icon" />
        <span className="e4s-location-pager__label">{prev.title}</span>
      </Link>
      <Link
        aria-label={`Next pathway: ${next.title}`}
        className="e4s-location-pager e4s-location-pager--next e4s-pathway-side-pager"
        href={nextHref}
        onClick={(event) => handlePathwayClick(event, nextHref)}
        scroll={false}
      >
        <span className="e4s-location-pager__icon" />
        <span className="e4s-location-pager__label">{next.title}</span>
      </Link>
    </>
  );
}
