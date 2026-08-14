"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminListing } from "@/lib/admin-db";

const STATUSES = ["active", "pending", "unclaimed", "paused", "expired", "archived", "deleted"];
const TYPES = ["standard", "featured", "premium"];

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--a-ink-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </label>
      {children}
      {hint && <span style={{ fontSize: "11px", color: "var(--a-ink-faint)" }}>{hint}</span>}
    </div>
  );
}

function TextInput({
  name,
  value,
  onChange,
  placeholder,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      name={name}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="a-input"
    />
  );
}

function TextArea({
  name,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="a-input"
      style={{ resize: "vertical" }}
    />
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div
      style={{
        fontSize: "11px",
        fontWeight: 700,
        color: "var(--a-ink-faint)",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        paddingBottom: "12px",
        borderBottom: "1px solid var(--a-border)",
        marginBottom: "16px",
        marginTop: "4px",
      }}
    >
      {title}
    </div>
  );
}

function grid2(): React.CSSProperties {
  return { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" };
}

type F = string | null;
function s(v: F) { return v ?? ""; }

function fmtDate(v: string | number | null): string {
  if (!v) return "—";
  const d = typeof v === "number" ? new Date(v * 1000) : new Date(v);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-AU");
}

export default function ListingEditForm({ listing }: { listing: AdminListing }) {
  const router = useRouter();
  const id = listing.id;

  const [title, setTitle] = useState(s(listing.title));
  const [tagline, setTagline] = useState(s(listing.tagline));
  const [description, setDescription] = useState(s(listing.description));
  const [promo, setPromo] = useState(s(listing.promo));

  const [contactName, setContactName] = useState(s(listing.contact_name));
  const [phone, setPhone] = useState(s(listing.phone));
  const [mobile, setMobile] = useState(s(listing.mobile));
  const [email, setEmail] = useState(s(listing.email));
  const [web, setWeb] = useState(s(listing.web));

  const [location, setLocation] = useState(s(listing.location));
  const [locationCity, setLocationCity] = useState(s(listing.location_city));
  const [locationState, setLocationState] = useState(s(listing.location_state));

  const [imageUrl, setImageUrl] = useState(s(listing.image_url));

  const [facebookUrl, setFacebookUrl] = useState(s(listing.facebook_url));
  const [instagramUrl, setInstagramUrl] = useState(s(listing.instagram_url));
  const [tiktokUrl, setTiktokUrl] = useState(s(listing.tiktok_url));
  const [youtubeUrl, setYoutubeUrl] = useState(s(listing.youtube_url));
  const [linkedinUrl, setLinkedinUrl] = useState(s(listing.linkedin_url));

  const [status, setStatus] = useState(listing.status ?? "active");
  const [listingType, setListingType] = useState(listing.listing_type ?? "standard");
  const [unclaimed, setUnclaimed] = useState(!!listing.unclaimed_flag);

  const [abn, setAbn] = useState(s(listing.abn));
  const [licenceNo, setLicenceNo] = useState(s(listing.licence_no));
  const [tradingHours, setTradingHours] = useState(s(listing.trading_hours));
  const [contactHours, setContactHours] = useState(s(listing.contact_hours));

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleting, setDeleting] = useState(false);

  function showToast(type: "ok" | "err", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/admin/api/listings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, tagline, description, promo,
          contact_name: contactName, phone, mobile, email, web,
          location, location_city: locationCity, location_state: locationState,
          image_url: imageUrl,
          facebook_url: facebookUrl, instagram_url: instagramUrl,
          tiktok_url: tiktokUrl, youtube_url: youtubeUrl, linkedin_url: linkedinUrl,
          status, listing_type: listingType, unclaimed_flag: unclaimed ? 1 : 0,
          abn, licence_no: licenceNo, trading_hours: tradingHours, contact_hours: contactHours,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      showToast("ok", "Saved");
    } catch {
      showToast("err", "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/admin/api/listings/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: deleteReason || "Deleted by admin" }),
      });
      if (!res.ok) throw new Error();
      router.push("/admin/listings");
    } catch {
      showToast("err", "Delete failed");
      setDeleting(false);
    }
  }

  const selectStyle: React.CSSProperties = {
    background: "var(--a-surface-2)",
    border: "1px solid var(--a-border)",
    borderRadius: "7px",
    color: "var(--a-ink)",
    fontSize: "13px",
    padding: "8px 12px",
    width: "100%",
  };

  return (
    <form onSubmit={handleSave}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
            padding: "10px 18px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 500,
            background: toast.type === "ok" ? "var(--a-success)" : "var(--a-danger)",
            color: "#fff",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          }}
          role="status"
          aria-live="polite"
        >
          {toast.msg}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px", alignItems: "start" }}>
        {/* Left column — main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Core content */}
          <div className="a-card">
            <div className="a-card-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <SectionHeader title="Content" />
              <Field label="Title">
                <TextInput name="title" value={title} onChange={setTitle} placeholder="Listing title" />
              </Field>
              <Field label="Tagline" hint="Short subtitle shown on listing card">
                <TextInput name="tagline" value={tagline} onChange={setTagline} placeholder="One line summary" />
              </Field>
              <Field label="Description">
                <TextArea name="description" value={description} onChange={setDescription} rows={6} placeholder="Full listing description" />
              </Field>
              <Field label="Promo" hint="Short promotional callout (shown in cards)">
                <TextInput name="promo" value={promo} onChange={setPromo} placeholder="e.g. First event free!" />
              </Field>
            </div>
          </div>

          {/* Contact */}
          <div className="a-card">
            <div className="a-card-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <SectionHeader title="Contact" />
              <Field label="Contact Name">
                <TextInput name="contact_name" value={contactName} onChange={setContactName} />
              </Field>
              <div style={grid2()}>
                <Field label="Phone">
                  <TextInput name="phone" value={phone} onChange={setPhone} placeholder="02 xxxx xxxx" />
                </Field>
                <Field label="Mobile">
                  <TextInput name="mobile" value={mobile} onChange={setMobile} placeholder="04xx xxx xxx" />
                </Field>
              </div>
              <Field label="Email">
                <TextInput name="email" value={email} onChange={setEmail} placeholder="contact@example.com" />
              </Field>
              <Field label="Website">
                <TextInput name="web" value={web} onChange={setWeb} placeholder="https://example.com" />
              </Field>
            </div>
          </div>

          {/* Location */}
          <div className="a-card">
            <div className="a-card-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <SectionHeader title="Location" />
              <Field label="Address / Suburb">
                <TextInput name="location" value={location} onChange={setLocation} placeholder="Street, suburb" />
              </Field>
              <div style={grid2()}>
                <Field label="City">
                  <TextInput name="location_city" value={locationCity} onChange={setLocationCity} placeholder="Sydney" />
                </Field>
                <Field label="State">
                  <TextInput name="location_state" value={locationState} onChange={setLocationState} placeholder="NSW" />
                </Field>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="a-card">
            <div className="a-card-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <SectionHeader title="Social Links" />
              <div style={grid2()}>
                <Field label="Facebook">
                  <TextInput name="facebook_url" value={facebookUrl} onChange={setFacebookUrl} placeholder="https://facebook.com/…" />
                </Field>
                <Field label="Instagram">
                  <TextInput name="instagram_url" value={instagramUrl} onChange={setInstagramUrl} placeholder="https://instagram.com/…" />
                </Field>
                <Field label="TikTok">
                  <TextInput name="tiktok_url" value={tiktokUrl} onChange={setTiktokUrl} placeholder="https://tiktok.com/@…" />
                </Field>
                <Field label="YouTube">
                  <TextInput name="youtube_url" value={youtubeUrl} onChange={setYoutubeUrl} placeholder="https://youtube.com/…" />
                </Field>
                <Field label="LinkedIn">
                  <TextInput name="linkedin_url" value={linkedinUrl} onChange={setLinkedinUrl} placeholder="https://linkedin.com/…" />
                </Field>
              </div>
            </div>
          </div>

          {/* Additional */}
          <div className="a-card">
            <div className="a-card-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <SectionHeader title="Additional" />
              <div style={grid2()}>
                <Field label="ABN">
                  <TextInput name="abn" value={abn} onChange={setAbn} />
                </Field>
                <Field label="Licence No.">
                  <TextInput name="licence_no" value={licenceNo} onChange={setLicenceNo} />
                </Field>
              </div>
              <Field label="Trading Hours">
                <TextArea name="trading_hours" value={tradingHours} onChange={setTradingHours} rows={2} placeholder="Mon–Fri 9am–5pm" />
              </Field>
              <Field label="Contact Hours">
                <TextArea name="contact_hours" value={contactHours} onChange={setContactHours} rows={2} />
              </Field>
            </div>
          </div>
        </div>

        {/* Right column — settings + meta */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "sticky", top: "24px" }}>

          {/* Save / actions */}
          <div className="a-card">
            <div className="a-card-body" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button type="submit" className="a-btn a-btn-primary" disabled={saving} style={{ width: "100%" }}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <a
                href={`/listing/${title.toLowerCase().replace(/\s+/g, "-")}-${id}`}
                target="_blank"
                rel="noopener"
                className="a-btn a-btn-ghost"
                style={{ width: "100%", textAlign: "center" }}
              >
                View Live ↗
              </a>
              <button
                type="button"
                onClick={() => setShowDelete(true)}
                style={{
                  width: "100%",
                  background: "none",
                  border: "1px solid var(--a-danger)",
                  borderRadius: "7px",
                  color: "var(--a-danger)",
                  fontSize: "13px",
                  fontWeight: 500,
                  padding: "7px 14px",
                  cursor: "pointer",
                }}
              >
                Delete Listing
              </button>
            </div>
          </div>

          {/* Status & type */}
          <div className="a-card">
            <div className="a-card-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <SectionHeader title="Settings" />
              <Field label="Status">
                <select value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Listing Type">
                <select value={listingType} onChange={(e) => setListingType(e.target.value)} style={selectStyle}>
                  {TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={unclaimed}
                  onChange={(e) => setUnclaimed(e.target.checked)}
                  style={{ width: "16px", height: "16px", accentColor: "var(--a-teal)" }}
                />
                Unclaimed listing
              </label>
            </div>
          </div>

          {/* Image */}
          <div className="a-card">
            <div className="a-card-body" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <SectionHeader title="Image" />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt=""
                  style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: "6px", background: "var(--a-surface-2)" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              )}
              <Field label="Image URL">
                <TextInput name="image_url" value={imageUrl} onChange={setImageUrl} placeholder="https://…" />
              </Field>
            </div>
          </div>

          {/* Meta info */}
          <div className="a-card">
            <div className="a-card-body" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <SectionHeader title="Meta" />
              {[
                ["ID", String(id)],
                ["Business", listing.business_name ?? `#${listing.business_id ?? "—"}`],
                ["Confidence", listing.confidence_score != null ? `${listing.confidence_score}%` : "—"],
                ["Source", listing.source_file ?? "—"],
                ["Created", fmtDate(listing.created_at)],
                ["Expires", fmtDate(listing.expires_at)],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "var(--a-ink-muted)" }}>{k}</span>
                  <span style={{ color: "var(--a-ink)", fontWeight: 500, maxWidth: "180px", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDelete && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9998,
          }}
          onClick={() => setShowDelete(false)}
        >
          <div
            style={{
              background: "var(--a-surface)",
              border: "1px solid var(--a-border)",
              borderRadius: "12px",
              padding: "28px",
              width: "440px",
              maxWidth: "90vw",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "8px", color: "var(--a-ink)" }}>
              Delete listing #{id}?
            </h2>
            <p style={{ fontSize: "13px", color: "var(--a-ink-muted)", marginBottom: "20px" }}>
              This soft-deletes the listing. It can be recovered from the database.
            </p>
            <Field label="Reason (optional)">
              <TextInput name="delete_reason" value={deleteReason} onChange={setDeleteReason} placeholder="e.g. Duplicate, spam, outdated" />
            </Field>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  flex: 1,
                  background: "var(--a-danger)",
                  border: "none",
                  borderRadius: "7px",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                  padding: "9px",
                  cursor: "pointer",
                }}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
              <button
                type="button"
                onClick={() => setShowDelete(false)}
                className="a-btn a-btn-ghost"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
