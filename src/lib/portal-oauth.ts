import { headers } from "next/headers";
import { SITE_URL } from "@/lib/seo";

const EVENTBRITE_CALLBACK_PATH = "/portal/connect/eventbrite/callback";

export async function portalOriginFromHeaders(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return SITE_URL;

  const normalizedHost = host.toLowerCase();
  if (normalizedHost === "events4singles.com" || normalizedHost === "www.events4singles.com") {
    return SITE_URL;
  }

  const proto = h.get("x-forwarded-proto") ?? (normalizedHost.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function eventbriteRedirectUri(): Promise<string> {
  return `${await portalOriginFromHeaders()}${EVENTBRITE_CALLBACK_PATH}`;
}
