import type { Metadata } from "next";

export const SITE_NAME = "Events4Singles";
export const SITE_URL = "https://events4singles.com";
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

export function cleanTitle(value: string, fallback = SITE_NAME): string {
  const text = (value || fallback).replace(/\s+/g, " ").trim();
  return text.length > 62 ? `${text.slice(0, 59).trim()}...` : text;
}

export function canonicalPath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${canonicalPath(path)}`;
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
  const pageTitle = cleanTitle(title);
  const clean = cleanDescription(description);
  const url = path ? canonicalPath(path) : "/";
  return {
    title: pageTitle,
    description: clean,
    keywords: [...DEFAULT_KEYWORDS, ...keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: pageTitle,
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
      card: "summary_large_image",
      title: pageTitle,
      description: clean,
      images: [image],
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function collectionPageJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description: cleanDescription(description),
    url: absoluteUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
