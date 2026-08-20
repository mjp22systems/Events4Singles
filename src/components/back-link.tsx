"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { slugToLabel } from "@/lib/constants";

const SKIP_ROOTS = new Set(["listing", "profile", "advice", "dating-resources", "about", "contact", "advertise", "portal", "terms", "privacy", "events"]);

function parseStoredPath(path: string): { href: string; label: string } | null {
  try {
    const parts = path.replace(/\/$/, "").split("/").filter(Boolean);
    if (parts.length === 0 || SKIP_ROOTS.has(parts[0])) return null;
    if (parts.length === 1) return { href: path, label: slugToLabel(parts[0]) };
    if (parts.length === 2) return { href: path, label: `${slugToLabel(parts[0])} - ${slugToLabel(parts[1])}` };
    return null;
  } catch {
    return null;
  }
}

export default function BackLink() {
  const [back, setBack] = useState<{ href: string; label: string } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("e4s_prev_path");
    if (stored) setBack(parseStoredPath(stored));
  }, []);

  if (!back) return null;

  return (
    <Link
      href={back.href}
      className="e4s-listing-detail__back-link"
      onClick={() => sessionStorage.setItem("e4s_back_nav", back.href)}
    >
      Back to {back.label}
    </Link>
  );
}
