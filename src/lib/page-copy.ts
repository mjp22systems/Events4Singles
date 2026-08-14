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
