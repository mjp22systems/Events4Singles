"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

type Business = {
  id: number;
  name: string;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  advertiser_id: number | null;
  listing_count: number;
  merged_into_business_id: number | null;
};

type BizListing = {
  id: number;
  title: string;
  status: string | null;
  listing_type: string | null;
  location_city: string | null;
  unclaimed_flag: number;
  confidence_score: number | null;
};

type BizRef = { id: number; name: string; listing_count: number };

type Props = {
  business: Business;
  listings: BizListing[];
  allBusinesses: BizRef[];
};

const BADGE: Record<string, string> = {
  active: "a-badge-active",
  pending: "a-badge-pending",
  unclaimed: "a-badge-unclaimed",
  paused: "a-badge-paused",
  expired: "a-badge-expired",
  archived: "a-badge-paused",
  deleted: "a-badge-deleted",
};

export default function BusinessEditForm({ business, listings, allBusinesses }: Props) {
  const router = useRouter();

  const [name, setName] = useState(business.name);
  const [description, setDescription] = useState(business.description ?? "");
  const [website, setWebsite] = useState(business.website ?? "");
  const [logoUrl, setLogoUrl] = useState(business.logo_url ?? "");

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const [mergeSearch, setMergeSearch] = useState("");
  const [mergeTarget, setMergeTarget] = useState<BizRef | null>(null);
  const [showMergeConfirm, setShowMergeConfirm] = useState(false);
  const [merging, setMerging] = useState(false);

  const filteredBusinesses = useMemo(() => {
    if (!mergeSearch.trim()) return [];
    const q = mergeSearch.toLowerCase();
    return allBusinesses
      .filter((b) => b.id !== business.id && b.name.toLowerCase().includes(q))
      .slice(0, 10);
  }, [mergeSearch, allBusinesses, business.id]);

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/admin/api/businesses/${business.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, website, logo_url: logoUrl }),
      });
      showToast(res.ok ? "Saved" : "Save failed", res.ok);
    } catch {
      showToast("Error saving", false);
    } finally {
      setSaving(false);
    }
  }

  async function handleMerge() {
    if (!mergeTarget) return;
    setMerging(true);
    try {
      const res = await fetch(`/admin/api/businesses/${business.id}/merge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId: mergeTarget.id }),
      });
      if (res.ok) {
        router.push(`/admin/businesses/${mergeTarget.id}`);
      } else {
        showToast("Merge failed", false);
        setMerging(false);
        setShowMergeConfirm(false);
      }
    } catch {
      showToast("Error during merge", false);
      setMerging(false);
      setShowMergeConfirm(false);
    }
  }

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px", alignItems: "start" }}>
        <div>
          <form onSubmit={handleSave}>
            <div className="a-card" style={{ marginBottom: "20px" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--a-border)", fontWeight: 600, fontSize: "14px" }}>
                Business details
              </div>
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label className="a-label">Name</label>
                  <input className="a-input" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: "100%" }} />
                </div>
                <div>
                  <label className="a-label">Description</label>
                  <textarea className="a-input" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} style={{ width: "100%", resize: "vertical" }} />
                </div>
                <div>
                  <label className="a-label">Website</label>
                  <input className="a-input" value={website} onChange={(e) => setWebsite(e.target.value)} type="url" placeholder="https://" style={{ width: "100%" }} />
                </div>
                <div>
                  <label className="a-label">Logo URL</label>
                  <input className="a-input" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://" style={{ width: "100%" }} />
                </div>
              </div>
              <div style={{ padding: "12px 20px", borderTop: "1px solid var(--a-border)", display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className="a-btn a-btn-primary" disabled={saving}>
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          </form>

          <div className="a-card">
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--a-border)", fontWeight: 600, fontSize: "14px" }}>
              Listings
              <span style={{ marginLeft: "8px", fontWeight: 400, color: "var(--a-ink-muted)" }}>{listings.length}</span>
            </div>
            <div className="a-table-wrap">
              <table className="a-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>City</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "var(--a-ink-muted)" }}>
                        No listings
                      </td>
                    </tr>
                  ) : (
                    listings.map((l) => (
                      <tr key={l.id}>
                        <td style={{ color: "var(--a-ink-muted)", fontSize: "12px" }}>{l.id}</td>
                        <td style={{ fontWeight: 500 }}>{l.title}</td>
                        <td style={{ fontSize: "12px", color: "var(--a-ink-muted)" }}>{l.location_city ?? "—"}</td>
                        <td>
                          {l.unclaimed_flag ? (
                            <span className="a-badge a-badge-unclaimed">unclaimed</span>
                          ) : (
                            <span className={`a-badge ${BADGE[l.status ?? ""] ?? "a-badge-paused"}`}>
                              {l.status ?? "unknown"}
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <a
                            href={`/admin/listings/${l.id}`}
                            className="a-btn a-btn-ghost"
                            style={{ fontSize: "12px", padding: "4px 10px", minHeight: "auto" }}
                          >
                            Edit
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="a-card">
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--a-border)", fontWeight: 600, fontSize: "14px" }}>
              Info
            </div>
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--a-ink-muted)" }}>ID</span>
                <span style={{ fontFamily: "monospace" }}>#{business.id}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--a-ink-muted)" }}>Listings</span>
                <a href={`/admin/listings?business_id=${business.id}`} style={{ color: "var(--a-teal)" }}>
                  {business.listing_count}
                </a>
              </div>
              {business.advertiser_id && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--a-ink-muted)" }}>Advertiser</span>
                  <a href={`/admin/customers/${business.advertiser_id}`} style={{ color: "var(--a-teal)" }}>
                    #{business.advertiser_id}
                  </a>
                </div>
              )}
              {business.merged_into_business_id && (
                <div style={{ padding: "8px", background: "color-mix(in oklch, var(--a-warning) 12%, transparent)", borderRadius: "6px", fontSize: "12px", color: "var(--a-warning)" }}>
                  Merged into{" "}
                  <a href={`/admin/businesses/${business.merged_into_business_id}`} style={{ color: "var(--a-warning)" }}>
                    #{business.merged_into_business_id}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="a-card">
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--a-border)", fontWeight: 600, fontSize: "14px" }}>
              Merge into another
            </div>
            <div style={{ padding: "16px 20px" }}>
              <p style={{ fontSize: "12px", color: "var(--a-ink-muted)", margin: "0 0 12px" }}>
                All {listings.length} listing{listings.length !== 1 ? "s" : ""} will be moved to the target. This cannot be undone.
              </p>
              <input
                className="a-input"
                placeholder="Search target business…"
                value={mergeSearch}
                onChange={(e) => { setMergeSearch(e.target.value); setMergeTarget(null); }}
                style={{ width: "100%", marginBottom: "8px" }}
              />
              {filteredBusinesses.length > 0 && (
                <div style={{ border: "1px solid var(--a-border)", borderRadius: "6px", overflow: "hidden", marginBottom: "8px" }}>
                  {filteredBusinesses.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => { setMergeTarget(b); setMergeSearch(b.name); }}
                      style={{
                        display: "block", width: "100%", textAlign: "left",
                        padding: "8px 12px", fontSize: "13px",
                        background: mergeTarget?.id === b.id ? "var(--a-teal-glow)" : "transparent",
                        color: mergeTarget?.id === b.id ? "var(--a-teal)" : "var(--a-ink)",
                        border: "none", borderBottom: "1px solid var(--a-border)", cursor: "pointer",
                      }}
                    >
                      {b.name}
                      <span style={{ marginLeft: "8px", fontSize: "11px", color: "var(--a-ink-muted)" }}>
                        {b.listing_count} listings · #{b.id}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {mergeTarget && (
                <button
                  type="button"
                  className="a-btn"
                  style={{ width: "100%", background: "var(--a-danger)", color: "#fff", borderColor: "var(--a-danger)" }}
                  onClick={() => setShowMergeConfirm(true)}
                >
                  Merge into &ldquo;{mergeTarget.name}&rdquo;
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showMergeConfirm && mergeTarget && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
          onClick={() => setShowMergeConfirm(false)}
        >
          <div className="a-card" style={{ maxWidth: "440px", width: "90%", padding: "24px" }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: "0 0 12px", fontSize: "17px" }}>Confirm merge</h2>
            <p style={{ margin: "0 0 8px", fontSize: "14px", color: "var(--a-ink-muted)" }}>
              All <strong style={{ color: "var(--a-ink)" }}>{listings.length} listing{listings.length !== 1 ? "s" : ""}</strong> will move from{" "}
              <strong style={{ color: "var(--a-ink)" }}>{business.name}</strong> to{" "}
              <strong style={{ color: "var(--a-ink)" }}>{mergeTarget.name}</strong>.
            </p>
            <p style={{ margin: "0 0 20px", fontSize: "13px", color: "var(--a-danger)" }}>
              The source business will be marked merged and cannot be reused. Cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button type="button" className="a-btn a-btn-ghost" onClick={() => setShowMergeConfirm(false)} disabled={merging}>
                Cancel
              </button>
              <button
                type="button"
                className="a-btn"
                style={{ background: "var(--a-danger)", color: "#fff", borderColor: "var(--a-danger)" }}
                onClick={handleMerge}
                disabled={merging}
              >
                {merging ? "Merging…" : "Yes, merge"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed", bottom: "24px", right: "24px",
            background: toast.ok ? "var(--a-success)" : "var(--a-danger)",
            color: "#fff", padding: "10px 18px", borderRadius: "8px",
            fontSize: "14px", fontWeight: 500, zIndex: 200,
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          }}
        >
          {toast.msg}
        </div>
      )}
    </>
  );
}
