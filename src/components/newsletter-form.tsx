"use client";
import { useState, useEffect } from "react";
import Script from "next/script";

const CITIES = [
  "Adelaide", "Brisbane", "Byron Bay", "Cairns", "Canberra",
  "Central Coast", "Darwin", "Geelong", "Gold Coast", "Hobart",
  "Melbourne", "Newcastle", "Perth", "Sunshine Coast", "Sydney",
  "Toowoomba", "Wollongong",
];

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

declare global {
  interface Window { __onTurnstile?: (t: string) => void; __onTurnstileExpire?: () => void; }
}

export default function NewsletterForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [cfToken, setCfToken] = useState("");
  const [formState, setFormState] = useState<"idle" | "loading" | "done" | "error">("idle");

  useEffect(() => {
    window.__onTurnstile = (t) => setCfToken(t);
    window.__onTurnstileExpire = () => setCfToken("");
    return () => { delete window.__onTurnstile; delete window.__onTurnstileExpire; };
  }, []);

  if (formState === "done") {
    return (
      <p className="e4s-home-newsletter__success">
        Thanks{firstName ? ` ${firstName}` : ""}! We&apos;ll keep you posted on events in {city || "your city"}.
      </p>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, city, cfToken, website: "" }),
      });
      setFormState(res.ok ? "done" : "error");
    } catch {
      setFormState("error");
    }
  }

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      <form className="e4s-home-newsletter__form" onSubmit={handleSubmit}>
        {/* Honeypot — must stay hidden and empty */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          aria-hidden="true"
          className="e4s-honeypot"
          defaultValue=""
          autoComplete="off"
        />
        {formState === "error" && (
          <p className="e4s-home-newsletter__error">Something went wrong — please try again.</p>
        )}
        <div className="e4s-home-newsletter__form-row">
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={formState === "loading"}
          />
          <select value={city} onChange={(e) => setCity(e.target.value)} disabled={formState === "loading"}>
            <option value="">Select city</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <input
          type="email"
          placeholder="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={formState === "loading"}
        />
        <div
          className="cf-turnstile"
          data-sitekey={SITE_KEY}
          data-size="invisible"
          data-callback="__onTurnstile"
          data-expired-callback="__onTurnstileExpire"
        />
        <button type="submit" disabled={formState === "loading"}>
          {formState === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </form>
    </>
  );
}
