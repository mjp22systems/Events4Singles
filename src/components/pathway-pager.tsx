import Link from "next/link";
import { PATHWAYS } from "@/lib/pathways";

export default function PathwayPager({ currentSlug }: { currentSlug: string }) {
  const idx = PATHWAYS.findIndex((pathway) => pathway.slug === currentSlug);
  if (idx === -1 || PATHWAYS.length < 2) return null;

  const prev = PATHWAYS[(idx - 1 + PATHWAYS.length) % PATHWAYS.length];
  const next = PATHWAYS[(idx + 1) % PATHWAYS.length];

  return (
    <>
      <Link
        aria-label={`Previous pathway: ${prev.title}`}
        className="e4s-location-pager e4s-location-pager--prev e4s-pathway-side-pager"
        href={`/${prev.slug}`}
      >
        <span className="e4s-location-pager__icon" />
        <span className="e4s-location-pager__label">{prev.title}</span>
      </Link>
      <Link
        aria-label={`Next pathway: ${next.title}`}
        className="e4s-location-pager e4s-location-pager--next e4s-pathway-side-pager"
        href={`/${next.slug}`}
      >
        <span className="e4s-location-pager__icon" />
        <span className="e4s-location-pager__label">{next.title}</span>
      </Link>
    </>
  );
}
