import type { Category, City } from "./types";

function plural(count: number, singular: string, pluralValue = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : pluralValue}`;
}

export function cityIntroCopy(city: City, listingCount: number, categoryCount: number) {
  return {
    lead: `${city.label} singles can browse local events, dating services, dinner groups, dance classes, social clubs and relationship-focused services in one place.`,
    detail: `Use this page to compare the local options, see which organisers feel like the right fit, and follow through to events or services that match your pace, interests and social comfort zone.`,
    support: `There are ${plural(listingCount, "listing")} across ${plural(categoryCount, "category", "categories")}, with business details, links and contact pathways brought together for easier browsing.`,
  };
}

export function categoryIntroCopy(category: Category, cityCount: number, listingCount: number) {
  const label = category.label.toLowerCase();
  return {
    lead: `Explore ${label} listings for singles across Australia, from established organisers and specialist services through to local hosts, clubs and activity providers.`,
    detail: `Use this page to compare the available options, see which businesses feel like the right fit, and follow through to events or services that match your pace, interests and social comfort zone.`,
    support: `There are ${plural(listingCount, "listing")} mapped to this category across ${plural(cityCount, "city", "cities")}, with business details, links and contact pathways brought together for easier browsing.`,
  };
}

export function categoryCityIntroCopy(category: Category, city: City, listingCount: number) {
  const label = category.label.toLowerCase();
  return {
    lead: `Find ${label} options for singles in ${city.label}, from established organisers and specialist services through to local hosts, clubs and activity providers.`,
    detail: `Use this page to compare the local options, see which businesses feel like the right fit, and follow through to events or services that match your pace, interests and social comfort zone.`,
    support: `There are ${plural(listingCount, "listing")} currently in this section, with business details, links and contact pathways brought together for easier browsing.`,
  };
}

export function cityHeroSubtext(city: City) {
  return `Local singles events and services in ${city.label}`;
}

export function categoryHeroSubtext(category: Category) {
  return `${category.label} listings for singles`;
}

export function categoryCityHeroSubtext(category: Category, city: City) {
  return `${category.label} options around ${city.label}`;
}

export function citySeoFooterCopy(city: City, categoryCount: number) {
  return {
    heading: `How to Use Events4Singles in ${city.label}`,
    body: `Events4Singles brings together local singles events, dating services and social activities in ${city.label} so visitors can compare options without jumping between organisers. Start with the category filters if you already know the kind of experience you want, or browse the full city page when you are open to speed dating, dinner groups, dance classes, social clubs, travel and personal development services.`,
    support: `Listings and advertisers may change over time, but this page remains the main Events4Singles guide for finding singles-friendly options in ${city.label}. There ${categoryCount === 1 ? "is" : "are"} currently ${categoryCount} ${categoryCount === 1 ? "category" : "categories"} represented for this location.`,
  };
}

export function categorySeoFooterCopy(category: Category, cityCount: number) {
  const label = category.label.toLowerCase();
  return {
    heading: `Finding ${category.label} for Singles`,
    body: `This category page is designed as a stable guide to ${label} options for singles across Australia. Use it to compare organisers, see which cities are active, and move into a local page when you want listings that are closer to home.`,
    support: `Advertisers can change as new organisers join or update their listings, but the purpose of this page stays the same: helping Australian singles find relevant ${label} events, services and social opportunities. There ${cityCount === 1 ? "is" : "are"} currently ${cityCount} ${cityCount === 1 ? "city" : "cities"} represented in this category.`,
  };
}

export function categoryCitySeoFooterCopy(category: Category, city: City, listingCount: number) {
  const label = category.label.toLowerCase();
  return {
    heading: `${category.label} in ${city.label}: What to Look For`,
    body: `Use this page when you want ${label} options that are specifically relevant to singles in ${city.label}. Check the listing details, contact pathways, websites and locations, then confirm dates, pricing and availability directly with the organiser before you book.`,
    support: `The businesses shown here may change as advertisers update their listings, but this page remains the local Events4Singles guide for ${label} in ${city.label}. There ${listingCount === 1 ? "is" : "are"} currently ${listingCount} ${listingCount === 1 ? "listing" : "listings"} in this section.`,
  };
}
