import Link from "next/link";
import type { Category } from "@/lib/types";
import { toCategoryChildUrlSegment, toDbSlug } from "@/lib/constants";

interface Props {
  subcategories: Category[];
  currentDbSlug: string;
  parentUrlSlug: string;
  cityUrlSlug?: string;
  variant?: "primary" | "secondary";
}

export default function SubcategoryPager({
  subcategories,
  currentDbSlug,
  parentUrlSlug,
  cityUrlSlug,
  variant = "primary",
}: Props) {
  const parentDbSlug = toDbSlug(parentUrlSlug);
  const sorted = [...subcategories].sort((a, b) => a.label.localeCompare(b.label));
  const idx = sorted.findIndex((cat) => cat.slug === currentDbSlug);
  if (idx === -1 || sorted.length < 2) return null;

  const pathFor = (cat: Category) => {
    const childSegment = toCategoryChildUrlSegment(parentDbSlug, cat.slug);
    return cityUrlSlug ? `/${parentUrlSlug}/${childSegment}/${cityUrlSlug}` : `/${parentUrlSlug}/${childSegment}`;
  };
  const prev = sorted[(idx - 1 + sorted.length) % sorted.length];
  const next = sorted[(idx + 1) % sorted.length];
  const variantClass = variant === "secondary" ? " e4s-location-pager--secondary" : "";

  return (
    <>
      {prev && (
        <Link
          aria-label={`Previous style: ${prev.label}`}
          className={`e4s-location-pager e4s-location-pager--prev${variantClass}`}
          href={pathFor(prev)}
        >
          <span className="e4s-location-pager__icon" />
          <span className="e4s-location-pager__label">{prev.label}</span>
        </Link>
      )}
      {next && (
        <Link
          aria-label={`Next style: ${next.label}`}
          className={`e4s-location-pager e4s-location-pager--next${variantClass}`}
          href={pathFor(next)}
        >
          <span className="e4s-location-pager__icon" />
          <span className="e4s-location-pager__label">{next.label}</span>
        </Link>
      )}
    </>
  );
}
