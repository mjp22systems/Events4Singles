"use client";

import { useRef, useState, useTransition } from "react";

export default function ProfileForm({
  displayName,
  portalEmail,
  billingEmail,
  saveProfile,
}: {
  displayName: string;
  portalEmail: string;
  billingEmail: string;
  saveProfile: (formData: FormData) => Promise<void>;
}) {
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(formRef.current!);
    startTransition(async () => {
      await saveProfile(fd);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="p-form-grid">
        <div className="p-field">
          <label className="p-label">Name</label>
          <input
            className="p-input"
            type="text"
            name="display_name"
            defaultValue={displayName}
            placeholder="Your name"
          />
        </div>
        <div className="p-field">
          <label className="p-label">Email address</label>
          <input
            className="p-input"
            type="email"
            name="portal_email"
            defaultValue={portalEmail}
            placeholder="you@company.com"
          />
        </div>
        <div className="p-field">
          <label className="p-label">Billing email</label>
          <input
            className="p-input"
            type="email"
            name="billing_email"
            defaultValue={billingEmail}
            placeholder="billing@yourcompany.com"
          />
        </div>
      </div>
      <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
        <button className="p-btn p-btn--primary" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </button>
        {saved && <span style={{ color: "var(--p-teal)", fontSize: "13px" }}>Saved</span>}
      </div>
    </form>
  );
}
