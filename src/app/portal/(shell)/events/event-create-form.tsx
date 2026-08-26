"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import type { Category, City } from "@/lib/types";
import type { PortalEvent, PortalMediaAsset } from "@/lib/portal-db";

function datetimeValue(value: string | null | undefined) {
  return value ? value.slice(0, 16) : "";
}

function splitDateTime(value: string | null | undefined) {
  const localValue = datetimeValue(value);
  if (!localValue) return { date: "", time: "" };
  const [date, time] = localValue.split("T");
  return { date: date ?? "", time: time ?? "" };
}

function combineDateTime(date: FormDataEntryValue | null, time: FormDataEntryValue | null) {
  const dateValue = String(date ?? "").trim();
  const timeValue = String(time ?? "").trim();
  if (!dateValue || !timeValue) return "";
  return `${dateValue}T${timeValue}`;
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
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function sourceLabel(source: string | null | undefined) {
  if (!source) return "Source page";
  const labels: Record<string, string> = {
    eventbrite: "Eventbrite",
    meetup: "Meetup",
    ical: "iCal",
    humanitix: "Humanitix",
    trybooking: "TryBooking",
    advertiser: "Advertiser",
    admin: "E4S",
  };
  return labels[source] ?? source.replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function EventCreateForm({
  event,
  mediaAssets,
  cities,
  categories,
  submitLabel = "Submit event",
  createEvent,
  onCancel,
}: {
  event?: PortalEvent | null;
  mediaAssets: PortalMediaAsset[];
  cities: City[];
  categories: Category[];
  submitLabel?: string;
  createEvent: (fd: FormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState(event?.image_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [localAssets, setLocalAssets] = useState(mediaAssets);
  const initialStart = splitDateTime(event?.starts_at);
  const initialEnd = splitDateTime(event?.ends_at);
  const hasEventbrite = Boolean(event?.push_url || event?.push_id);
  const hasSource = Boolean(event?.source_url);
  const sourceRegistrationLabel = event?.source === "meetup" ? "Meetup source page" : `${sourceLabel(event?.source)} source page`;
  const imageChoices = useMemo(() => {
    const seen = new Set<string>();
    return localAssets.filter((asset) => {
      if (!asset.public_url || seen.has(asset.public_url)) return false;
      seen.add(asset.public_url);
      return true;
    });
  }, [localAssets]);

  async function uploadImage(file: File) {
    setUploadError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("alt_text", event?.title ?? "");
      const res = await fetch("/api/portal/media", { method: "POST", body: fd });
      const data = await res.json() as { asset?: PortalMediaAsset; error?: string };
      if (!res.ok || !data.asset) throw new Error(data.error ?? "Upload failed");
      setLocalAssets((current) => [data.asset!, ...current]);
      setImageUrl(data.asset.public_url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(formRef.current!);
    const startsAt = combineDateTime(fd.get("start_date"), fd.get("start_time"));
    const endDate = fd.get("end_date") || fd.get("start_date");
    const endsAt = combineDateTime(endDate, fd.get("end_time"));
    fd.set("starts_at", startsAt);
    if (endsAt) fd.set("ends_at", endsAt);
    else fd.delete("ends_at");
    fd.set("description", plainDescriptionForEdit(String(fd.get("description") ?? "")));
    fd.set("image_url", imageUrl.trim());
    startTransition(() => createEvent(fd));
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="p-modal__body">
        {event && <input type="hidden" name="id" value={event.id} />}
        <div className="p-event-edit-grid">
          <div className="p-form-group p-event-edit-grid__full">
            <label className="p-label">Event title *</label>
            <input className="p-input" name="title" required defaultValue={event?.title ?? ""} placeholder="e.g. Sydney Speed Dating - Ages 30-45" />
          </div>
          <div className="p-form-group">
            <label className="p-label">City *</label>
            <select className="p-select" name="city" required defaultValue={event?.city ?? ""}>
              <option value="">Select city...</option>
              {cities.map((city) => <option key={city.slug} value={city.slug}>{city.label}</option>)}
            </select>
          </div>
          <div className="p-form-group">
            <label className="p-label">Category</label>
            <select className="p-select" name="category" defaultValue={event?.category ?? ""}>
              <option value="">Select...</option>
              {categories.map((category) => <option key={category.slug} value={category.slug}>{category.label}</option>)}
            </select>
          </div>
          <div className="p-form-group">
            <label className="p-label">Registration destination</label>
            <select className="p-select" name="registration_mode" defaultValue={event?.registration_mode ?? "auto"}>
              <option value="auto">Auto - use best available link</option>
              {hasEventbrite && <option value="eventbrite">Eventbrite</option>}
              <option value="ticket">Ticket / booking URL</option>
              {hasSource && <option value="source">{sourceRegistrationLabel}</option>}
              <option value="contact">Contact organiser</option>
            </select>
          </div>
        </div>
        <div className="p-event-time-row">
          <div className="p-form-group">
            <label className="p-label">Start date *</label>
            <input className="p-input" name="start_date" type="date" required defaultValue={initialStart.date} />
          </div>
          <div className="p-form-group">
            <label className="p-label">Start time *</label>
            <input className="p-input" name="start_time" type="time" required defaultValue={initialStart.time} />
          </div>
          <div className="p-form-group">
            <label className="p-label">End date</label>
            <input className="p-input" name="end_date" type="date" defaultValue={initialEnd.date} />
          </div>
          <div className="p-form-group">
            <label className="p-label">End time</label>
            <input className="p-input" name="end_time" type="time" defaultValue={initialEnd.time} />
          </div>
        </div>
        <div className="p-event-edit-grid">
          <div className="p-form-group">
            <label className="p-label">Venue name</label>
            <input className="p-input" name="venue_name" defaultValue={event?.venue_name ?? ""} placeholder="e.g. The Ivy Bar" />
          </div>
          <div className="p-form-group">
            <label className="p-label">Suburb</label>
            <input className="p-input" name="suburb" defaultValue={event?.suburb ?? ""} placeholder="e.g. CBD" />
          </div>
          <div className="p-form-group p-event-edit-grid__full">
            <label className="p-label">Address</label>
            <input className="p-input" name="address" defaultValue={event?.address ?? ""} placeholder="Street address" />
          </div>
          <div className="p-form-group">
            <label className="p-label">Price from (AUD)</label>
            <input className="p-input" name="price_min" type="number" min="0" step="0.01" defaultValue={event?.price_min != null ? String(event.price_min / 100) : ""} placeholder="0 = free" />
          </div>
          <div className="p-form-group">
            <label className="p-label">Price to (AUD)</label>
            <input className="p-input" name="price_max" type="number" min="0" step="0.01" defaultValue={event?.price_max != null ? String(event.price_max / 100) : ""} placeholder="Optional" />
          </div>
          <div className="p-form-group p-event-edit-grid__full">
            <label className="p-label">Ticket / booking URL</label>
            <input className="p-input" name="ticket_url" type="url" defaultValue={event?.ticket_url ?? ""} placeholder="https://humanitix.com/..." />
          </div>
          <div className="p-form-group">
            <label className="p-label">Original source URL</label>
            <input className="p-input" name="source_url" type="url" defaultValue={event?.source_url ?? ""} placeholder="https://www.meetup.com/..." />
          </div>
        </div>
        <div className="p-form-group p-event-image-picker">
          <label className="p-label">Event image</label>
          <input type="hidden" name="image_url" value={imageUrl} />
          <div className="p-event-image-picker__layout">
            <div className="p-event-image-picker__preview">
              {imageUrl ? (
                <img src={imageUrl} alt="" />
              ) : (
                <span>No image selected</span>
              )}
            </div>
            <div className="p-event-image-picker__controls">
              <div className="p-event-image-picker__buttons">
                <input
                  ref={fileInputRef}
                  className="p-visually-hidden"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void uploadImage(file);
                  }}
                />
                <button type="button" className="p-btn p-btn--compact" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
                  {uploading ? "Uploading..." : "Upload image"}
                </button>
                {imageUrl && <button type="button" className="p-btn p-btn--compact" onClick={() => setImageUrl("")}>Clear</button>}
              </div>
              <input
                className="p-input"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste image URL or choose below"
              />
              {uploadError && <p className="p-form-error">{uploadError}</p>}
            </div>
          </div>
          {imageChoices.length > 0 && (
            <div className="p-event-image-pool" aria-label="Previously uploaded images">
              {imageChoices.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  className={`p-event-image-pool__item${asset.public_url === imageUrl ? " is-selected" : ""}`}
                  title={asset.filename}
                  onClick={() => setImageUrl(asset.public_url)}
                >
                  <img src={asset.public_url} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="p-form-group p-event-description-field">
          <label className="p-label">Description</label>
          <textarea className="p-textarea p-textarea--event-description" name="description" defaultValue={plainDescriptionForEdit(event?.description)} placeholder="Tell attendees what to expect..." />
        </div>
        <p className="p-muted p-inline-c0e576d8" >Events are reviewed within 1 business day before appearing on the calendar.</p>
      </div>
      <div className="p-modal__footer">
        <button type="button" className="p-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="p-btn p-btn--primary" disabled={pending}>
          {pending ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
