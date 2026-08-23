"use client";
import { useState, useEffect } from "react";
import type { Listing } from "@/lib/types";

interface Props {
  listing: Listing;
  onSaved?: () => void;
}

const LISTING_TYPES: { value: string; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "event_organizer", label: "Event Organizer" },
  { value: "venue", label: "Venue" },
  { value: "service", label: "Service" },
  { value: "practitioner", label: "Practitioner" },
  { value: "online", label: "Online" },
];
const STATUSES: { value: string; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

export default function AdminEditDrawer({ listing, onSaved }: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Separate state for business name (writes to businesses table)
  const [businessName, setBusinessName] = useState(listing.business_name ?? "");

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
    status: listing.status ?? "active",
    confidence_score: String(listing.confidence_score ?? ""),
    hide_contact: listing.hide_contact === 1,
    unclaimed_flag: listing.unclaimed_flag === 1,
  });

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

  function setCheck(key: "hide_contact" | "unclaimed_flag") {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFields((f) => ({ ...f, [key]: e.target.checked }));
    };
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      // Update listing fields
      const listingRes = await fetch(`/admin/api/listings/${listing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          hide_contact: fields.hide_contact ? 1 : 0,
          unclaimed_flag: fields.unclaimed_flag ? 1 : 0,
          confidence_score: fields.confidence_score ? parseInt(fields.confidence_score, 10) : undefined,
        }),
      });
      if (!listingRes.ok) {
        const j = await listingRes.json() as { error?: string };
        setError(j.error ?? "Save failed");
        return;
      }

      // Update business name if business_id exists and name changed
      if (listing.business_id && businessName !== (listing.business_name ?? "")) {
        const bizRes = await fetch(`/admin/api/businesses/${listing.business_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: businessName }),
        });
        if (!bizRes.ok) {
          const j = await bizRes.json() as { error?: string };
          setError(`Listing saved but business name failed: ${j.error ?? "error"}`);
          return;
        }
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      onSaved?.();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="e4s-admin-bar">
        <span className="e4s-admin-bar__label">Admin</span>
        {saved && <span className="e4s-admin-bar__saved">Saved</span>}
        <button className="e4s-admin-bar__btn" onClick={() => setOpen(true)} type="button">
          Edit Listing
        </button>
      </div>

      {open && (
        <aside className="e4s-edit-drawer" role="dialog" aria-label="Edit listing">
          <div className="e4s-edit-drawer__head">
            <h2 className="e4s-edit-drawer__title">Edit listing #{listing.id}</h2>
            <button className="e4s-edit-drawer__close" onClick={() => setOpen(false)} type="button" aria-label="Close">×</button>
          </div>
          <div className="e4s-edit-drawer__body">
            {error && <p className="e4s-edit-drawer__error">{error}</p>}

            <div className="e4s-edit-drawer__section">Business</div>
            <Field label="Business name (shown as heading on all pages)">
              <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            </Field>
            <Field label="Title (listing headline — used in URLs and cards)">
              <input type="text" value={fields.title} onChange={set("title")} />
            </Field>
            <Field label="Tagline"><input type="text" value={fields.tagline} onChange={set("tagline")} /></Field>
            <Field label="Description"><textarea rows={4} value={fields.description} onChange={set("description")} /></Field>

            <div className="e4s-edit-drawer__section">Contact</div>
            <Field label="Phone"><input type="text" value={fields.phone} onChange={set("phone")} /></Field>
            <Field label="Mobile"><input type="text" value={fields.mobile} onChange={set("mobile")} /></Field>
            <Field label="Email"><input type="text" value={fields.email} onChange={set("email")} /></Field>
            <Field label="Website"><input type="text" value={fields.web} onChange={set("web")} /></Field>
            <Field label="Hide contact details">
              <label className="e4s-edit-toggle">
                <input type="checkbox" checked={fields.hide_contact} onChange={setCheck("hide_contact")} />
                <span>Hide phone, mobile and email from public view</span>
              </label>
            </Field>

            <div className="e4s-edit-drawer__section">Location</div>
            <Field label="Address / suburb"><input type="text" value={fields.location} onChange={set("location")} /></Field>
            <Field label="City"><input type="text" value={fields.location_city} onChange={set("location_city")} /></Field>
            <Field label="State"><input type="text" value={fields.location_state} onChange={set("location_state")} /></Field>

            <div className="e4s-edit-drawer__section">Media</div>
            <Field label="Image URL"><input type="text" value={fields.image_url} onChange={set("image_url")} /></Field>

            <div className="e4s-edit-drawer__section">Admin</div>
            <Field label="Listing type">
              <select value={fields.listing_type} onChange={set("listing_type")}>
                {LISTING_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select value={fields.status} onChange={set("status")}>
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Unclaimed listing">
              <label className="e4s-edit-toggle">
                <input type="checkbox" checked={fields.unclaimed_flag} onChange={setCheck("unclaimed_flag")} />
                <span>Mark as unclaimed (shows claim prompt)</span>
              </label>
            </Field>
            <Field label="Confidence score (0–100)">
              <input type="number" min="0" max="100" value={fields.confidence_score} onChange={set("confidence_score")} />
            </Field>
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
