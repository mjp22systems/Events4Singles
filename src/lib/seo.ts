import type { Metadata } from "next";

export const SITE_NAME = "Events4Singles";
export const SITE_URL = "https://www.events4singles.com.au";
export const DEFAULT_DESCRIPTION =
  "Find speed dating, dinner parties, dance classes, social clubs and events for singles across Sydney, Melbourne, Brisbane, Perth, Adelaide and more.";
export const DEFAULT_KEYWORDS = [
  "events for singles",
  "singles events",
  "speed dating",
  "dinner parties",
  "dance classes",
  "social clubs",
  "Australian singles",
];

export function cleanDescription(value: string | null | undefined, fallback = DEFAULT_DESCRIPTION): string {
  const text = (value || fallback).replace(/\s+/g, " ").trim();
  return text.length > 158 ? `${text.slice(0, 155).trim()}...` : text;
}

export function canonicalPath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export function pageMetadata({
  title,
  description,
  path,
  keywords = [],
  image = "/icon.png",
}: {
  title: string;
  description?: string | null;
  path?: string;
  keywords?: string[];
  image?: string;
}): Metadata {
  const clean = cleanDescription(description);
  const url = path ? canonicalPath(path) : "/";
  return {
    title,
    description: clean,
    keywords: [...DEFAULT_KEYWORDS, ...keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: clean,
      url,
      siteName: SITE_NAME,
      locale: "en_AU",
      type: "website",
      images: [
        {
          url: image,
          width: 512,
          height: 512,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description: clean,
      images: [image],
    },
  };
}
