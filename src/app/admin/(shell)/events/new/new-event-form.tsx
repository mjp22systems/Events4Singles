"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const AU_CITIES = ["sydney", "melbourne", "brisbane", "perth", "adelaide", "gold_coast", "canberra", "hobart", "newcastle", "sunshine_coast"];
const AU_TIMEZONES = ["Australia/Sydney", "Australia/Melbourne", "Australia/Brisbane", "Australia/Perth", "Australia/Adelaide", "Australia/Darwin", "Australia/Hobart"];
const CATEGORIES = ["speed_dating", "dinner_parties", "dance_classes", "social_clubs", "adventure", "life_coaches", "online_dating", "travel_for_singles"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--a-ink-muted)", marginBottom: "4px" }}>{label}</label>
      {children}
    </div>
  );
}

export default function NewEventForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [timezone, setTimezone] = useState("Australia/Sydney");
  const [venueName, setVenueName] = useState("");
  const [suburb, setSuburb] = useState("");
  const [city, setCity] = useState("sydney");
  const [state, setState] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [ticketUrl, setTicketUrl] = useState("");
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
        state: state || null,
        price_min: priceMin ? Math.round(parseFloat(priceMin) * 100) : null,
        ticket_url: ticketUrl || null,
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

  return (
    <div style={{ maxWidth: "640px" }}>
      <div className="a-card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "0" }}>
        <Field label="Title *">
          <input className="a-input" style={{ width: "100%" }} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" />
        </Field>
        <Field label="Description">
          <textarea className="a-input" style={{ width: "100%", resize: "vertical" }} rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Field label="Starts At *">
            <input type="datetime-local" className="a-input" style={{ width: "100%" }} value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
          </Field>
          <Field label="Ends At">
            <input type="datetime-local" className="a-input" style={{ width: "100%" }} value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
          </Field>
        </div>
        <Field label="Timezone">
          <select className="a-input" style={{ width: "100%" }} value={timezone} onChange={(e) => setTimezone(e.target.value)}>
            {AU_TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
          </select>
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Field label="City *">
            <select className="a-input" style={{ width: "100%" }} value={city} onChange={(e) => setCity(e.target.value)}>
              {AU_CITIES.map((c) => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}
            </select>
          </Field>
          <Field label="State">
            <input className="a-input" style={{ width: "100%" }} value={state} onChange={(e) => setState(e.target.value)} placeholder="NSW" />
          </Field>
        </div>
        <Field label="Venue Name">
          <input className="a-input" style={{ width: "100%" }} value={venueName} onChange={(e) => setVenueName(e.target.value)} placeholder="Venue or establishment name" />
        </Field>
        <Field label="Suburb">
          <input className="a-input" style={{ width: "100%" }} value={suburb} onChange={(e) => setSuburb(e.target.value)} placeholder="Suburb" />
        </Field>
        <Field label="Category">
          <select className="a-input" style={{ width: "100%" }} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">— uncategorised —</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}
          </select>
        </Field>
        <Field label="Price From (AUD, 0 = free)">
          <input type="number" className="a-input" style={{ width: "100%" }} value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="0" />
        </Field>
        <Field label="Ticket / RSVP URL">
          <input className="a-input" style={{ width: "100%" }} value={ticketUrl} onChange={(e) => setTicketUrl(e.target.value)} placeholder="https://..." />
        </Field>
        <Field label="Image URL">
          <input className="a-input" style={{ width: "100%" }} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
        </Field>

        {error && (
          <div style={{ padding: "10px 14px", borderRadius: "6px", background: "#fdf0ef", color: "#c0392b", fontSize: "13px", marginBottom: "12px" }}>
            {error}
          </div>
        )}

        <button className="a-btn a-btn-primary" onClick={create} disabled={saving}>
          {saving ? "Creating…" : "Create Event"}
        </button>
      </div>
    </div>
  );
}
