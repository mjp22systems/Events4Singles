"use client";

import { useState, useTransition } from "react";
import Modal from "@/components/portal/modal";

const CITIES = ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra"];
const CATEGORIES = ["Speed Dating", "Dinner Parties", "Dance Classes", "Social Clubs", "Life Coaches", "Adventure"];

export default function ListingRequestModal({
  onClose,
  requestListing,
}: {
  onClose: () => void;
  requestListing: (fd: FormData) => Promise<void>;
}) {
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await requestListing(fd);
      setDone(true);
    });
  }

  return (
    <Modal title="Request a listing" onClose={onClose}>
      <div className="p-modal__body">
        {done ? (
          <div className="p-success-banner">
            Request sent! We&apos;ll review your details and be in touch within 1 business day.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-form-group">
              <label className="p-label">Business name *</label>
              <input className="p-input" name="business_name" required placeholder="Your business or event company name" />
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
                <label className="p-label">Category *</label>
                <select className="p-select" name="category" required>
                  <option value="">Select category…</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="p-form-group">
              <label className="p-label">Website</label>
              <input className="p-input" name="website" type="url" placeholder="https://yourwebsite.com.au" />
            </div>
            <div className="p-form-row">
              <div className="p-form-group">
                <label className="p-label">Contact email *</label>
                <input className="p-input" name="contact_email" type="email" required placeholder="you@example.com" />
              </div>
              <div className="p-form-group">
                <label className="p-label">Phone</label>
                <input className="p-input" name="phone" type="tel" placeholder="04xx xxx xxx" />
              </div>
            </div>
            <div className="p-form-group">
              <label className="p-label">Additional info</label>
              <textarea className="p-textarea" name="message" placeholder="Anything else we should know about your business…" />
            </div>
            <div className="p-modal__footer p-inline-19683953" >
              <button type="button" className="p-btn" onClick={onClose}>Cancel</button>
              <button type="submit" className="p-btn p-btn--primary" disabled={pending}>
                {pending ? "Sending…" : "Submit request"}
              </button>
            </div>
          </form>
        )}
        {done && (
          <div className="p-inline-f17b7ea3" >
            <button className="p-btn" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </Modal>
  );
}
