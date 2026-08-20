"use client";
import { useState, useEffect } from "react";
import Script from "next/script";

const INQUIRY_TYPES = [
  { value: "general",     label: "General Enquiry" },
  { value: "advertise",   label: "Advertise / New Listing" },
  { value: "correction",  label: "Listing Correction or Update" },
  { value: "event",       label: "Event Submission" },
  { value: "partnership", label: "Partnership or Media" },
  { value: "feedback",    label: "Feedback or Suggestion" },
  { value: "other",       label: "Other" },
];

const SUBJECT_MAP: Record<string, string> = {
  general:     "General Enquiry",
  advertise:   "Advertising Enquiry",
  correction:  "Listing Correction",
  event:       "Event Submission",
  partnership: "Partnership / Media Enquiry",
  feedback:    "Feedback",
  other:       "Enquiry",
};

const CITIES = [
  "Adelaide", "Brisbane", "Byron Bay", "Cairns", "Canberra",
  "Central Coast", "Darwin", "Geelong", "Gold Coast", "Hobart",
  "Melbourne", "Newcastle", "Perth", "Sunshine Coast", "Sydney",
  "Toowoomba", "Wollongong",
];

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

declare global {
  interface Window {
    __onContactTurnstile?: (t: string) => void;
    __onContactTurnstileExpire?: () => void;
  }
}

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryType, setInquiryType] = useState("");
  const [city, setCity] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [cfToken, setCfToken] = useState("");
  const [formState, setFormState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    window.__onContactTurnstile = (t) => setCfToken(t);
    window.__onContactTurnstileExpire = () => setCfToken("");
    return () => { delete window.__onContactTurnstile; delete window.__onContactTurnstileExpire; };
  }, []);

  useEffect(() => {
    if (inquiryType) setSubject(SUBJECT_MAP[inquiryType] ?? "Enquiry");
  }, [inquiryType]);

  if (formState === "done") {
    return (
      <div className="e4s-contact-success">
        <div className="e4s-contact-success__icon" aria-hidden="true">✓</div>
        <h3>Message sent!</h3>
        <p>
          Thanks{name ? `, ${name.split(" ")[0]}` : ""}! We&apos;ve received your message and
          will reply within 1 business day. Check your inbox for a confirmation.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inquiryType) { setErrorMsg("Please select an enquiry type."); return; }
    if (!message.trim()) { setErrorMsg("Please enter your message."); return; }
    setErrorMsg("");
    setFormState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, inquiryType, city, subject, message, cfToken, website: "" }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setFormState("done");
      } else {
        setErrorMsg(data.error ?? "Something went wrong — please try again.");
        setFormState("idle");
      }
    } catch {
      setErrorMsg("Something went wrong — please try again.");
      setFormState("idle");
    }
  }

  const busy = formState === "loading";

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      <form className="e4s-contact-form" onSubmit={handleSubmit} noValidate>
        {/* Honeypot — bots fill this, humans never see it */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          aria-hidden="true"
          className="e4s-honeypot"
          defaultValue=""
          autoComplete="off"
        />

        {errorMsg && (
          <p className="e4s-contact-form__error" role="alert">{errorMsg}</p>
        )}

        <div className="e4s-contact-form__row e4s-contact-form__row--2col">
          <div className="e4s-contact-form__field">
            <label htmlFor="cf-name">Name <span className="e4s-contact-form__req" aria-hidden="true">*</span></label>
            <input
              id="cf-name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={busy}
              autoComplete="name"
            />
          </div>
          <div className="e4s-contact-form__field">
            <label htmlFor="cf-email">Email <span className="e4s-contact-form__req" aria-hidden="true">*</span></label>
            <input
              id="cf-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={busy}
              autoComplete="email"
            />
          </div>
        </div>

        <div className="e4s-contact-form__row e4s-contact-form__row--2col">
          <div className="e4s-contact-form__field">
            <label htmlFor="cf-type">
              Enquiry type <span className="e4s-contact-form__req" aria-hidden="true">*</span>
            </label>
            <select
              id="cf-type"
              value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value)}
              required
              disabled={busy}
            >
              <option value="" disabled>Select enquiry type</option>
              {INQUIRY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="e4s-contact-form__field">
            <label htmlFor="cf-city">
              City <span className="e4s-contact-form__opt">(optional)</span>
            </label>
            <select id="cf-city" value={city} onChange={(e) => setCity(e.target.value)} disabled={busy}>
              <option value="">Select city</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="e4s-contact-form__field">
          <label htmlFor="cf-subject">
            Subject <span className="e4s-contact-form__req" aria-hidden="true">*</span>
          </label>
          <input
            id="cf-subject"
            type="text"
            placeholder="What's your enquiry about?"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            disabled={busy}
          />
        </div>

        <div className="e4s-contact-form__field">
          <label htmlFor="cf-message">
            Message <span className="e4s-contact-form__req" aria-hidden="true">*</span>
          </label>
          <textarea
            id="cf-message"
            placeholder="Tell us as much as you can — the more detail, the better we can help."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            disabled={busy}
            rows={6}
          />
        </div>

        <div className="e4s-contact-form__field e4s-contact-form__field--half">
          <label htmlFor="cf-phone">
            Phone <span className="e4s-contact-form__opt">(optional)</span>
          </label>
          <input
            id="cf-phone"
            type="tel"
            placeholder="+61 4xx xxx xxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={busy}
            autoComplete="tel"
          />
        </div>

        {/* Turnstile invisible */}
        <div
          className="cf-turnstile"
          data-sitekey={SITE_KEY}
          data-size="invisible"
          data-callback="__onContactTurnstile"
          data-expired-callback="__onContactTurnstileExpire"
        />

        <div className="e4s-contact-form__actions">
          <button type="submit" className="e4s-contact-form__submit" disabled={busy}>
            {busy ? "Sending…" : "Send message"}
          </button>
          <p className="e4s-contact-form__note">
            Fields marked <span aria-hidden="true">*</span> are required. We reply within 1 business day.
          </p>
        </div>
      </form>
    </>
  );
}
