export const CITIES = [
  { id: "sydney", name: "Sydney", state: "NSW" },
  { id: "melbourne", name: "Melbourne", state: "VIC" },
  { id: "brisbane", name: "Brisbane", state: "QLD" },
  { id: "perth", name: "Perth", state: "WA" },
  { id: "adelaide", name: "Adelaide", state: "SA" },
  { id: "gold-coast", name: "Gold Coast", state: "QLD" },
  { id: "canberra", name: "Canberra", state: "ACT" },
] as const;

export const CATEGORIES = [
  { id: "speed-dating", name: "Speed Dating", description: "Fast-paced events to meet multiple singles in one evening" },
  { id: "dinner-parties", name: "Dinner Parties", description: "Relaxed dinner settings for singles to connect over food" },
  { id: "dance-classes", name: "Dance Classes", description: "Social dance lessons and evenings for singles" },
  { id: "social-clubs", name: "Social Clubs", description: "Ongoing groups and clubs for singles to meet regularly" },
  { id: "life-coaches", name: "Life Coaches", description: "Professional coaches specialising in dating and relationships" },
  { id: "adventure", name: "Adventure & Outdoors", description: "Active outdoor events and adventures for singles" },
] as const;

export const TIERS = {
  free: { name: "Free", price: 0, color: "#64748b" },
  starter: { name: "Starter", price: 39, color: "#0d9488" },
  professional: { name: "Professional", price: 99, color: "#7c3aed" },
  premium: { name: "Premium", price: 249, color: "#d97706" },
} as const;

export type CityId = (typeof CITIES)[number]["id"];
export type CategoryId = (typeof CATEGORIES)[number]["id"];
export type Tier = keyof typeof TIERS;

export const CITY_IDS = CITIES.map((c) => c.id) as CityId[];
export const CATEGORY_IDS = CATEGORIES.map((c) => c.id) as CategoryId[];
