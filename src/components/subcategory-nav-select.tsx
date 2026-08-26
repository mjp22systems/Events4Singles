"use client";
import { useRouter } from "next/navigation";
import { toUrlSlug } from "@/lib/constants";
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

  return (
    <select
      value={currentSubcategorySlug}
      onChange={(e) => {
        if (!e.target.value) return;
        const nextSlug = toUrlSlug(e.target.value);
        router.push(cityUrlSlug ? `/${parentUrlSlug}/${nextSlug}/${cityUrlSlug}` : `/${parentUrlSlug}/${nextSlug}`);
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
          {subcategory.label} ({subcategory.listing_count})
        </option>
      ))}
    </select>
  );
}
