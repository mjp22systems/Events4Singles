"use client";
import { useState, useEffect } from "react";
import type { Listing } from "@/lib/types";

interface Props {
  listing: Listing;
  onSaved?: () => void;
}

const LISTING_TYPES = ["standard", "event_org", "venue", "service", "practitioner", "online"];
const STATUSES = ["active", "inactive", "pending"];

export default function AdminEditDrawer({ listing, onSaved }: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState({
    title: listing.title ?? "",
    tagline: listing.tagline ?? "",
    description: listing.description ?? "",
    phone: listing.phone ?? "",
    mobile: listing.mobile ?? "",
    email: listing.email ?? "",
    web: listing.web ?? "",
    image_url: listing.image_url ?? "",
    location: listing.location ?? "",
    location_city: listing.location_city ?? "",
    location_state: listing.location_state ?? "",
    listing_type: listing.listing_type ?? "standard",
    status: (listing as unknown as Record<string, string>).status ?? "active",
    confidence_score: String(listing.confidence_score ?? ""),
  });

  useEffect(() => {
    document.body.classList.add("has-admin-bar");
    return () => document.body.classList.remove("has-admin-bar");
  }, []);

  useEffect(() => {
    if (open) {
      document.body.classList.add("drawer-open");
    } else {
      document.body.classList.remove("drawer-open");
    }
    return () => document.body.classList.remove("drawer-open");
  }, [open]);

  function set(key: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFields((f) => ({ ...f, [key]: e.target.value }));
    };
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/listings/${listing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          confidence_score: fields.confidence_score ? parseInt(fields.confidence_score, 10) : undefined,
        }),
      });
      if (!res.ok) {
        const j = await res.json() as { error?: string };
        setError(j.error ?? "Save failed");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        onSaved?.();
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="e4s-admin-bar">
        <span>Admin</span>
        <button className="e4s-admin-bar__btn" onClick={() => setOpen(true)} type="button">
          Edit listing
        </button>
        {saved && <span className="e4s-admin-bar__saved">Saved</span>}
      </div>

      {open && (
        <aside className="e4s-edit-drawer" role="dialog" aria-label="Edit listing">
          <div className="e4s-edit-drawer__head">
            <h2 className="e4s-edit-drawer__title">Edit listing #{listing.id}</h2>
            <button className="e4s-edit-drawer__close" onClick={() => setOpen(false)} type="button" aria-label="Close">×</button>
          </div>
          <div className="e4s-edit-drawer__body">
            {error && <p className="e4s-edit-drawer__error">{error}</p>}
            <Field label="Title"><input type="text" value={fields.title} onChange={set("title")} /></Field>
            <Field label="Tagline"><input type="text" value={fields.tagline} onChange={set("tagline")} /></Field>
            <Field label="Description"><textarea rows={4} value={fields.description} onChange={set("description")} /></Field>
            <Field label="Phone"><input type="text" value={fields.phone} onChange={set("phone")} /></Field>
            <Field label="Mobile"><input type="text" value={fields.mobile} onChange={set("mobile")} /></Field>
            <Field label="Email"><input type="text" value={fields.email} onChange={set("email")} /></Field>
            <Field label="Website"><input type="text" value={fields.web} onChange={set("web")} /></Field>
            <Field label="Image URL"><input type="text" value={fields.image_url} onChange={set("image_url")} /></Field>
            <Field label="Location"><input type="text" value={fields.location} onChange={set("location")} /></Field>
            <Field label="City"><input type="text" value={fields.location_city} onChange={set("location_city")} /></Field>
            <Field label="State"><input type="text" value={fields.location_state} onChange={set("location_state")} /></Field>
            <Field label="Listing type">
              <select value={fields.listing_type} onChange={set("listing_type")}>
                {LISTING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select value={fields.status} onChange={set("status")}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Confidence score"><input type="number" min="0" max="100" value={fields.confidence_score} onChange={set("confidence_score")} /></Field>
          </div>
          <div className="e4s-edit-drawer__footer">
            <button className="e4s-edit-drawer__cancel" onClick={() => setOpen(false)} type="button">Cancel</button>
            <button className="e4s-edit-drawer__save" onClick={save} disabled={saving} type="button">
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </aside>
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="e4s-edit-field">
      <label className="e4s-edit-field__label">{label}</label>
      {children}
    </div>
  );
}
