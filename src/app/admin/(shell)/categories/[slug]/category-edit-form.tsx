"use client";
import { useState } from "react";

type Category = {
  slug: string;
  label: string;
  description: string | null;
  banner_row_count: number;
  seo_title: string | null;
  seo_description: string | null;
  hero_image_url: string | null;
  sort_order: number | null;
  listing_count: number;
};

export default function CategoryEditForm({ category }: { category: Category }) {
  const [label, setLabel] = useState(category.label);
  const [description, setDescription] = useState(category.description ?? "");
  const [bannerRows, setBannerRows] = useState(String(category.banner_row_count ?? 1));
  const [seoTitle, setSeoTitle] = useState(category.seo_title ?? "");
  const [seoDesc, setSeoDesc] = useState(category.seo_description ?? "");
  const [heroUrl, setHeroUrl] = useState(category.hero_image_url ?? "");
  const [sortOrder, setSortOrder] = useState(String(category.sort_order ?? 0));

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
      const res = await fetch(`/admin/api/categories/${category.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label,
          description,
          banner_row_count: Number(bannerRows),
          seo_title: seoTitle,
          seo_description: seoDesc,
          hero_image_url: heroUrl,
          sort_order: Number(sortOrder),
        }),
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
              Category details
            </div>
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="a-label">Label</label>
                <input className="a-input" value={label} onChange={(e) => setLabel(e.target.value)} required style={{ width: "100%" }} />
              </div>
              <div>
                <label className="a-label">Description</label>
                <textarea
                  className="a-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  style={{ width: "100%", resize: "vertical" }}
                  placeholder="Shown below banner row on category pages"
                />
              </div>
              <div>
                <label className="a-label">Hero image URL</label>
                <input className="a-input" value={heroUrl} onChange={(e) => setHeroUrl(e.target.value)} placeholder="https://" style={{ width: "100%" }} />
                {heroUrl && (
                  <div style={{ marginTop: "8px" }}>
                    <img src={heroUrl} alt="Hero preview" style={{ maxWidth: "100%", maxHeight: "120px", borderRadius: "6px", objectFit: "cover" }} />
                  </div>
                )}
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

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="a-card">
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--a-border)", fontWeight: 600, fontSize: "14px" }}>
              Settings
            </div>
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="a-label">Slug</label>
                <div style={{ fontFamily: "monospace", fontSize: "13px", padding: "8px 10px", background: "var(--a-surface-2)", borderRadius: "6px", color: "var(--a-ink-muted)" }}>
                  {category.slug}
                </div>
              </div>
              <div>
                <label className="a-label">Banner rows</label>
                <select className="a-input" value={bannerRows} onChange={(e) => setBannerRows(e.target.value)} style={{ width: "100%" }}>
                  <option value="1">1 row</option>
                  <option value="2">2 rows</option>
                </select>
              </div>
              <div>
                <label className="a-label">Sort order</label>
                <input className="a-input" type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ width: "100%" }} />
              </div>
            </div>
          </div>

          <div className="a-card">
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--a-border)", fontWeight: 600, fontSize: "14px" }}>
              Stats
            </div>
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--a-ink-muted)" }}>Listings</span>
                <a href={`/admin/listings?category=${category.slug}`} style={{ color: "var(--a-teal)" }}>
                  {category.listing_count}
                </a>
              </div>
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
