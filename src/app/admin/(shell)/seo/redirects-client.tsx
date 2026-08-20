"use client";

import { useState } from "react";
import type { AdminRedirect } from "@/lib/admin-db";

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });
}

export default function RedirectsClient({ initial }: { initial: AdminRedirect[] }) {
  const [redirects, setRedirects] = useState(initial);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!from.trim() || !to.trim()) { setError("Both fields required"); return; }
    setSaving(true);
    try {
      const res = await fetch("/admin/api/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from_path: from.trim(), to_path: to.trim() }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) { setError(data.error ?? "Failed to save"); return; }
      const refreshed = await fetch("/admin/api/redirects").then(r => r.json()) as AdminRedirect[];
      setRedirects(refreshed);
      setFrom("");
      setTo("");
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this redirect?")) return;
    const res = await fetch(`/admin/api/redirects/${id}`, { method: "DELETE" });
    if (res.ok) setRedirects(r => r.filter(x => x.id !== id));
  }

  return (
    <>
      <h1 className="a-page-title">SEO Redirects</h1>

      <div className="a-card" style={{ marginBottom: "20px" }}>
        <div className="a-card-header">
          <span className="a-card-title">Add redirect</span>
        </div>
        <div className="a-card-body">
          <form onSubmit={handleAdd} style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: "1 1 180px" }}>
              <label className="a-label">From path</label>
              <input className="a-input" type="text" placeholder="/old-slug" value={from} onChange={e => setFrom(e.target.value)} />
            </div>
            <div style={{ flex: "1 1 180px" }}>
              <label className="a-label">To path</label>
              <input className="a-input" type="text" placeholder="/new-slug" value={to} onChange={e => setTo(e.target.value)} />
            </div>
            <div>
              <button className="a-btn a-btn-primary" type="submit" disabled={saving}>
                {saving ? "Saving…" : "Add redirect"}
              </button>
            </div>
          </form>
          {error && (
            <p style={{ color: "var(--a-danger)", marginTop: "8px", fontSize: "13px" }}>{error}</p>
          )}
          <p style={{ marginTop: "10px", fontSize: "12px", color: "var(--a-ink-muted)" }}>
            Serves as a permanent 301. Takes effect immediately — no redeploy needed.
          </p>
        </div>
      </div>

      <div className="a-card" style={{ marginBottom: "20px" }}>
        <div className="a-card-header">
          <span className="a-card-title">Active redirects ({redirects.length})</span>
        </div>
        {redirects.length === 0 ? (
          <div className="a-card-body">
            <p style={{ color: "var(--a-ink-muted)", fontSize: "13px" }}>No redirects configured.</p>
          </div>
        ) : (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Added</th>
                  <th style={{ textAlign: "right" }}></th>
                </tr>
              </thead>
              <tbody>
                {redirects.map(r => (
                  <tr key={r.id}>
                    <td><code style={{ fontSize: "12px" }}>{r.from_path}</code></td>
                    <td><code style={{ fontSize: "12px" }}>{r.to_path}</code></td>
                    <td style={{ color: "var(--a-ink-muted)", fontSize: "12px", whiteSpace: "nowrap" }}>
                      {r.created_at ? formatDate(r.created_at) : "—"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="a-btn a-btn-danger"
                        onClick={() => handleDelete(r.id)}
                        style={{ fontSize: "12px", padding: "4px 10px", minHeight: "auto" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="a-card">
        <div className="a-card-header">
          <span className="a-card-title">Static redirects (next.config.ts)</span>
        </div>
        <div className="a-card-body" style={{ paddingBottom: "4px" }}>
          <p style={{ fontSize: "12px", color: "var(--a-ink-muted)", marginBottom: "12px" }}>
            Hardcoded — require a redeploy to change. Edit <code>website/next.config.ts</code>.
          </p>
        </div>
        <div className="a-table-wrap">
          <table className="a-table">
            <thead>
              <tr><th>From</th><th>To</th><th>Type</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code style={{ fontSize: "12px" }}>/locations</code></td>
                <td><code style={{ fontSize: "12px" }}>/cities</code></td>
                <td style={{ color: "var(--a-ink-muted)", fontSize: "12px" }}>Permanent</td>
              </tr>
              <tr>
                <td><code style={{ fontSize: "12px" }}>/privacy</code></td>
                <td><code style={{ fontSize: "12px" }}>/privacy-policy</code></td>
                <td style={{ color: "var(--a-ink-muted)", fontSize: "12px" }}>Permanent</td>
              </tr>
              <tr>
                <td><code style={{ fontSize: "12px" }}>/terms</code></td>
                <td><code style={{ fontSize: "12px" }}>/terms-and-conditions</code></td>
                <td style={{ color: "var(--a-ink-muted)", fontSize: "12px" }}>Permanent</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
