"use client";
import { useRouter, usePathname } from "next/navigation";
import type { Category, City } from "@/lib/types";
import { toUrlSlug, toDbSlug } from "@/lib/constants";

interface Props {
  cities: City[];
  categories: Category[];
}

export default function NavDropdowns({ cities, categories }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const citySet = new Set(cities.map((c) => toUrlSlug(c.slug)));
  const segs = pathname.split("/").filter(Boolean);

  // Derive selected values from current URL
  const seg0 = segs[0] ?? "";
  const seg1 = segs[1] ?? "";

  const selectedCity = citySet.has(seg1)
    ? seg1
    : citySet.has(seg0)
    ? seg0
    : "";

  const selectedCat = seg0 && !citySet.has(seg0) && seg0 !== "listing" && seg0 !== "portal"
    ? seg0
    : "";

  const filteredCats = categories.filter((c) => c.slug !== "events");

  return (
    <nav aria-label="Site navigation" className="e4s-shell e4s-nav">
      <label>
        <span>Location</span>
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) router.push(`/${toUrlSlug(e.target.value)}`);
          }}
        >
          <option value="" disabled>
            {selectedCity
              ? (cities.find((c) => toUrlSlug(c.slug) === selectedCity)?.label ?? "Choose city")
              : "Choose city"}
          </option>
          {cities.map((city) => (
            <option key={city.slug} value={toUrlSlug(city.slug)}>
              {city.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Category</span>
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) router.push(`/${e.target.value}`);
          }}
        >
          <option value="" disabled>
            {selectedCat
              ? (filteredCats.find((c) => toUrlSlug(c.slug) === selectedCat)?.label ?? "Browse type")
              : "Browse type"}
          </option>
          {filteredCats.map((cat) => (
            <option key={cat.slug} value={toUrlSlug(cat.slug)}>
              {cat.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Events</span>
        <select
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) router.push(e.target.value);
          }}
        >
          <option value="">Events calendar</option>
          <option value="/events">All cities</option>
          <option value="/sydney">Sydney</option>
          <option value="/melbourne">Melbourne</option>
          <option value="/brisbane">Brisbane</option>
          <option value="/adelaide">Adelaide</option>
          <option value="/perth">Perth</option>
          <option value="/gold-coast">Gold Coast</option>
          <option value="/canberra">Canberra</option>
        </select>
      </label>

      <label>
        <span>Information</span>
        <select
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) router.push(e.target.value);
          }}
        >
          <option value="">Site information</option>
          <option value="/about">About</option>
          <option value="/contact">Contact</option>
          <option value="/advice">Dating advice</option>
          <option value="/portal">Advertise with us</option>
          <option value="/terms">Terms of Use</option>
        </select>
      </label>
    </nav>
  );
}
