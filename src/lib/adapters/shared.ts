import { toDbSlug } from "@/lib/constants";

export function parseIntegrationConfig(config: string | null): Record<string, unknown> {
  if (!config) return {};
  try {
    const parsed = JSON.parse(config);
    return parsed && typeof parsed === "object" ? parsed as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

export function cityNameToDbSlug(city: string | null | undefined): string | null {
  const normalized = (city ?? "").trim().toLowerCase();
  if (!normalized) return null;
  const known: Record<string, string> = {
    sydney: "sydney",
    melbourne: "melbourne",
    brisbane: "brisbane",
    perth: "perth",
    adelaide: "adelaide",
    "gold coast": "gold_coast",
    canberra: "canberra",
    hobart: "hobart",
    newcastle: "newcastle",
    "sunshine coast": "sunshine_coast",
  };
  if (known[normalized]) return known[normalized];
  const slug = toDbSlug(normalized.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  return slug || null;
}

export function numberToIso(value: unknown): string | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return new Date(value).toISOString();
}
