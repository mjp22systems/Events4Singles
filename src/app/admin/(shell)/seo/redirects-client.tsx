"use client";

import { useState } from "react";
import type { AdminRedirect } from "@/lib/admin-db";
import type { NotFoundHit } from "@/lib/not-found";

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });
}

export default function RedirectsClient({
  initial,
  notFoundHits,
}: {
  initial: AdminRedirect[];
  notFoundHits: NotFoundHit[];
}) {
  const [redirects, setRedirects] = useState(initial);
  const [misses, setMisses] = useState(notFoundHits);
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
      const submittedFrom = from.trim();
      const res = await fetch("/admin/api/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from_path: submittedFrom, to_path: to.trim() }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) { setError(data.error ?? "Failed to save"); return; }
      const refreshed = await fetch("/admin/api/redirects").then(r => r.json()) as AdminRedirect[];
      setRedirects(refreshed);
      setMisses((items) => items.filter((item) => item.path !== submittedFrom));
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
      <h1 className="a-page-title">Redirects</h1>

      <div className="a-card a-inline-e5cf13bb" >
        <div className="a-card-header">
          <span className="a-card-title">404 redirect candidates ({misses.length})</span>
        </div>
        {misses.length === 0 ? (
          <div className="a-card-body">
            <p className="a-inline-24fc8284" >No unresolved 404 hits logged yet.</p>
          </div>
        ) : (
          <div className="a-table-wrap">
            <table className="a-table a-table--single-line">
              <thead>
                <tr>
                  <th>Missed URL</th>
                  <th>Hits</th>
                  <th>Last seen</th>
                  <th>Referrer</th>
                  <th className="a-inline-ff9d652c" ></th>
                </tr>
              </thead>
              <tbody>
                {misses.map((hit) => (
                  <tr key={hit.id}>
                    <td><code className="a-inline-d4d63c8b" >{hit.path}</code></td>
                    <td>{hit.hit_count}</td>
                    <td className="a-inline-dc6a5919" >
                      {hit.last_seen ? formatDate(hit.last_seen) : "—"}
                    </td>
                    <td className="a-inline-9df4cd55" >
                      {hit.referrer || "Direct / unknown"}
                    </td>
                    <td className="a-inline-ff9d652c" >
                      <button
                        className="a-btn a-inline-fed8595c"
                        type="button"
                        onClick={() => {
                          setFrom(hit.path);
                          setTo("");
                        }}
                        
                      >
                        Create redirect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className={`a-card-body${misses.length ? " a-card-body--compact-top" : ""}`}>
          <p className="a-inline-691df809" >
            These are public 404 hits grouped by normalised path. Add a redirect when a missed URL is getting repeated traffic.
          </p>
        </div>
      </div>

      <div className="a-card a-inline-e5cf13bb" >
        <div className="a-card-header">
          <span className="a-card-title">Add redirect</span>
        </div>
        <div className="a-card-body">
          <form onSubmit={handleAdd} className="a-inline-59fba262" >
            <div className="a-inline-5e319852" >
              <label className="a-label">From path</label>
              <input className="a-input" type="text" placeholder="/old-slug" value={from} onChange={e => setFrom(e.target.value)} />
            </div>
            <div className="a-inline-5e319852" >
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
            <p className="a-inline-2d7b62eb" >{error}</p>
          )}
          <p className="a-inline-f5d522c6" >
            Serves as a permanent 301. Takes effect immediately — no redeploy needed.
          </p>
        </div>
      </div>

      <div className="a-card a-inline-e5cf13bb" >
        <div className="a-card-header">
          <span className="a-card-title">Active redirects ({redirects.length})</span>
        </div>
        {redirects.length === 0 ? (
          <div className="a-card-body">
            <p className="a-inline-24fc8284" >No redirects configured.</p>
          </div>
        ) : (
          <div className="a-table-wrap">
            <table className="a-table a-table--single-line">
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Added</th>
                  <th className="a-inline-ff9d652c" ></th>
                </tr>
              </thead>
              <tbody>
                {redirects.map(r => (
                  <tr key={r.id}>
                    <td><code className="a-inline-d4d63c8b" >{r.from_path}</code></td>
                    <td><code className="a-inline-d4d63c8b" >{r.to_path}</code></td>
                    <td className="a-inline-dc6a5919" >
                      {r.created_at ? formatDate(r.created_at) : "—"}
                    </td>
                    <td className="a-inline-ff9d652c" >
                      <button
                        className="a-btn a-btn-danger a-inline-fed8595c"
                        onClick={() => handleDelete(r.id)}
                        
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
        <div className="a-card-body a-inline-b2abf013" >
          <p className="a-inline-c153a8f9" >
            Hardcoded — require a redeploy to change. Edit <code>website/next.config.ts</code>.
          </p>
        </div>
        <div className="a-table-wrap">
          <table className="a-table a-table--single-line">
            <thead>
              <tr><th>From</th><th>To</th><th>Type</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="a-inline-d4d63c8b" >/locations</code></td>
                <td><code className="a-inline-d4d63c8b" >/cities</code></td>
                <td className="a-muted-small" >Permanent</td>
              </tr>
              <tr>
                <td><code className="a-inline-d4d63c8b" >/privacy</code></td>
                <td><code className="a-inline-d4d63c8b" >/privacy-policy</code></td>
                <td className="a-muted-small" >Permanent</td>
              </tr>
              <tr>
                <td><code className="a-inline-d4d63c8b" >/terms</code></td>
                <td><code className="a-inline-d4d63c8b" >/terms-and-conditions</code></td>
                <td className="a-muted-small" >Permanent</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
