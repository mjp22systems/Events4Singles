import Link from "next/link";
import type { Category } from "@/lib/types";
import { toUrlSlug } from "@/lib/constants";

interface Props {
  categories: Category[];
  currentDbSlug: string;
  cityUrlSlug: string;
}

export default function CategoryInCityPager({ categories, currentDbSlug, cityUrlSlug }: Props) {
  const sorted = [...categories].sort((a, b) => a.label.localeCompare(b.label));
  const idx = sorted.findIndex((cat) => cat.slug === currentDbSlug);
  if (idx === -1 || sorted.length < 2) return null;

  const prev = sorted[(idx - 1 + sorted.length) % sorted.length];
  const next = sorted[(idx + 1) % sorted.length];
  const hrefFor = (category: Category) => `/${toUrlSlug(category.slug)}/${cityUrlSlug}`;

  return (
    <>
      <Link
        aria-label={`Previous category: ${prev.label}`}
        className="e4s-location-pager e4s-location-pager--prev"
        href={hrefFor(prev)}
      >
        <span className="e4s-location-pager__icon" />
        <span className="e4s-location-pager__label">{prev.label}</span>
      </Link>
      <Link
        aria-label={`Next category: ${next.label}`}
        className="e4s-location-pager e4s-location-pager--next"
        href={hrefFor(next)}
      >
        <span className="e4s-location-pager__icon" />
        <span className="e4s-location-pager__label">{next.label}</span>
      </Link>
    </>
  );
}
