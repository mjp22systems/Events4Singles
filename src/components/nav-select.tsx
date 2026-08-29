"use client";
import { useRouter } from "next/navigation";
import type { City } from "@/lib/types";
import { toUrlSlug } from "@/lib/constants";
import { closeHeaderMenu } from "@/lib/client-nav";

interface Props {
  cities: City[];
  categoryUrlSlug: string;
  currentCitySlug?: string;
  placeholder?: string;
}

export default function NavSelect({ cities, categoryUrlSlug, currentCitySlug = "", placeholder }: Props) {
  const router = useRouter();

  return (
    <select
      value={currentCitySlug}
      onChange={(e) => {
        if (!e.target.value) return;
        closeHeaderMenu();
        router.push(`/${categoryUrlSlug}/${toUrlSlug(e.target.value)}`);
      }}
      aria-label="Choose city"
    >
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {cities.map((city) => (
        <option key={city.slug} value={city.slug}>
          {city.label} ({city.listing_count})
        </option>
      ))}
    </select>
  );
}
