import Link from "next/link";
import type { Category } from "@/lib/types";
import { toUrlSlug } from "@/lib/constants";

interface Props {
  categories: Category[];
  currentDbSlug: string;
}

export default function CategoryPager({ categories, currentDbSlug }: Props) {
  const sorted = [...categories].sort((a, b) => a.label.localeCompare(b.label));
  const idx = sorted.findIndex((c) => c.slug === currentDbSlug);
  if (idx === -1 || sorted.length < 2) return null;

  const prev = sorted[(idx - 1 + sorted.length) % sorted.length];
  const next = sorted[(idx + 1) % sorted.length];

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
