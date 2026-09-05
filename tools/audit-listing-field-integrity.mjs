import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "tmp", "db-audits");
mkdirSync(outDir, { recursive: true });

function latestDumpPath() {
  const files = readdirSync(outDir)
    .filter((name) => /^events4singles-prod.*\.sql$/i.test(name))
    .map((name) => ({ name, fullPath: path.join(outDir, name) }))
    .sort((a, b) => b.name.localeCompare(a.name));
  if (!files.length) throw new Error(`No production SQL dump found in ${outDir}.`);
  return files[0].fullPath;
}

function parseSqlValues(valuesSql) {
  const values = [];
  let current = "";
  let inString = false;
  for (let i = 0; i < valuesSql.length; i += 1) {
    const char = valuesSql[i];
    const next = valuesSql[i + 1];
    if (inString) {
      if (char === "'" && next === "'") {
        current += "'";
        i += 1;
      } else if (char === "'") {
        inString = false;
      } else {
        current += char;
      }
      continue;
    }
    if (char === "'") {
      inString = true;
      continue;
    }
    if (char === ",") {
      values.push(coerceSqlValue(current));
      current = "";
      continue;
    }
    current += char;
  }
  values.push(coerceSqlValue(current));
  return values;
}

function coerceSqlValue(value) {
  const trimmed = value.trim();
  if (/^null$/i.test(trimmed)) return null;
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return trimmed;
}

function loadDumpTables(dumpPath, wantedTables) {
  const tables = Object.fromEntries(wantedTables.map((table) => [table, []]));
  const sql = readFileSync(dumpPath, "utf8");
  const insertPattern = /^INSERT INTO "([^"]+)" \(([^)]+)\) VALUES\((.*)\);$/;
  for (const line of sql.split(/\r?\n/)) {
    const match = line.match(insertPattern);
    if (!match) continue;
    const [, table, columnsSql, valuesSql] = match;
    if (!wantedTables.includes(table)) continue;
    const columns = columnsSql.split(",").map((column) => column.replace(/"/g, ""));
    const values = parseSqlValues(valuesSql);
    const row = {};
    columns.forEach((column, index) => {
      row[column] = values[index] ?? null;
    });
    tables[table].push(row);
  }
  return tables;
}

function clean(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function compact(value) {
  return clean(value).toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim();
}

function compactJoined(value) {
  return compact(value).replace(/\s+/g, "");
}

function words(value) {
  return compact(value).split(/\s+/).filter(Boolean);
}

function titleCase(value) {
  return clean(value)
    .toLowerCase()
    .replace(/\b[a-z]/g, (char) => char.toUpperCase())
    .replace(/\bNsw\b/g, "NSW")
    .replace(/\bVic\b/g, "VIC")
    .replace(/\bQld\b/g, "QLD")
    .replace(/\bSa\b/g, "SA")
    .replace(/\bWa\b/g, "WA")
    .replace(/\bAct\b/g, "ACT")
    .replace(/\bNt\b/g, "NT");
}

function normalizedDomain(value) {
  const raw = clean(value).split(/[|,;\s]+/).find((part) => /\.[a-z]{2,}/i.test(part)) ?? "";
  if (!raw) return "";
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    return url.hostname.toLowerCase().replace(/^www\./, "").replace(/\.(com|net|org)\.au$/, "").replace(/\.(com|net|org)$/, "");
  } catch {
    return raw.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split(/[/?#]/)[0].replace(/\.(com|net|org)\.au$/, "").replace(/\.(com|net|org)$/, "");
  }
}

function normalizedPhone(value) {
  const digits = clean(value).replace(/\D+/g, "");
  return digits.length >= 8 ? digits.replace(/^0+/, "") : "";
}

const args = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  if (process.argv[i].startsWith("--")) args.set(process.argv[i], process.argv[i + 1] ?? true);
}

const dumpPath = args.get("--dump") ? path.resolve(root, args.get("--dump")) : latestDumpPath();
const { businesses, listings, listing_placements: placements, cities, categories } = loadDumpTables(dumpPath, [
  "businesses",
  "listings",
  "listing_placements",
  "cities",
  "categories",
]);

const businessById = new Map(businesses.map((business) => [Number(business.id), business]));
const categoriesBySlug = new Map(categories.map((category) => [clean(category.slug), category]));
const citiesBySlug = new Map(cities.map((city) => [clean(city.slug), city]));
const placementsByListing = new Map();
for (const placement of placements) {
  const id = Number(placement.listing_id);
  if (!placementsByListing.has(id)) placementsByListing.set(id, []);
  placementsByListing.get(id).push(placement);
}

const cityAliases = new Map();
for (const city of cities) {
  if (["online", "national", "international", "tbc", "no_location"].includes(clean(city.slug))) continue;
  cityAliases.set(compact(city.label), { city: clean(city.label), state: clean(city.state), slug: clean(city.slug), kind: "city" });
  cityAliases.set(compact(city.slug), { city: clean(city.label), state: clean(city.state), slug: clean(city.slug), kind: "city" });
}

const localityHints = new Map([
  ["adelaide", { location: "Adelaide", city: "Adelaide", state: "SA", confidence: "high" }],
  ["australia wide", { location: "Australia wide", city: "National", state: "", confidence: "review" }],
  ["brisbane", { location: "Brisbane", city: "Brisbane", state: "QLD", confidence: "high" }],
  ["lane cove", { location: "Lane Cove", city: "Sydney", state: "NSW", confidence: "high" }],
  ["clare valley", { location: "Clare Valley", city: "No Location Review", state: "SA", confidence: "review" }],
  ["fitzroy", { location: "Fitzroy", city: "Melbourne", state: "VIC", confidence: "high" }],
  ["france", { location: "France", city: "International", state: "", confidence: "review" }],
  ["hobart", { location: "Hobart", city: "Hobart", state: "TAS", confidence: "high" }],
  ["murwillumbah", { location: "Murwillumbah", city: "Byron Bay", state: "NSW", confidence: "review" }],
  ["via murwillumbah", { location: "Via Murwillumbah", city: "Byron Bay", state: "NSW", confidence: "review" }],
  ["hornsby", { location: "Hornsby", city: "Sydney", state: "NSW", confidence: "high" }],
  ["kingaroy", { location: "Kingaroy", city: "Brisbane", state: "QLD", confidence: "review" }],
  ["castle hill", { location: "Castle Hill", city: "Sydney", state: "NSW", confidence: "high" }],
  ["la rochelle", { location: "La Rochelle", city: "International", state: "", confidence: "review" }],
  ["penrith", { location: "Penrith", city: "Sydney", state: "NSW", confidence: "high" }],
  ["liverpool", { location: "Liverpool", city: "Sydney", state: "NSW", confidence: "high" }],
  ["new zealand", { location: "New Zealand", city: "International", state: "", confidence: "review" }],
  ["newcastle", { location: "Newcastle", city: "Newcastle", state: "NSW", confidence: "high" }],
  ["noosa", { location: "Noosa", city: "Sunshine Coast", state: "QLD", confidence: "review" }],
  ["noosaville", { location: "Noosaville", city: "Sunshine Coast", state: "QLD", confidence: "review" }],
  ["surry hills", { location: "Surry Hills", city: "Sydney", state: "NSW", confidence: "high" }],
  ["leichhardt", { location: "Leichhardt", city: "Sydney", state: "NSW", confidence: "high" }],
  ["kenthurst", { location: "Kenthurst", city: "Sydney", state: "NSW", confidence: "high" }],
  ["nerang", { location: "Nerang", city: "Gold Coast", state: "QLD", confidence: "high" }],
  ["southport", { location: "Southport", city: "Gold Coast", state: "QLD", confidence: "high" }],
  ["abbotsford", { location: "Abbotsford", city: "Melbourne", state: "VIC", confidence: "high" }],
  ["parramatta", { location: "Parramatta", city: "Sydney", state: "NSW", confidence: "high" }],
  ["campbelltown", { location: "Campbelltown", city: "Sydney", state: "NSW", confidence: "high" }],
  ["point lookout", { location: "Point Lookout", city: "Brisbane", state: "QLD", confidence: "review" }],
]);

const serviceSuffixes = [
  "upscale dating agency & matchmaking service",
  "dating agency & matchmaking service",
  "matchmaking service",
  "marketing services",
  "image consultancy",
  "dating services directory",
  "photography for online profiles",
  "free dating site and forum",
  "australia and overseas tours",
];

const headingLike = new Set([
  "entertainment and night clubs",
  "christian",
  "dating",
  "dr",
  "online internet",
  "newcastle",
  "queensland",
  "sa adelaide and country areas",
  "sydney and nsw",
  "events4singles retreats4singles",
]);

const regionalLocationFragments = [
  "north coast",
  "south coast",
  "sth coast",
  "provence france",
  "france sth coast",
  "new south wales",
  "nsw",
  "qld",
  "queensland",
  "victoria",
  "tasmania",
];

const callToActionFragments = [
  "join now",
  "book now",
  "click here",
  "check website",
  "register now",
];

const oldEventWords = [
  "festival",
  "tour",
  "event",
  "workshop",
  "seminar",
  "cruise",
];

const categoryLabels = new Set();
for (const category of categories) {
  categoryLabels.add(compact(category.label));
  categoryLabels.add(compact(category.slug));
}

function findLocationInText(value) {
  const text = compact(value);
  const hits = [];
  for (const [alias, detail] of localityHints) {
    if (text.includes(alias)) hits.push({ alias, ...detail });
  }
  for (const [alias, detail] of cityAliases) {
    if (alias && text.includes(alias)) hits.push({ alias, location: detail.city, city: detail.city, state: detail.state, confidence: "high" });
  }
  const unique = new Map();
  for (const hit of hits) unique.set(`${hit.location}|${hit.city}|${hit.state}`, hit);
  return [...unique.values()];
}

function splitDashFragment(title) {
  const match = clean(title).match(/^(.+?)\s+[-–]\s+(.+)$/);
  if (!match) return null;
  return { base: clean(match[1]), fragment: clean(match[2]) };
}

function splitColonFragment(title) {
  const match = clean(title).match(/^(.+?):\s+(.+)$/);
  if (!match) return null;
  return { base: clean(match[1]), fragment: clean(match[2]) };
}

function splitSlashFragment(title) {
  const match = clean(title).match(/^(.+?)\s+\/\s+(.+)$/);
  if (!match) return null;
  return { base: clean(match[1]), fragment: clean(match[2]) };
}

function splitEllipsisFragment(title) {
  const parts = clean(title).split(/\s*(?:\.{2,}|…)\s*/).map(clean).filter(Boolean);
  if (parts.length < 2) return null;
  return { base: parts[0], fragment: parts.slice(1).join(", ") };
}

function splitPresentsFragment(title) {
  const match = clean(title).match(/^(.+?)\s+presents\s+(.+)$/i);
  if (!match) return null;
  return { presenter: clean(match[1]), presented: clean(match[2]) };
}

function splitIsDescription(title) {
  const match = clean(title).match(/^(.+?)\s+is\s+(.+)$/i);
  if (!match) return null;
  return { base: clean(match[1]), fragment: clean(match[2]) };
}

function trailingYear(title) {
  const match = clean(title).match(/^(.+?)\s+(19|20)\d{2}$/);
  if (!match) return null;
  const year = clean(title).match(/(19|20)\d{2}$/)?.[0] ?? "";
  return { base: clean(match[1]), year };
}

function leadingLocationTitle(title) {
  const normalized = clean(title)
    .replace(/\bQld\b\.?/gi, "QLD")
    .replace(/\bNsw\b\.?/gi, "NSW")
    .replace(/\bAust\b\.?/gi, "Australia");
  const match = normalized.match(/^([A-Za-z][A-Za-z\s.'-]+?)\s+(?:QLD|NSW|VIC|SA|WA|TAS|Australia|Aust\.?)+(?:[,\s.]*)\s+(.+)$/i);
  if (!match) return null;
  const locationHits = findLocationInText(match[1]);
  if (!locationHits.length) return null;
  return { base: clean(match[2]), location: locationHits[0] };
}

function hasMissingInternalSpace(title) {
  return /\b(?:with|the|better|Coast|Jazz|House)[A-Z][a-z]/.test(clean(title));
}

function oldYearEvidence(row) {
  const titleAndTagline = `${clean(row.title)} ${clean(row.tagline)}`;
  const description = clean(row.description);
  const datedText = [
    titleAndTagline,
    ...[...description.matchAll(/\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december|tour|festival|event)\b.{0,80}\b(20[01]\d|200\d)\b/gi)].map((match) => match[0]),
  ].join(" ");
  const years = [...datedText.matchAll(/\b(20[01]\d|200\d)\b/g)].map((match) => Number(match[1]));
  if (!years.length) return null;
  const oldest = Math.min(...years);
  const newest = Math.max(...years);
  if (newest > 2019) return null;
  const titleKey = compact(row.title);
  const sourceKey = compact(row.source_file);
  const looksEventLike = oldEventWords.some((word) => titleKey.includes(word) || sourceKey.includes(word));
  return looksEventLike ? { oldest, newest } : null;
}

function suffixService(title) {
  const text = compact(title);
  for (const suffix of [...serviceSuffixes].sort((a, b) => words(b).length - words(a).length)) {
    const suffixKey = compact(suffix);
    if (text.endsWith(suffixKey)) {
      if (/^della corys?/.test(text)) {
        return { title: "Della Cory", tagline: "Upscale Dating Agency & Matchmaking Service" };
      }
      const suffixWords = words(suffix).length;
      const originalWords = clean(title).split(/\s+/);
      const base = clean(originalWords.slice(0, -suffixWords).join(" ")).replace(/['’]$/, "");
      const baseWords = words(base);
      const firstBase = baseWords[0] ?? "";
      if (baseWords.length >= 2 || /s$/.test(firstBase) || /['’]s?$/.test(clean(title).split(/\s+/)[0] ?? "")) {
        return { title: titleCase(base).replace(/\s+S$/, "s"), tagline: titleCase(suffix) };
      }
    }
  }
  return null;
}

function placementSummary(listingId) {
  return (placementsByListing.get(Number(listingId)) ?? [])
    .map((placement) => {
      const category = categoriesBySlug.get(clean(placement.category_slug));
      const city = citiesBySlug.get(clean(placement.city_slug));
      return {
        category_slug: clean(placement.category_slug),
        category: clean(category?.label) || clean(placement.category_slug),
        city_slug: clean(placement.city_slug),
        city: clean(city?.label) || clean(placement.city_slug),
      };
    })
    .sort((a, b) => `${a.category_slug}:${a.city_slug}`.localeCompare(`${b.category_slug}:${b.city_slug}`));
}

function listingEvidence(row, business) {
  return {
    phone: normalizedPhone(row.phone) || normalizedPhone(row.mobile) || normalizedPhone(business?.phone) || normalizedPhone(business?.mobile),
    email: compact(row.email || business?.email),
    domain: normalizedDomain(row.web || business?.website),
    image: clean(row.image_url || business?.logo_url),
  };
}

const activeListings = listings.filter((row) => compact(row.status || "active") === "active");
const issues = [];

function addIssue(row, kind, severity, message, proposal = {}) {
  const business = businessById.get(Number(row.business_id));
  issues.push({
    id: Number(row.id),
    business_id: Number(row.business_id),
    kind,
    severity,
    title: clean(row.title),
    business_name: clean(business?.name),
    tagline: clean(row.tagline),
    location: clean(row.location),
    location_city: clean(row.location_city),
    location_state: clean(row.location_state),
    listing_type: clean(row.listing_type),
    web: clean(row.web),
    business_website: clean(business?.website),
    placements: placementSummary(row.id),
    message,
    proposal,
  });
}

for (const row of activeListings) {
  const business = businessById.get(Number(row.business_id));
  const title = clean(row.title);
  const titleKey = compact(title);
  const businessNameKey = compact(business?.name);
  const dash = splitDashFragment(title);
  const colon = splitColonFragment(title);
  const slash = splitSlashFragment(title);
  const ellipsis = splitEllipsisFragment(title);
  const presents = splitPresentsFragment(title);
  const isDescription = splitIsDescription(title);
  const year = trailingYear(title);
  const leadingLocation = leadingLocationTitle(title);
  const oldEvent = oldYearEvidence(row);
  const titleLocations = findLocationInText(title);
  const descriptionLocations = findLocationInText(row.description);
  const evidence = listingEvidence(row, business);
  const titleDomainMismatch =
    evidence.domain &&
    words(title).length <= 4 &&
    !compact(evidence.domain).includes(words(titleKey)[0] ?? "") &&
    !titleKey.includes(compact(evidence.domain));
  const titleIsCategory = categoryLabels.has(titleKey);
  const descriptionKey = compact(row.description);
  const domainKey = compactJoined(evidence.domain);
  const titleMatchesDomain = domainKey && domainKey.includes(compactJoined(titleKey));
  const titleLikelyCategoryPage =
    titleIsCategory &&
    (/^events4singles lists\b/.test(descriptionKey) ||
      /^this page directs you\b/.test(descriptionKey) ||
      (!titleMatchesDomain && !descriptionKey.includes(titleKey)));
  const titleMissingDomainQualifier =
    titleIsCategory &&
    titleMatchesDomain &&
    domainKey.length > compactJoined(titleKey).length + 2 &&
    findLocationInText(domainKey).length;

  if (headingLike.has(titleKey) || titleLikelyCategoryPage) {
    addIssue(row, "heading_or_category_scraped_as_listing", "critical", "Title looks like a page heading/category label rather than a business listing.", {
      action: "review_archive_or_rename",
      linked_domain: evidence.domain,
    });
  }

  if (titleMissingDomainQualifier) {
    addIssue(row, "title_missing_location_qualifier", "fixable", "Title matches a category, but domain/body evidence points to a qualified business name.", {
      title: titleCase(evidence.domain.replace(/\.(com|net|org)(\.au)?$/i, "").replace(/([a-z])([A-Z])/g, "$1 $2")),
      linked_domain: evidence.domain,
    });
  }

  if (/[-:;,]\s*$/.test(title)) {
    addIssue(row, "title_has_trailing_punctuation", "fixable", "Title ends with stray punctuation.", {
      title: title.replace(/[-:;,]\s*$/, "").trim(),
    });
  }

  if (hasMissingInternalSpace(title)) {
    addIssue(row, "title_has_missing_internal_space", "fixable", "Title appears to have words joined together by scrape damage.", {
      action: "review_or_fix_spacing",
    });
  }

  const cta = callToActionFragments.find((fragment) => titleKey.includes(fragment));
  if (cta) {
    addIssue(row, "title_contains_call_to_action", "fixable", "Title contains call-to-action copy that belongs in tagline or body text.", {
      action: "remove_from_title",
      fragment: cta,
    });
  }

  if (oldEvent) {
    addIssue(row, "old_dated_event_or_tour", "critical", "Listing has old event/tour date evidence and should not be active launch content without a current rewrite.", {
      action: "archive_or_rewrite_current",
      oldest_year: oldEvent.oldest,
      newest_year: oldEvent.newest,
    });
  }

  if (dash) {
    const fragmentLocations = findLocationInText(dash.fragment);
    const baseLocations = findLocationInText(dash.base);
    if (baseLocations.length && regionalLocationFragments.some((fragment) => compact(dash.fragment).includes(compact(fragment)))) {
      const best = baseLocations[0];
      addIssue(row, "title_is_location_only", "critical", "Dash title looks like a location/region label, not a listing name.", {
        action: "review_archive_or_rename",
        location: best.location,
        location_city: best.city,
        location_state: best.state,
        region_fragment: dash.fragment,
      });
    } else if (fragmentLocations.length) {
      const best = fragmentLocations[0];
      addIssue(row, "title_contains_location", best.confidence === "high" ? "fixable" : "review", "Dash/comma title fragment looks like location detail.", {
        title: dash.base,
        location: best.location,
        location_city: best.city,
        location_state: best.state,
      });
    } else if (/\b(?:premier|upscale|dating|matchmaking|service|services|consultancy|check website|social|dinner|dance|tour|club)\b/i.test(dash.fragment)) {
      addIssue(row, "title_contains_tagline", "fixable", "Dash title fragment looks like service/tagline text.", {
        title: dash.base,
        tagline: dash.fragment,
      });
    }
  }

  if (colon && /\b(?:free|dating|site|forum|service|club|tour|tours|classes|agency|directory|profiles?)\b/i.test(colon.fragment)) {
    addIssue(row, "title_contains_colon_tagline", "fixable", "Colon title fragment looks like tagline/service wording.", {
      title: colon.base,
      tagline: colon.fragment,
    });
  }

  if (slash) {
    const fragmentLocations = findLocationInText(slash.fragment);
    if (fragmentLocations.length || /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2}$/.test(slash.fragment)) {
      addIssue(row, "title_contains_slash_fragment", "fixable", "Slash title fragment looks like a contact name or location detail.", {
        title: slash.base,
        contact_or_location: slash.fragment,
      });
    }
  }

  if (ellipsis) {
    addIssue(row, "title_contains_body_bleed", "fixable", "Title contains ellipsis-separated marketing fragments that belong in tagline/content.", {
      title: ellipsis.base,
      tagline: ellipsis.fragment,
    });
  }

  if (presents) {
    addIssue(row, "title_contains_presenter", "fixable", "Title combines a presenting business with the listed product/event.", {
      title: presents.presented,
      business_name: presents.presenter,
      tagline: `${presents.presenter} presents`,
    });
  }

  if (isDescription && /\b(?:leading|premier|fastest|growing|social|club|service|professional|single|people)\b/i.test(isDescription.fragment)) {
    addIssue(row, "title_contains_sentence_description", "fixable", "Title reads like the start of a description rather than a name.", {
      title: isDescription.base,
      tagline: isDescription.fragment,
    });
  }

  if (year) {
    addIssue(row, "title_contains_year", "review", "Title ends with a year/date marker that likely belongs in event metadata or tagline.", {
      title: year.base,
      date_or_tagline: year.year,
    });
  }

  if (leadingLocation) {
    addIssue(row, "title_starts_with_location", "review", "Title appears to start with location/state text before the actual name.", {
      title: leadingLocation.base,
      location: leadingLocation.location.location,
      location_city: leadingLocation.location.city,
      location_state: leadingLocation.location.state,
    });
  }

  const service = suffixService(title);
  if (service && !clean(row.tagline)) {
    addIssue(row, "title_contains_service_tagline", "fixable", "Title appears to combine business name with service/category wording.", service);
  }

  if (titleLocations.length && !dash) {
    const locationNames = titleLocations.map((hit) => hit.location).join(", ");
    if (/\b(?:based|via|metro|areas|wide|national|international)\b/i.test(title) || titleLocations.length > 1) {
      addIssue(row, "title_contains_embedded_location", "review", `Title embeds location wording: ${locationNames}.`, {
        suggested_locations: titleLocations,
      });
    }
  }

  const broadLocation = /^(national|international)$/i.test(clean(row.location_city)) || /^(national|international)$/i.test(clean(row.location));
  if (descriptionLocations.length && !broadLocation && !findLocationInText(`${row.location} ${row.location_city}`).length) {
    addIssue(row, "description_mentions_location_missing_from_fields", "review", "Description mentions location detail that is not represented in listing location fields.", {
      suggested_locations: descriptionLocations,
    });
  }

  if (/@/.test(clean(row.description)) && !clean(row.email)) {
    const match = clean(row.description).match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
    addIssue(row, "email_in_description", "fixable", "Description contains an email but email field is empty.", {
      email: match?.[0] ?? "",
    });
  }

  if (/(?:\+?61|0)[\d\s().-]{7,}/.test(clean(row.description)) && !(clean(row.phone) || clean(row.mobile))) {
    const match = clean(row.description).match(/(?:\+?61|0)[\d\s().-]{7,}/);
    addIssue(row, "phone_in_description", "fixable", "Description contains a phone-like value but phone/mobile fields are empty.", {
      phone: clean(match?.[0]),
    });
  }

  if (businessNameKey === titleKey && (headingLike.has(titleKey) || categoryLabels.has(titleKey)) && titleDomainMismatch) {
    addIssue(row, "business_name_domain_mismatch", "critical", "Business name also looks like a heading, while website/contact evidence points to another entity.", {
      linked_domain: evidence.domain,
    });
  }
}

const evidenceGroups = new Map();
for (const row of activeListings) {
  const business = businessById.get(Number(row.business_id));
  const evidence = listingEvidence(row, business);
  for (const [kind, value] of Object.entries(evidence)) {
    if (!value) continue;
    const key = `${kind}:${value}`;
    if (!evidenceGroups.has(key)) evidenceGroups.set(key, []);
    evidenceGroups.get(key).push(row);
  }
}

const crossLinked = [];
for (const [key, rows] of evidenceGroups) {
  if (rows.length < 2) continue;
  const titles = new Set(rows.map((row) => compact(row.title)));
  if (titles.size < 2) continue;
  crossLinked.push({
    evidence: key,
    count: rows.length,
    entries: rows.map((row) => {
      const business = businessById.get(Number(row.business_id));
      return {
        id: Number(row.id),
        business_id: Number(row.business_id),
        title: clean(row.title),
        business_name: clean(business?.name),
        status: clean(row.status),
        placements: placementSummary(row.id),
      };
    }),
  });
}

const byKind = {};
const bySeverity = {};
for (const issue of issues) {
  byKind[issue.kind] = (byKind[issue.kind] ?? 0) + 1;
  bySeverity[issue.severity] = (bySeverity[issue.severity] ?? 0) + 1;
}

const report = {
  generated_at: new Date().toISOString(),
  dump_path: dumpPath,
  counts: {
    active_listings: activeListings.length,
    issues: issues.length,
    critical: bySeverity.critical ?? 0,
    fixable: bySeverity.fixable ?? 0,
    review: bySeverity.review ?? 0,
    cross_linked_evidence_groups: crossLinked.length,
  },
  by_kind: byKind,
  issues: issues.sort((a, b) => {
    const severityRank = { critical: 0, fixable: 1, review: 2 };
    return severityRank[a.severity] - severityRank[b.severity] || a.id - b.id;
  }),
  cross_linked_evidence_groups: crossLinked.sort((a, b) => b.count - a.count || a.evidence.localeCompare(b.evidence)),
};

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const jsonPath = path.join(outDir, `listing-field-integrity-audit-${stamp}.json`);
writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report.counts, null, 2));
console.log(`JSON report: ${jsonPath}`);
