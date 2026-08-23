import { toDbSlug } from "@/lib/constants";
import { cityNameToDbSlug } from "@/lib/adapters/shared";

export type NormalizedEventLocation = {
  suburb: string | null;
  city: string | null;
};

const SUBURB_TO_CITY: Record<string, string> = {
  artarmon: "sydney",
  bronte: "sydney",
  burwood: "sydney",
  chatswood: "sydney",
  cronulla: "sydney",
  darlinghurst: "sydney",
  glebe: "sydney",
  leura: "sydney",
  manly: "sydney",
  "milsons point": "sydney",
  newtown: "sydney",
  parramatta: "sydney",
  springwood: "sydney",
  surry_hills: "sydney",
  "surry hills": "sydney",
  sydney: "sydney",
  "sydney cbd": "sydney",
  "the rocks": "sydney",
  wolli_creek: "sydney",
  "wolli creek": "sydney",

  bulli: "wollongong",
  "north wollongong": "wollongong",
  wollongong: "wollongong",

  gosford: "central_coast",
  "point claire": "central_coast",
  woy_woy: "central_coast",
  "woy woy": "central_coast",

  wickham: "newcastle",
};

const STATE_WORDS = new Set([
  "australia",
  "new south wales",
  "nsw",
  "victoria",
  "vic",
  "queensland",
  "qld",
  "south australia",
  "sa",
  "western australia",
  "wa",
  "tasmania",
  "tas",
  "act",
]);

function humanize(value: string): string {
  return value
    .replace(/\bNSW\b/gi, "")
    .replace(/\bVIC\b/gi, "")
    .replace(/\bQLD\b/gi, "")
    .replace(/\bSA\b/gi, "")
    .replace(/\bWA\b/gi, "")
    .replace(/\bTAS\b/gi, "")
    .replace(/\bACT\b/gi, "")
    .replace(/\b\d{4}\b/g, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function localityCandidates(locality: string | null | undefined, address: string | null | undefined): string[] {
  const candidates: string[] = [];
  if (locality) candidates.push(locality);
  if (address) {
    candidates.push(
      ...address
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean),
    );
  }
  return candidates
    .map(humanize)
    .filter((value) => value && !STATE_WORDS.has(value.toLowerCase()));
}

function cityForSuburb(suburb: string | null): string | null {
  if (!suburb) return null;
  const normalized = suburb.toLowerCase();
  return SUBURB_TO_CITY[normalized] ?? SUBURB_TO_CITY[toDbSlug(normalized)] ?? null;
}

export function normalizeEventLocation(
  locality: string | null | undefined,
  address: string | null | undefined,
  fallbackCity: string | null | undefined,
): NormalizedEventLocation {
  const candidates = localityCandidates(locality, address);
  const suburb = candidates[0] ?? null;
  const mappedCity = cityForSuburb(suburb);
  const fallbackCitySlug = cityNameToDbSlug(fallbackCity);

  return {
    suburb,
    city: mappedCity ?? fallbackCitySlug ?? cityNameToDbSlug(suburb),
  };
}
