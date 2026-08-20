"use client";

import { useRef, useTransition } from "react";

const CITIES = ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra"];
const CATEGORIES = ["Speed Dating", "Dinner Parties", "Dance Classes", "Social Clubs", "Life Coaches", "Adventure"];

export default function EventCreateForm({
  createEvent,
  onCancel,
}: {
  createEvent: (fd: FormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(formRef.current!);
    startTransition(() => createEvent(fd));
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="p-modal__body">
        <div className="p-form-group">
          <label className="p-label">Event title *</label>
          <input className="p-input" name="title" required placeholder="e.g. Sydney Speed Dating — Ages 30–45" />
        </div>
        <div className="p-form-row">
          <div className="p-form-group">
            <label className="p-label">City *</label>
            <select className="p-select" name="city" required>
              <option value="">Select city…</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="p-form-group">
            <label className="p-label">Category</label>
            <select className="p-select" name="category">
              <option value="">Select…</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="p-form-row">
          <div className="p-form-group">
            <label className="p-label">Start date & time *</label>
            <input className="p-input" name="starts_at" type="datetime-local" required />
          </div>
          <div className="p-form-group">
            <label className="p-label">End time</label>
            <input className="p-input" name="ends_at" type="datetime-local" />
          </div>
        </div>
        <div className="p-form-row">
          <div className="p-form-group">
            <label className="p-label">Venue name</label>
            <input className="p-input" name="venue_name" placeholder="e.g. The Ivy Bar" />
          </div>
          <div className="p-form-group">
            <label className="p-label">Suburb</label>
            <input className="p-input" name="suburb" placeholder="e.g. CBD" />
          </div>
        </div>
        <div className="p-form-group">
          <label className="p-label">Address</label>
          <input className="p-input" name="address" placeholder="Street address" />
        </div>
        <div className="p-form-row">
          <div className="p-form-group">
            <label className="p-label">Ticket price (AUD)</label>
            <input className="p-input" name="price_min" type="number" min="0" step="0.01" placeholder="0 = free" />
          </div>
          <div className="p-form-group">
            <label className="p-label">Ticket / booking URL</label>
            <input className="p-input" name="ticket_url" type="url" placeholder="https://humanitix.com/…" />
          </div>
        </div>
        <div className="p-form-group">
          <label className="p-label">Description</label>
          <textarea className="p-textarea" name="description" placeholder="Tell attendees what to expect…" />
        </div>
        <p className="p-muted" style={{ fontSize: "12px" }}>Events are reviewed within 1 business day before appearing on the calendar.</p>
      </div>
      <div className="p-modal__footer">
        <button type="button" className="p-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="p-btn p-btn--primary" disabled={pending}>
          {pending ? "Submitting…" : "Submit event"}
        </button>
      </div>
    </form>
  );
}
