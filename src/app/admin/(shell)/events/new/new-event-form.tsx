"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EventImagePicker from "@/components/admin/event-image-picker";
import { EVENT_CATEGORY_OPTIONS } from "@/lib/category-taxonomy";

const AU_CITIES = ["sydney", "melbourne", "brisbane", "perth", "adelaide", "gold_coast", "canberra", "hobart", "newcastle", "sunshine_coast"];
const AU_TIMEZONES = ["Australia/Sydney", "Australia/Melbourne", "Australia/Brisbane", "Australia/Perth", "Australia/Adelaide", "Australia/Darwin", "Australia/Hobart"];
const REGISTRATION_MODES = [
  { value: "auto", label: "Auto - paid uses Eventbrite" },
  { value: "eventbrite", label: "Eventbrite" },
  { value: "ticket", label: "External RSVP / ticket URL" },
  { value: "source", label: "Original source page" },
  { value: "contact", label: "Contact organiser" },
];

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="a-field">
      <label className="a-label">{label}</label>
      {children}
    </div>
  );
}

export default function NewEventForm({ variant = "card" }: { variant?: "card" | "plain" }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [timezone, setTimezone] = useState("Australia/Sydney");
  const [venueName, setVenueName] = useState("");
  const [suburb, setSuburb] = useState("");
  const [city, setCity] = useState("sydney");
  const [priceMin, setPriceMin] = useState("");
  const [ticketUrl, setTicketUrl] = useState("");
  const [registrationMode, setRegistrationMode] = useState("auto");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    if (!title.trim() || !startsAt || !city) {
      setError("Title, start date, and city are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const body = {
        title: title.trim(),
        description: description || null,
        starts_at: startsAt,
        ends_at: endsAt || null,
        timezone,
        venue_name: venueName || null,
        suburb: suburb || null,
        city,
        price_min: priceMin ? Math.round(parseFloat(priceMin) * 100) : null,
        ticket_url: ticketUrl || null,
        registration_mode: registrationMode,
        image_url: imageUrl || null,
        category: category || null,
        source: "admin",
        status: "approved",
      };
      const res = await fetch("/admin/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(await res.text());
      const { id } = await res.json<{ id: string }>();
      router.push(`/admin/events/${id}`);
    } catch (e) {
      setError(String(e));
      setSaving(false);
    }
  }

  const form = (
    <div className="admin-form-grid admin-form-grid--2">
      <div className="admin-field--wide">
        <Field label="Title *">
          <input className="a-input a-w-full"  value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" />
        </Field>
      </div>
      <div className="admin-field--wide">
        <Field label="Description">
          <textarea className="a-input a-inline-e6eed6ec"  rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
      </div>
      <Field label="Starts At *">
        <input type="datetime-local" className="a-input a-w-full"  value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
      </Field>
      <Field label="Ends At">
        <input type="datetime-local" className="a-input a-w-full"  value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
      </Field>
      <Field label="Timezone">
        <select className="a-input a-w-full"  value={timezone} onChange={(e) => setTimezone(e.target.value)}>
          {AU_TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
        </select>
      </Field>
      <Field label="City *">
        <select className="a-input a-w-full"  value={city} onChange={(e) => setCity(e.target.value)}>
          {AU_CITIES.map((c) => <option key={c} value={c}>{c.replace(/[_-]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}</option>)}
        </select>
      </Field>
      <Field label="Venue Name">
        <input className="a-input a-w-full"  value={venueName} onChange={(e) => setVenueName(e.target.value)} placeholder="Venue or establishment name" />
      </Field>
      <Field label="Suburb">
        <input className="a-input a-w-full"  value={suburb} onChange={(e) => setSuburb(e.target.value)} placeholder="Suburb" />
      </Field>
      <Field label="Category">
        <select className="a-input a-w-full"  value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">- uncategorised -</option>
          {EVENT_CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c.replace(/[_-]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}</option>)}
        </select>
      </Field>
      <Field label="Price From (AUD, 0 = free)">
        <input type="number" className="a-input a-w-full"  value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="0" />
      </Field>
      <Field label="Registration destination">
        <select className="a-input a-w-full"  value={registrationMode} onChange={(e) => setRegistrationMode(e.target.value)}>
          {REGISTRATION_MODES.map((mode) => <option key={mode.value} value={mode.value}>{mode.label}</option>)}
        </select>
      </Field>
      <Field label="External RSVP / ticket URL">
        <input className="a-input a-w-full"  value={ticketUrl} onChange={(e) => setTicketUrl(e.target.value)} placeholder="https://..." />
      </Field>
      <div className="admin-field--wide">
        <EventImagePicker value={imageUrl} onChange={setImageUrl} />
      </div>

        {error && (
          <div className="admin-form-error admin-field--wide">
            {error}
          </div>
        )}

      <div className="admin-form-actions">
        <button className="a-btn a-btn-primary" onClick={create} disabled={saving}>
          {saving ? "Creating..." : "Create Event"}
        </button>
      </div>
    </div>
  );

  if (variant === "plain") return form;

  return (
    <div className="a-inline-b52bebf2" >
      <div className="a-card">
        <div className="a-card-body">{form}</div>
      </div>
    </div>
  );
}
