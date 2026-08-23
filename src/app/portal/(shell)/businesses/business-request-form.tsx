"use client";

import { useRef, useState, useTransition } from "react";

export default function BusinessRequestForm({
  requestBusiness,
}: {
  requestBusiness: (formData: FormData) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(formRef.current!);
    startTransition(async () => {
      await requestBusiness(fd);
      formRef.current?.reset();
      setSent(true);
      setOpen(false);
    });
  }

  return (
    <>
      <button className="p-btn p-btn--primary" type="button" onClick={() => setOpen(true)}>
        + Add business
      </button>
      {sent && <span style={{ color: "var(--p-teal)", fontSize: "13px" }}>Request sent</span>}

      {open && (
        <div className="p-modal-backdrop" onClick={() => setOpen(false)}>
          <div className="p-modal" onClick={(e) => e.stopPropagation()}>
            <div className="p-modal__header">
              <h2>Add business</h2>
              <button className="p-modal__close" type="button" onClick={() => setOpen(false)}>x</button>
            </div>
            <form ref={formRef} onSubmit={handleSubmit}>
              <div className="p-modal__body">
                <div className="p-form-group">
                  <label className="p-label">Business name *</label>
                  <input className="p-input" name="business_name" required />
                </div>
                <div className="p-form-row">
                  <div className="p-form-group">
                    <label className="p-label">Website</label>
                    <input className="p-input" name="website" type="url" placeholder="https://..." />
                  </div>
                  <div className="p-form-group">
                    <label className="p-label">City</label>
                    <input className="p-input" name="city" />
                  </div>
                </div>
                <div className="p-form-row">
                  <div className="p-form-group">
                    <label className="p-label">Contact email</label>
                    <input className="p-input" name="contact_email" type="email" />
                  </div>
                  <div className="p-form-group">
                    <label className="p-label">Phone</label>
                    <input className="p-input" name="phone" />
                  </div>
                </div>
                <div className="p-form-group">
                  <label className="p-label">Notes</label>
                  <textarea className="p-textarea" name="message" placeholder="Tell us whether this is a new business, an existing listing to claim, or another brand you manage." />
                </div>
                <p className="p-muted" style={{ fontSize: "12px" }}>
                  We will verify the request before linking the business to your portal login.
                </p>
              </div>
              <div className="p-modal__footer">
                <button className="p-btn" type="button" onClick={() => setOpen(false)}>Cancel</button>
                <button className="p-btn p-btn--primary" type="submit" disabled={pending}>
                  {pending ? "Sending..." : "Send request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
