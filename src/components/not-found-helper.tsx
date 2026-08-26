"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Suggestion = {
  href: string;
  label: string;
  reason: string;
};

const FALLBACK_SUGGESTIONS: Suggestion[] = [
  { href: "/cities", label: "Browse all cities", reason: "City directory" },
  { href: "/categories", label: "Browse all categories", reason: "Category directory" },
  { href: "/events", label: "Upcoming events", reason: "Current event calendar" },
];

const RECOVERY_LINKS = [
  { href: "/cities", label: "Cities" },
  { href: "/categories", label: "Categories" },
  { href: "/events", label: "Events" },
  { href: "/businesses", label: "Businesses" },
  { href: "/contact", label: "Contact" },
];

function isSuggestionResponse(value: unknown): value is { suggestions: Suggestion[] } {
  return Boolean(
    value &&
      typeof value === "object" &&
      "suggestions" in value &&
      Array.isArray((value as { suggestions?: unknown }).suggestions)
  );
}

export default function NotFoundHelper() {
  const path = usePathname();
  const [suggestions, setSuggestions] = useState<Suggestion[]>(FALLBACK_SUGGESTIONS);

  useEffect(() => {
    const currentPath = path || window.location.pathname;

    fetch("/api/not-found", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: currentPath,
        referrer: document.referrer || null,
      }),
      keepalive: true,
    })
      .then((res) => res.ok ? res.json() : null)
      .then((data: unknown) => {
        if (isSuggestionResponse(data) && data.suggestions.length) setSuggestions(data.suggestions);
      })
      .catch(() => {});
  }, [path]);

  return (
    <section className="e4s-not-found" aria-labelledby="e4s-not-found-title">
      <div className="e4s-shell e4s-not-found__inner">
        <p className="e4s-not-found__code">404</p>
        <h1 id="e4s-not-found-title">This page is no longer available</h1>
        <p>
          Page names, categories and listings may have changed while Events4Singles has been refreshed.
          The missed address has been logged so we can add a redirect if people keep landing here.
        </p>
        {path && (
          <p className="e4s-not-found__path">
            You landed on <code>{path}</code>
          </p>
        )}
        <div className="e4s-not-found__suggestions" aria-label="Suggested pages">
          {suggestions.map((suggestion) => (
            <Link key={suggestion.href} href={suggestion.href}>
              <span>{suggestion.reason}</span>
              <strong>{suggestion.label}</strong>
            </Link>
          ))}
        </div>
        <div className="e4s-not-found__recovery" aria-label="Browse Events4Singles">
          <span>Browse instead</span>
          <div>
            {RECOVERY_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>{link.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
