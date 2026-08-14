"use client";
import { useState } from "react";

type City = {
  slug: string;
  label: string;
  state: string | null;
  region: string | null;
  seo_title: string | null;
  seo_description: string | null;
  listing_count: number;
};

export default function CityEditForm({ city }: { city: City }) {
  const [label, setLabel] = useState(city.label);
  const [state, setState] = useState(city.state ?? "");
  const [region, setRegion] = useState(city.region ?? "");
  const [seoTitle, setSeoTitle] = useState(city.seo_title ?? "");
  const [seoDesc, setSeoDesc] = useState(city.seo_description ?? "");

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/admin/api/cities/${city.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, state, region, seo_title: seoTitle, seo_description: seoDesc }),
      });
      showToast(res.ok ? "Saved" : "Save failed", res.ok);
    } catch {
      showToast("Error saving", false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px", alignItems: "start" }}>
        <form onSubmit={handleSave}>
          <div className="a-card" style={{ marginBottom: "20px" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--a-border)", fontWeight: 600, fontSize: "14px" }}>
              City details
            </div>
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="a-label">Label</label>
                <input className="a-input" value={label} onChange={(e) => setLabel(e.target.value)} required style={{ width: "100%" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="a-label">State</label>
                  <input className="a-input" value={state} onChange={(e) => setState(e.target.value)} placeholder="NSW" style={{ width: "100%" }} />
                </div>
                <div>
                  <label className="a-label">Region</label>
                  <input className="a-input" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="Greater Sydney" style={{ width: "100%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="a-card" style={{ marginBottom: "20px" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--a-border)", fontWeight: 600, fontSize: "14px" }}>
              SEO
            </div>
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="a-label">SEO title</label>
                <input className="a-input" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} style={{ width: "100%" }} maxLength={70} />
                <div style={{ fontSize: "11px", color: seoTitle.length > 60 ? "var(--a-warning)" : "var(--a-ink-muted)", marginTop: "4px" }}>
                  {seoTitle.length}/60
                </div>
              </div>
              <div>
                <label className="a-label">SEO description</label>
                <textarea className="a-input" value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} rows={3} style={{ width: "100%", resize: "vertical" }} maxLength={200} />
                <div style={{ fontSize: "11px", color: seoDesc.length > 160 ? "var(--a-warning)" : "var(--a-ink-muted)", marginTop: "4px" }}>
                  {seoDesc.length}/160
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="a-btn a-btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>

        <div className="a-card">
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--a-border)", fontWeight: 600, fontSize: "14px" }}>
            Info
          </div>
          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--a-ink-muted)" }}>Slug</span>
              <span style={{ fontFamily: "monospace" }}>{city.slug}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--a-ink-muted)" }}>Listings</span>
              <a href={`/admin/listings?city=${city.slug}`} style={{ color: "var(--a-teal)" }}>
                {city.listing_count}
              </a>
            </div>
          </div>
        </div>
      </div>

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
