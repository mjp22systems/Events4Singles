"use client";
import { useRouter } from "next/navigation";
import { categoryChildLabelForDisplay, toCategoryChildUrlSegment, toDbSlug } from "@/lib/constants";
import { closeHeaderMenu, markScrollTopAfterNavigation } from "@/lib/client-nav";
import type { Category } from "@/lib/types";

interface Props {
  subcategories: Category[];
  parentUrlSlug: string;
  currentSubcategorySlug?: string;
  cityUrlSlug?: string;
  placeholder?: string;
}

export default function SubcategoryNavSelect({
  subcategories,
  parentUrlSlug,
  currentSubcategorySlug = "",
  cityUrlSlug,
  placeholder,
}: Props) {
  const router = useRouter();
  const parentDbSlug = toDbSlug(parentUrlSlug);

  return (
    <select
      value={currentSubcategorySlug}
      onChange={(e) => {
        if (!e.target.value) return;
        closeHeaderMenu();
        const nextSlug = toCategoryChildUrlSegment(parentDbSlug, e.target.value);
        const href = cityUrlSlug ? `/${parentUrlSlug}/${nextSlug}/${cityUrlSlug}` : `/${parentUrlSlug}/${nextSlug}`;
        markScrollTopAfterNavigation(href);
        router.push(href, { scroll: false });
      }}
      aria-label="Choose category"
    >
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {subcategories.map((subcategory) => (
        <option key={subcategory.slug} value={subcategory.slug}>
          {categoryChildLabelForDisplay(parentDbSlug, subcategory.label)} ({subcategory.listing_count})
        </option>
      ))}
    </select>
  );
}
