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

  const routeSegmentToLabel = (segment: string) =>
    segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const citySet = new Set(cities.map((c) => toUrlSlug(c.slug)));
  const segs = pathname.split("/").filter(Boolean);
  const seg0 = segs[0] ?? "";

  const INFO_ROUTES: Record<string, string> = {
    about: "About",
    advertise: "Advertise with Us",
    portal: "Advertiser Portal",
    businesses: "Business Directory",
    contact: "Contact",
    "dating-resources": "Dating Resources",
    "privacy-policy": "Privacy Policy",
    "terms-and-conditions": "Terms & Conditions",
    events: "What's On",
  };

  const infoSlugs = new Set(Object.keys(INFO_ROUTES));
  const filteredCats = categories.filter((c) => c.slug !== "events");
  const nestedCitySegment =
    segs.length >= 3 && seg0 !== "listing" && !infoSlugs.has(seg0)
      ? segs[segs.length - 1]
      : "";
  const selectedCity = [...segs].reverse().find((segment) => citySet.has(segment)) ?? nestedCitySegment;
  const selectedCat =
    seg0 && !citySet.has(seg0) && seg0 !== "listing" && !infoSlugs.has(seg0)
      ? seg0
      : "";
  const selectedInfo = INFO_ROUTES[seg0] ?? "";
  const selectedCityLabel = selectedCity
    ? (cities.find((c) => toUrlSlug(c.slug) === selectedCity)?.label ?? routeSegmentToLabel(selectedCity))
    : "Select City";
  const cityLabel = seg0 === "cities"
    ? "All Cities"
    : selectedCity
      ? selectedCityLabel
      : "Select City";
  const categoryLabel = seg0 === "categories"
    ? "All Categories"
    : selectedCat
      ? (filteredCats.find((c) => toUrlSlug(c.slug) === selectedCat)?.label ?? "Select Category")
      : "Select Category";

  const sortedCities = [...cities].sort((a, b) => a.label.localeCompare(b.label));
  const sortedCats = [...filteredCats].sort((a, b) => a.label.localeCompare(b.label));

  return (
    <nav aria-label="Site navigation" className="e4s-shell e4s-nav">
      <label>
        <span>Cities</span>
        <select
          value=""
          onChange={(e) => {
            const val = e.target.value;
            if (val === "__all__") router.push("/cities");
            else if (val) router.push(`/${toUrlSlug(val)}`);
          }}
        >
          <option value="" disabled>
            {cityLabel}
          </option>
          <option value="__all__">All Cities →</option>
          <option value="__sep__" disabled>─────────────</option>
          {sortedCities.map((city) => (
            <option key={city.slug} value={toUrlSlug(city.slug)}>
              {city.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Categories</span>
        <select
          value=""
          onChange={(e) => {
            const val = e.target.value;
            if (val === "__all__") router.push("/categories");
            else if (val) router.push(`/${val}`);
          }}
        >
          <option value="" disabled>
            {categoryLabel}
          </option>
          <option value="__all__">All Categories →</option>
          <option value="__sep__" disabled>─────────────</option>
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
          <option value="/businesses">Business Directory</option>
          <option value="/contact">Contact</option>
          <option value="/dating-resources">Dating Resources</option>
          <option value="/privacy-policy">Privacy Policy</option>
          <option value="/terms-and-conditions">Terms &amp; Conditions</option>
          <option value="/events">What&apos;s On</option>
        </select>
      </label>

      <div className="e4s-nav__events-cell">
        <Link href="/dating-resources" className="e4s-nav__dating-btn">Dating Resources</Link>
        <Link href="/events" className="e4s-nav__events-btn">What&apos;s On</Link>
      </div>
    </nav>
  );
}
