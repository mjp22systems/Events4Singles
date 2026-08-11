"use client";
import { useRouter } from "next/navigation";
import type { City } from "@/lib/types";
import { toUrlSlug } from "@/lib/constants";

interface Props {
  cities: City[];
  categoryUrlSlug: string;
  currentCitySlug: string;
}

export default function NavSelect({ cities, categoryUrlSlug, currentCitySlug }: Props) {
  const router = useRouter();

  return (
    <select
      value={currentCitySlug}
      onChange={(e) => router.push(`/${categoryUrlSlug}/${toUrlSlug(e.target.value)}`)}
      aria-label="Choose city"
    >
      {cities.map((city) => (
        <option key={city.slug} value={city.slug}>
          {city.label} ({city.listing_count})
        </option>
      ))}
    </select>
  );
}
