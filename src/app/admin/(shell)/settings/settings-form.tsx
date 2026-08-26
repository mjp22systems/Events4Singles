"use client";
import { useState } from "react";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="a-inline-0e1f3f8f" >
      <label className="a-inline-8cc84cfe" >{label}</label>
      {children}
      {hint && <p className="a-inline-2db9c72f" >{hint}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="admin-card a-inline-1be0b80a" >
      <h2 className="a-inline-f4d7418a" >{title}</h2>
      {children}
    </div>
  );
}

export default function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [notifyEmail, setNotifyEmail] = useState(settings.notification_email ?? "");
  const [fromName, setFromName] = useState(settings.subscribe_from_name ?? "Events4Singles");
  const [fromEmail, setFromEmail] = useState(settings.subscribe_from_email ?? "hello@events4singles.com");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/admin/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notification_email: notifyEmail,
          subscribe_from_name: fromName,
          subscribe_from_email: fromEmail,
        }),
      });
      setStatus(res.ok ? "saved" : "error");
      if (res.ok) setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="a-inline-1d3d1108" >
      <Section title="Email Notifications">
        <Field label="Admin notification email" hint="Where to send new subscriber notifications. Leave blank to disable.">
          <input className="a-settings-input" type="email" value={notifyEmail} onChange={e => setNotifyEmail(e.target.value)} placeholder="admin@yoursite.com" />
        </Field>
        <Field label="Sender name" hint="Shown as the 'From' name on emails sent to subscribers.">
          <input className="a-settings-input" type="text" value={fromName} onChange={e => setFromName(e.target.value)} />
        </Field>
        <Field label="Sender email" hint="Must be a verified domain in Resend. Requires RESEND_API_KEY env var.">
          <input className="a-settings-input" type="email" value={fromEmail} onChange={e => setFromEmail(e.target.value)} />
        </Field>
      </Section>

      <Section title="Environment variables required">
        <div className="a-inline-032e5c61" >
          <div><strong className="a-inline-7a608131" >RESEND_API_KEY</strong> — welcome email to subscribers</div>
          <div><strong className="a-inline-7a608131" >TURNSTILE_SECRET_KEY</strong> — bot protection on subscribe form</div>
          <div><strong className="a-inline-7a608131" >NEXT_PUBLIC_TURNSTILE_SITE_KEY</strong> — client-side Turnstile widget</div>
        </div>
        <p className="a-inline-bf86732a" >
          Set these in your Cloudflare Worker environment variables (Dashboard → Workers → events4singles-v2 → Settings → Variables).
          Resend API keys at resend.com. Turnstile keys at dash.cloudflare.com → Turnstile.
        </p>
      </Section>

      <button
        className="admin-btn admin-btn--primary"
        onClick={save}
        disabled={status === "saving"}
      >
        {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : status === "error" ? "Error — retry" : "Save settings"}
      </button>
    </div>
  );
}
