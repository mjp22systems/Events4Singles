export type AdvertisingProductId = "free_listing" | "growth_listing" | "event_promoter" | "campaign";

export type AdvertisingProduct = {
  id: AdvertisingProductId;
  name: string;
  price: string;
  cadence: string;
  note: string;
  features: string[];
  cta: string;
  checkoutMode: "free" | "subscription" | "payment";
  stripePriceEnv?: string;
  recommended?: boolean;
};

export const ADVERTISING_PRODUCTS: AdvertisingProduct[] = [
  {
    id: "free_listing",
    name: "Launch Listing",
    price: "$0",
    cadence: "free",
    note: "Be findable before buying visibility.",
    features: ["One standard listing", "One city and one category", "Contact and website details", "Admin approval before live"],
    cta: "Use Free Listing",
    checkoutMode: "free",
  },
  {
    id: "growth_listing",
    name: "Growth Listing",
    price: "$39",
    cadence: "from / month",
    note: "Stand out on the pages that matter.",
    features: ["Featured card treatment", "Extra city/category placements", "Promo field", "Basic analytics"],
    cta: "Choose Growth",
    checkoutMode: "subscription",
    stripePriceEnv: "STRIPE_PRICE_GROWTH_LISTING",
    recommended: true,
  },
  {
    id: "event_promoter",
    name: "Event Promoter",
    price: "$29",
    cadence: "from / event",
    note: "Promote a specific dated event.",
    features: ["What's On calendar placement", "Booking link support", "Event image/poster", "Optional promoted row upgrade"],
    cta: "Promote Event",
    checkoutMode: "payment",
    stripePriceEnv: "STRIPE_PRICE_EVENT_PROMOTER",
  },
  {
    id: "campaign",
    name: "Campaign",
    price: "$149",
    cadence: "from / month",
    note: "Buy visual inventory across selected pages.",
    features: ["Banner or sidebar placement", "Homepage eligibility", "Multi-page scope", "Creative setup workflow"],
    cta: "Start Campaign",
    checkoutMode: "subscription",
    stripePriceEnv: "STRIPE_PRICE_CAMPAIGN",
  },
];

export function getAdvertisingProduct(id: string | null | undefined): AdvertisingProduct | null {
  return ADVERTISING_PRODUCTS.find((product) => product.id === id) ?? null;
}

export function getConfiguredStripePriceId(product: AdvertisingProduct): string | null {
  if (!product.stripePriceEnv) return null;
  return process.env[product.stripePriceEnv]?.trim() || null;
}

