import Link from "next/link";
import type { City } from "@/lib/types";
import { toUrlSlug } from "@/lib/constants";

interface Props {
  cities: City[];
  currentDbSlug: string;
}

export default function LocationPager({ cities, currentDbSlug }: Props) {
  const idx = cities.findIndex((c) => c.slug === currentDbSlug);
  if (idx === -1) return null;

  const prev = idx > 0 ? cities[idx - 1] : null;
  const next = idx < cities.length - 1 ? cities[idx + 1] : null;

  return (
    <>
      {prev && (
        <Link
          aria-label={`Previous: ${prev.label}`}
          className="e4s-location-pager e4s-location-pager--prev"
          href={`/${toUrlSlug(prev.slug)}`}
        >
          <span className="e4s-location-pager__icon" />
          <span className="e4s-location-pager__label">{prev.label}</span>
        </Link>
      )}
      {next && (
        <Link
          aria-label={`Next: ${next.label}`}
          className="e4s-location-pager e4s-location-pager--next"
          href={`/${toUrlSlug(next.slug)}`}
        >
          <span className="e4s-location-pager__icon" />
          <span className="e4s-location-pager__label">{next.label}</span>
        </Link>
      )}
    </>
  );
}
