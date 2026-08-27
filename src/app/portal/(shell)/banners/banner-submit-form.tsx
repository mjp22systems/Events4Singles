"use client";

import { useRef, useState, useTransition } from "react";

export default function BannerSubmitForm({
  submitBanner,
  onDone,
}: {
  submitBanner: (fd: FormData) => Promise<void>;
  onDone: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(formRef.current!);
    startTransition(async () => {
      await submitBanner(fd);
      setDone(true);
    });
  }

  if (done) {
    return (
      <div className="p-modal__body">
        <div className="p-success-banner">Banner submitted for review. We&apos;ll approve it within 1 business day.</div>
        <div className="p-inline-f17b7ea3" >
          <button className="p-btn" onClick={onDone}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="p-modal__body">
        <div className="p-form-group">
          <label className="p-label">Banner image URL *</label>
          <input className="p-input" name="image_url" type="url" required placeholder="https://cdn.yoursite.com/banner.jpg" />
          <p className="p-muted p-inline-96c04b42" >180×120px JPG or PNG. Host it on your own CDN or image host, then paste the URL here.</p>
        </div>
        <div className="p-form-group">
          <label className="p-label">Click-through URL *</label>
          <input className="p-input" name="link_url" type="url" required placeholder="https://yourwebsite.com.au" />
        </div>
        <div className="p-form-group">
          <label className="p-label">Banner title (internal reference)</label>
          <input className="p-input" name="title" placeholder="e.g. Summer 2026 promo" />
        </div>
        <p className="p-muted p-text-small">Banners are reviewed within 1 business day before going live.</p>
      </div>
      <div className="p-modal__footer">
        <button type="button" className="p-btn" onClick={onDone}>Cancel</button>
        <button type="submit" className="p-btn p-btn--primary" disabled={pending}>
          {pending ? "Submitting…" : "Submit for review"}
        </button>
      </div>
    </form>
  );
}
