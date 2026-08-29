"use client";
import { useRouter } from "next/navigation";
import { toCategoryChildUrlSegment, toDbSlug } from "@/lib/constants";
import { closeHeaderMenu } from "@/lib/client-nav";
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
      onClick={closeHeaderMenu}
      onChange={(e) => {
        if (!e.target.value) return;
        closeHeaderMenu();
        const nextSlug = toCategoryChildUrlSegment(toDbSlug(parentUrlSlug), e.target.value);
        router.push(cityUrlSlug ? `/${parentUrlSlug}/${nextSlug}/${cityUrlSlug}` : `/${parentUrlSlug}/${nextSlug}`);
      }}
      onFocus={closeHeaderMenu}
      onPointerDown={closeHeaderMenu}
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
