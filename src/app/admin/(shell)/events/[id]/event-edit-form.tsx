"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminEvent } from "@/lib/admin-db";

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--a-ink-muted)", marginBottom: "12px" }}>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--a-ink-muted)", marginBottom: "4px" }}>{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      className="a-input"
      style={{ width: "100%" }}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function TextArea({ value, onChange, rows = 4 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      className="a-input"
      style={{ width: "100%", resize: "vertical" }}
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

const AU_CITIES = ["sydney", "melbourne", "brisbane", "perth", "adelaide", "gold_coast", "canberra", "hobart", "newcastle", "sunshine_coast"];
const AU_TIMEZONES = ["Australia/Sydney", "Australia/Melbourne", "Australia/Brisbane", "Australia/Perth", "Australia/Adelaide", "Australia/Darwin", "Australia/Hobart"];
const CATEGORIES = ["speed_dating", "dinner_parties", "dance_classes", "social_clubs", "adventure", "life_coaches", "online_dating", "travel_for_singles"];

export default function EventEditForm({ event }: { event: AdminEvent }) {
  const router = useRouter();
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description ?? "");
  const [startsAt, setStartsAt] = useState(event.starts_at ? event.starts_at.slice(0, 16) : "");
  const [endsAt, setEndsAt] = useState(event.ends_at ? event.ends_at.slice(0, 16) : "");
  const [timezone, setTimezone] = useState(event.timezone);
  const [venueName, setVenueName] = useState(event.venue_name ?? "");
  const [address, setAddress] = useState(event.address ?? "");
  const [suburb, setSuburb] = useState(event.suburb ?? "");
  const [city, setCity] = useState(event.city);
  const [state, setState] = useState(event.state ?? "");
  const [priceMin, setPriceMin] = useState(event.price_min != null ? String(event.price_min / 100) : "");
  const [priceMax, setPriceMax] = useState(event.price_max != null ? String(event.price_max / 100) : "");
  const [ticketUrl, setTicketUrl] = useState(event.ticket_url ?? "");
  const [imageUrl, setImageUrl] = useState(event.image_url ?? "");
  const [sourceUrl, setSourceUrl] = useState(event.source_url ?? "");
  const [category, setCategory] = useState(event.category ?? "");
  const [status, setStatus] = useState(event.status);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function showToast(type: "ok" | "err", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  async function save() {
    setSaving(true);
    try {
      const body = {
        title, description: description || null, starts_at: startsAt, ends_at: endsAt || null,
        timezone, venue_name: venueName || null, address: address || null, suburb: suburb || null,
        city, state: state || null,
        price_min: priceMin ? Math.round(parseFloat(priceMin) * 100) : null,
        price_max: priceMax ? Math.round(parseFloat(priceMax) * 100) : null,
        ticket_url: ticketUrl || null, image_url: imageUrl || null,
        source_url: sourceUrl || null, category: category || null, status,
      };
      const res = await fetch(`/admin/api/events/${event.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(await res.text());
      showToast("ok", "Saved");
    } catch (e) {
      showToast("err", String(e));
    } finally {
      setSaving(false);
    }
  }

  async function approve() {
    setStatus("approved");
    setSaving(true);
    try {
      await fetch(`/admin/api/events/${event.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "approved" }) });
      showToast("ok", "Approved — event is now live");
    } catch (e) {
      showToast("err", String(e));
    } finally {
      setSaving(false);
    }
  }

  async function reject() {
    setStatus("rejected");
    setSaving(true);
    try {
      await fetch(`/admin/api/events/${event.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "rejected" }) });
      showToast("ok", "Rejected");
    } catch (e) {
      showToast("err", String(e));
    } finally {
      setSaving(false);
    }
  }

  async function del() {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/admin/api/events/${event.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      router.push("/admin/events");
    } catch (e) {
      showToast("err", String(e));
      setDeleting(false);
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px", alignItems: "start" }}>
      {toast && (
        <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 999, padding: "12px 20px", borderRadius: "8px", background: toast.type === "ok" ? "var(--a-teal)" : "#c0392b", color: "#fff", fontWeight: 600, fontSize: "14px", boxShadow: "0 4px 16px rgba(0,0,0,0.18)" }}>
          {toast.msg}
        </div>
      )}

      {/* Left column */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div className="a-card" style={{ padding: "20px" }}>
          <SectionHeader>Event Details</SectionHeader>
          <Field label="Title">
            <TextInput value={title} onChange={setTitle} placeholder="Event title" />
          </Field>
          <Field label="Description">
            <TextArea value={description} onChange={setDescription} rows={5} />
          </Field>
        </div>

        <div className="a-card" style={{ padding: "20px" }}>
          <SectionHeader>Date & Time</SectionHeader>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="Starts At">
              <TextInput type="datetime-local" value={startsAt} onChange={setStartsAt} />
            </Field>
            <Field label="Ends At">
              <TextInput type="datetime-local" value={endsAt} onChange={setEndsAt} />
            </Field>
          </div>
          <Field label="Timezone">
            <select className="a-input" style={{ width: "100%" }} value={timezone} onChange={(e) => setTimezone(e.target.value)}>
              {AU_TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </Field>
        </div>

        <div className="a-card" style={{ padding: "20px" }}>
          <SectionHeader>Location</SectionHeader>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="City">
              <select className="a-input" style={{ width: "100%" }} value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="">— select city —</option>
                {AU_CITIES.map((c) => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}
              </select>
            </Field>
            <Field label="State">
              <TextInput value={state} onChange={setState} placeholder="NSW" />
            </Field>
          </div>
          <Field label="Venue Name">
            <TextInput value={venueName} onChange={setVenueName} placeholder="Venue or establishment name" />
          </Field>
          <Field label="Address">
            <TextInput value={address} onChange={setAddress} placeholder="Street address" />
          </Field>
          <Field label="Suburb">
            <TextInput value={suburb} onChange={setSuburb} placeholder="Suburb" />
          </Field>
        </div>

        <div className="a-card" style={{ padding: "20px" }}>
          <SectionHeader>Pricing & Links</SectionHeader>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="Price From (AUD)">
              <TextInput type="number" value={priceMin} onChange={setPriceMin} placeholder="0 = free" />
            </Field>
            <Field label="Price To (AUD)">
              <TextInput type="number" value={priceMax} onChange={setPriceMax} placeholder="leave blank if fixed" />
            </Field>
          </div>
          <Field label="Ticket / RSVP URL">
            <TextInput value={ticketUrl} onChange={setTicketUrl} placeholder="https://..." />
          </Field>
          <Field label="Source URL">
            <TextInput value={sourceUrl} onChange={setSourceUrl} placeholder="Original listing URL" />
          </Field>
          <Field label="Image URL">
            <TextInput value={imageUrl} onChange={setImageUrl} placeholder="https://..." />
          </Field>
        </div>
      </div>

      {/* Right sidebar */}
      <div style={{ position: "sticky", top: "80px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div className="a-card" style={{ padding: "16px" }}>
          <SectionHeader>Save</SectionHeader>
          <button className="a-btn a-btn-primary" style={{ width: "100%" }} onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>

        <div className="a-card" style={{ padding: "16px" }}>
          <SectionHeader>Moderation</SectionHeader>
          <div style={{ marginBottom: "8px", fontSize: "12px", color: "var(--a-ink-muted)" }}>
            Status: <strong>{status}</strong>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <button className="a-btn a-btn-primary" style={{ width: "100%", background: "var(--a-teal)" }} onClick={approve} disabled={saving || status === "approved"}>
              ✓ Approve
            </button>
            <button className="a-btn a-btn-ghost" style={{ width: "100%", color: "var(--a-red, #c0392b)" }} onClick={reject} disabled={saving || status === "rejected"}>
              ✕ Reject
            </button>
          </div>
        </div>

        <div className="a-card" style={{ padding: "16px" }}>
          <SectionHeader>Category</SectionHeader>
          <select className="a-input" style={{ width: "100%" }} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">— uncategorised —</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}
          </select>
        </div>

        <div className="a-card" style={{ padding: "16px" }}>
          <SectionHeader>Source</SectionHeader>
          <div style={{ fontSize: "12px", color: "var(--a-ink-muted)" }}>
            <div>{event.source}</div>
            {event.source_id && <div style={{ marginTop: "4px" }}>ID: {event.source_id}</div>}
            {event.submitted_by && <div style={{ marginTop: "4px" }}>By: {event.submitted_by}</div>}
          </div>
        </div>

        <div className="a-card" style={{ padding: "16px" }}>
          <SectionHeader>Danger</SectionHeader>
          <button className="a-btn a-btn-ghost" style={{ width: "100%", color: "var(--a-red, #c0392b)" }} onClick={del} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete Event"}
          </button>
        </div>
      </div>
    </div>
  );
}
