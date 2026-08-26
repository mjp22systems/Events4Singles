"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminCategory, AdminCity, AdminListing, AdminListingPlacement } from "@/lib/admin-db";

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
    <div className="a-inline-b9bd1a8f" >
      <label className="a-inline-f541ad79" >
        {label}
      </label>
      {children}
      {hint && <span className="a-inline-b937af7d" >{hint}</span>}
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
      className="a-input a-inline-e770c315"
      
    />
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div
      className="a-inline-ba69aad3" 
    >
      {title}
    </div>
  );
}

type F = string | null;
function s(v: F) { return v ?? ""; }

function fmtDate(v: string | number | null): string {
  if (!v) return "—";
  const d = typeof v === "number" ? new Date(v * 1000) : new Date(v);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-AU");
}

type PlacementDraft = {
  category_slug: string;
  city_slug: string;
};

function placementDrafts(placements: AdminListingPlacement[]): PlacementDraft[] {
  return placements.length
    ? placements.map((placement) => ({
        category_slug: placement.category_slug ?? "",
        city_slug: placement.city_slug ?? "",
      }))
    : [{ category_slug: "", city_slug: "" }];
}

export default function ListingEditForm({
  listing,
  placements: initialPlacements,
  categories,
  cities,
  imageOptions,
}: {
  listing: AdminListing;
  placements: AdminListingPlacement[];
  categories: AdminCategory[];
  cities: AdminCity[];
  imageOptions: string[];
}) {
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
  const [placements, setPlacements] = useState<PlacementDraft[]>(() => placementDrafts(initialPlacements));

  const [imageUrl, setImageUrl] = useState(s(listing.image_url));
  const [imagePreviewFailed, setImagePreviewFailed] = useState(false);

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

  function updatePlacement(index: number, key: keyof PlacementDraft, value: string) {
    setPlacements((items) => items.map((item, i) => i === index ? { ...item, [key]: value } : item));
  }

  function addPlacement() {
    setPlacements((items) => [...items, { category_slug: "", city_slug: "" }]);
  }

  function removePlacement(index: number) {
    setPlacements((items) => items.length === 1 ? [{ category_slug: "", city_slug: "" }] : items.filter((_, i) => i !== index));
  }

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
          placements: placements
            .map((placement) => ({
              category_slug: placement.category_slug || null,
              city_slug: placement.city_slug || null,
            }))
            .filter((placement) => placement.category_slug || placement.city_slug),
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

  return (
    <form onSubmit={handleSave}>
      {/* Toast */}
      {toast && (
        <div
          className={`a-toast a-toast--${toast.type === "ok" ? "success" : "danger"}`}
          role="status"
          aria-live="polite"
        >
          {toast.msg}
        </div>
      )}

      <div className="a-inline-fc6c1a9a" >
        {/* Left column — main content */}
        <div className="a-inline-754940be" >

          {/* Core content */}
          <div className="a-card">
            <div className="a-card-body a-inline-b55e6460" >
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
            <div className="a-card-body a-inline-b55e6460" >
              <SectionHeader title="Contact" />
              <Field label="Contact Name">
                <TextInput name="contact_name" value={contactName} onChange={setContactName} />
              </Field>
              <div className="a-form-grid a-form-grid--two">
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
            <div className="a-card-body a-inline-b55e6460" >
              <SectionHeader title="Location" />
              <Field label="Address / Suburb">
                <TextInput name="location" value={location} onChange={setLocation} placeholder="Street, suburb" />
              </Field>
              <div className="a-form-grid a-form-grid--two">
                <Field label="City">
                  <TextInput name="location_city" value={locationCity} onChange={setLocationCity} placeholder="Sydney" />
                </Field>
                <Field label="State">
                  <TextInput name="location_state" value={locationState} onChange={setLocationState} placeholder="NSW" />
                </Field>
              </div>
            </div>
          </div>

          {/* Placements */}
          <div className="a-card">
            <div className="a-card-body a-inline-a73cc8f2" >
              <SectionHeader title="Categories & Cities" />
              <p className="a-inline-7b35a585" >
                These placements control which category and city pages this listing appears on.
              </p>
              {placements.map((placement, index) => (
                <div
                  key={index}
                  className="a-inline-342ab72f" 
                >
                  <Field label={index === 0 ? "Category" : "Category"}>
                    <select
                      value={placement.category_slug}
                      onChange={(e) => updatePlacement(index, "category_slug", e.target.value)}
                      className="a-input a-form-select"
                    >
                      <option value="">No category</option>
                      {categories.map((category) => (
                        <option key={category.slug} value={category.slug}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label={index === 0 ? "City" : "City"}>
                    <select
                      value={placement.city_slug}
                      onChange={(e) => updatePlacement(index, "city_slug", e.target.value)}
                      className="a-input a-form-select"
                    >
                      <option value="">All / no city</option>
                      {cities.map((city) => (
                        <option key={city.slug} value={city.slug}>
                          {city.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <button
                    type="button"
                    className="a-btn a-btn-ghost a-inline-03f51d3c"
                    onClick={() => removePlacement(index)}
                    
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" className="a-btn a-btn-ghost a-inline-0435c1c7" onClick={addPlacement} >
                + Add category / city
              </button>
            </div>
          </div>

          {/* Social */}
          <div className="a-card">
            <div className="a-card-body a-inline-b55e6460" >
              <SectionHeader title="Social Links" />
              <div className="a-form-grid a-form-grid--two">
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
            <div className="a-card-body a-inline-b55e6460" >
              <SectionHeader title="Additional" />
              <div className="a-form-grid a-form-grid--two">
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
        <div className="a-inline-cdbcc3e6" >

          {/* Save / actions */}
          <div className="a-card">
            <div className="a-card-body a-inline-ba80689b" >
              <button type="submit" className="a-btn a-btn-primary a-inline-aef14f3c" disabled={saving} >
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <a
                href={`/listing/${title.toLowerCase().replace(/\s+/g, "-")}-${id}`}
                target="_blank"
                rel="noopener"
                className="a-btn a-btn-ghost a-inline-25c9cb5c"
                
              >
                View Live ↗
              </a>
              <button
                type="button"
                onClick={() => setShowDelete(true)}
                className="a-inline-39231d77" 
              >
                Delete Listing
              </button>
            </div>
          </div>

          {/* Status & type */}
          <div className="a-card">
            <div className="a-card-body a-inline-b55e6460" >
              <SectionHeader title="Settings" />
              <Field label="Status">
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="a-input a-form-select">
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Listing Type">
                <select value={listingType} onChange={(e) => setListingType(e.target.value)} className="a-input a-form-select">
                  {TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <label className="a-inline-2cac9f62" >
                <input
                  type="checkbox"
                  checked={unclaimed}
                  onChange={(e) => setUnclaimed(e.target.checked)}
                  className="a-inline-62b6727b" 
                />
                Unclaimed listing
              </label>
            </div>
          </div>

          {/* Image */}
          <div className="a-card">
            <div className="a-card-body a-inline-060e799f" >
              <SectionHeader title="Image" />
              {imageUrl && !imagePreviewFailed && (
                <img
                  src={imageUrl}
                  alt=""
                  className="a-inline-4dbd6f1e" 
                  onError={() => setImagePreviewFailed(true)}
                />
              )}
              <Field label="Image URL">
                <TextInput
                  name="image_url"
                  value={imageUrl}
                  onChange={(value) => {
                    setImageUrl(value);
                    setImagePreviewFailed(false);
                  }}
                  placeholder="https://…"
                />
              </Field>
              {imageOptions.length > 0 && (
                <Field label="Choose from image library">
                  <select
                    value={imageOptions.includes(imageUrl) ? imageUrl : ""}
                    onChange={(e) => {
                      if (e.target.value) setImageUrl(e.target.value);
                    }}
                    className="a-input a-form-select"
                  >
                    <option value="">Select existing image...</option>
                    {imageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
              )}
            </div>
          </div>

          {/* Meta info */}
          <div className="a-card">
            <div className="a-card-body a-inline-ba80689b" >
              <SectionHeader title="Meta" />
              {[
                ["ID", String(id)],
                ["Business", listing.business_name ?? `#${listing.business_id ?? "—"}`],
                ["Confidence", listing.confidence_score != null ? `${listing.confidence_score}%` : "—"],
                ["Source", listing.source_file ?? "—"],
                ["Created", fmtDate(listing.created_at)],
                ["Expires", fmtDate(listing.expires_at)],
              ].map(([k, v]) => (
                <div key={k} className="a-inline-51015687" >
                  <span className="a-inline-22dfbba3" >{k}</span>
                  <span className="a-inline-ad45e838" >{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDelete && (
        <div
          className="a-inline-e487d544" 
          onClick={() => setShowDelete(false)}
        >
          <div
            className="a-inline-5d69d044" 
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="a-inline-9b09ab50" >
              Delete listing #{id}?
            </h2>
            <p className="a-inline-78b3742a" >
              This soft-deletes the listing. It can be recovered from the database.
            </p>
            <Field label="Reason (optional)">
              <TextInput name="delete_reason" value={deleteReason} onChange={setDeleteReason} placeholder="e.g. Duplicate, spam, outdated" />
            </Field>
            <div className="a-inline-c1fdbf4c" >
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="a-inline-fcf28a78" 
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
              <button
                type="button"
                onClick={() => setShowDelete(false)}
                className="a-btn a-btn-ghost a-inline-19f5d7de"
                
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

