"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminEvent } from "@/lib/admin-db";
import EventImagePicker from "@/components/admin/event-image-picker";

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
const REGISTRATION_MODES = [
  { value: "auto", label: "Auto - paid uses Eventbrite" },
  { value: "eventbrite", label: "Eventbrite" },
  { value: "ticket", label: "External RSVP / ticket URL" },
  { value: "source", label: "Original source page" },
  { value: "contact", label: "Contact organiser" },
];

function splitDateTime(value: string | null | undefined) {
  const local = value?.slice(0, 16) ?? "";
  return {
    date: local.slice(0, 10),
    time: local.slice(11, 16),
  };
}

function combineDateTime(date: string, time: string) {
  if (!date) return "";
  return `${date}T${time || "00:00"}`;
}

function humanLabel(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function plainDescriptionForEdit(value: string | null | undefined) {
  return (value ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/\\([\\`*_{}\[\]()#+\-.!?,>])/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*\n]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_\n]+)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function EventEditForm({ event }: { event: AdminEvent }) {
  const router = useRouter();
  const initialStart = splitDateTime(event.starts_at);
  const initialEnd = splitDateTime(event.ends_at);
  const cityOptions = Array.from(new Set([event.city, ...AU_CITIES].filter(Boolean)));
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(plainDescriptionForEdit(event.description));
  const [startDate, setStartDate] = useState(initialStart.date);
  const [startTime, setStartTime] = useState(initialStart.time);
  const [endDate, setEndDate] = useState(initialEnd.date);
  const [endTime, setEndTime] = useState(initialEnd.time);
  const [timezone, setTimezone] = useState(event.timezone);
  const [venueName, setVenueName] = useState(event.venue_name ?? "");
  const [address, setAddress] = useState(event.address ?? "");
  const [suburb, setSuburb] = useState(event.suburb ?? "");
  const [city, setCity] = useState(event.city);
  const [priceMin, setPriceMin] = useState(event.price_min != null ? String(event.price_min / 100) : "");
  const [priceMax, setPriceMax] = useState(event.price_max != null ? String(event.price_max / 100) : "");
  const [ticketUrl, setTicketUrl] = useState(event.ticket_url ?? "");
  const [imageUrl, setImageUrl] = useState(event.image_url ?? "");
  const [sourceUrl, setSourceUrl] = useState(event.source_url ?? "");
  const [registrationMode, setRegistrationMode] = useState(event.registration_mode ?? "auto");
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
        title, description: plainDescriptionForEdit(description) || null,
        starts_at: combineDateTime(startDate, startTime),
        ends_at: endDate ? combineDateTime(endDate, endTime) : null,
        timezone, venue_name: venueName || null, address: address || null, suburb: suburb || null,
        city,
        price_min: priceMin ? Math.round(parseFloat(priceMin) * 100) : null,
        price_max: priceMax ? Math.round(parseFloat(priceMax) * 100) : null,
        ticket_url: ticketUrl || null, image_url: imageUrl || null,
        source_url: sourceUrl || null, registration_mode: registrationMode || "auto",
        category: category || null, status,
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "12px" }}>
            <Field label="Start Date">
              <TextInput type="date" value={startDate} onChange={setStartDate} />
            </Field>
            <Field label="Start Time">
              <TextInput type="time" value={startTime} onChange={setStartTime} />
            </Field>
            <Field label="End Date">
              <TextInput type="date" value={endDate} onChange={setEndDate} />
            </Field>
            <Field label="End Time">
              <TextInput type="time" value={endTime} onChange={setEndTime} />
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
            <Field label="City">
              <select className="a-input" style={{ width: "100%" }} value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="">— select city —</option>
                {cityOptions.map((c) => <option key={c} value={c}>{humanLabel(c)}</option>)}
              </select>
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
          <SectionHeader>Pricing & Registration</SectionHeader>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="Price From (AUD)">
              <TextInput type="number" value={priceMin} onChange={setPriceMin} placeholder="0 = free" />
            </Field>
            <Field label="Price To (AUD)">
              <TextInput type="number" value={priceMax} onChange={setPriceMax} placeholder="leave blank if fixed" />
            </Field>
          </div>
          <Field label="Registration destination">
            <select className="a-input" style={{ width: "100%" }} value={registrationMode} onChange={(e) => setRegistrationMode(e.target.value)}>
              {REGISTRATION_MODES.map((mode) => <option key={mode.value} value={mode.value}>{mode.label}</option>)}
            </select>
          </Field>
          <Field label="External RSVP / ticket URL">
            <TextInput value={ticketUrl} onChange={setTicketUrl} placeholder="https://..." />
          </Field>
          <Field label="Original source URL">
            <TextInput value={sourceUrl} onChange={setSourceUrl} placeholder="Original listing URL" />
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
            {CATEGORIES.map((c) => <option key={c} value={c}>{humanLabel(c)}</option>)}
          </select>
        </div>

        <div className="a-card" style={{ padding: "16px" }}>
          <SectionHeader>Image</SectionHeader>
          <EventImagePicker value={imageUrl} onChange={setImageUrl} />
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
