"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import type { Category, City } from "@/lib/types";
import { toUrlSlug } from "@/lib/constants";

interface Props {
  cities: City[];
  categories: Category[];
}

export default function NavDropdowns({ cities, categories }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const citySet = new Set(cities.map((c) => toUrlSlug(c.slug)));
  const segs = pathname.split("/").filter(Boolean);
  const seg0 = segs[0] ?? "";
  const seg1 = segs[1] ?? "";

  const selectedCity = citySet.has(seg1) ? seg1 : citySet.has(seg0) ? seg0 : "";

  const INFO_ROUTES: Record<string, string> = {
    about: "About",
    contact: "Contact",
    advertise: "Advertise with Us",
    portal: "Advertiser Portal",
    terms: "Terms of Use",
    privacy: "Privacy Policy",
  };

  const infoSlugs = new Set(Object.keys(INFO_ROUTES));
  const selectedCat =
    seg0 && !citySet.has(seg0) && seg0 !== "listing" && !infoSlugs.has(seg0)
      ? seg0
      : "";
  const selectedInfo = INFO_ROUTES[seg0] ?? "";

  const filteredCats = categories.filter((c) => c.slug !== "events");

  const sortedCities = [...cities].sort((a, b) => a.label.localeCompare(b.label));
  const sortedCats = [...filteredCats].sort((a, b) => a.label.localeCompare(b.label));

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
              ? (cities.find((c) => toUrlSlug(c.slug) === selectedCity)?.label ?? "Select Location")
              : "Select Location"}
          </option>
          {sortedCities.map((city) => (
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
              ? (filteredCats.find((c) => toUrlSlug(c.slug) === selectedCat)?.label ?? "Select Category")
              : "Select Category"}
          </option>
          {sortedCats.map((cat) => (
            <option key={cat.slug} value={toUrlSlug(cat.slug)}>
              {cat.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Information</span>
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) router.push(e.target.value);
          }}
        >
          <option value="" disabled>{selectedInfo || "Site Information"}</option>
          <option value="/about">About</option>
          <option value="/advertise">Advertise with Us</option>
          <option value="/portal">Advertiser Portal</option>
          <option value="/contact">Contact</option>
          <option value="/privacy">Privacy Policy</option>
          <option value="/terms">Terms of Use</option>
        </select>
      </label>

      <div className="e4s-nav__events-cell">
        <Link href="/dating-resources" className="e4s-nav__dating-btn">Dating Resources</Link>
        <Link href="/events" className="e4s-nav__events-btn">Events Calendar</Link>
      </div>
    </nav>
  );
}
