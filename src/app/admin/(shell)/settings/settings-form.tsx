"use client";
import { useState } from "react";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--a-ink-muted)", marginBottom: "4px" }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: "11px", color: "var(--a-ink-muted)", marginTop: "4px" }}>{hint}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="admin-card" style={{ marginBottom: "24px" }}>
      <h2 style={{ fontSize: "14px", fontWeight: 700, color: "var(--a-ink)", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid var(--a-border)" }}>{title}</h2>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block", width: "100%", height: "36px", padding: "0 10px",
  border: "1px solid var(--a-border)", borderRadius: "6px",
  fontSize: "13px", color: "var(--a-ink)", background: "var(--a-bg)",
  boxSizing: "border-box",
};

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
    <div style={{ maxWidth: "560px" }}>
      <Section title="Email Notifications">
        <Field label="Admin notification email" hint="Where to send new subscriber notifications. Leave blank to disable.">
          <input style={inputStyle} type="email" value={notifyEmail} onChange={e => setNotifyEmail(e.target.value)} placeholder="admin@yoursite.com" />
        </Field>
        <Field label="Sender name" hint="Shown as the 'From' name on emails sent to subscribers.">
          <input style={inputStyle} type="text" value={fromName} onChange={e => setFromName(e.target.value)} />
        </Field>
        <Field label="Sender email" hint="Must be a verified domain in Resend. Requires RESEND_API_KEY env var.">
          <input style={inputStyle} type="email" value={fromEmail} onChange={e => setFromEmail(e.target.value)} />
        </Field>
      </Section>

      <Section title="Environment variables required">
        <div style={{ fontSize: "12px", color: "var(--a-ink-muted)", lineHeight: "1.8", fontFamily: "monospace" }}>
          <div><strong style={{ color: "var(--a-ink)" }}>RESEND_API_KEY</strong> — welcome email to subscribers</div>
          <div><strong style={{ color: "var(--a-ink)" }}>TURNSTILE_SECRET_KEY</strong> — bot protection on subscribe form</div>
          <div><strong style={{ color: "var(--a-ink)" }}>NEXT_PUBLIC_TURNSTILE_SITE_KEY</strong> — client-side Turnstile widget</div>
        </div>
        <p style={{ fontSize: "11px", color: "var(--a-ink-muted)", marginTop: "12px" }}>
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
