"use client";

import { useRef, useState, useTransition } from "react";

export default function ProfileForm({
  billingEmail,
  saveProfile,
}: {
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
      <div className="p-field">
        <label className="p-label">Billing email</label>
        <input
          className="p-input"
          type="email"
          name="billing_email"
          defaultValue={billingEmail}
          placeholder="billing@yourcompany.com"
          style={{ marginTop: "6px" }}
        />
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
