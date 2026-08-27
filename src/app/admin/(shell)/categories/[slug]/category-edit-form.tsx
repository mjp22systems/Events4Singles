"use client";
import { useState } from "react";
import EventImagePicker from "@/components/admin/event-image-picker";

type Category = {
  slug: string;
  label: string;
  description: string | null;
  banner_row_count: number;
  seo_title: string | null;
  seo_description: string | null;
  seo_intro: string | null;
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
  const [seoIntro, setSeoIntro] = useState(category.seo_intro ?? "");
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
          seo_intro: seoIntro,
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
      <div className="a-inline-18d895f9" >
        <form onSubmit={handleSave}>
          <div className="a-card a-inline-e5cf13bb" >
            <div className="a-form-section" >
              Category details
            </div>
            <div className="a-inline-b398b088" >
              <div>
                <label className="a-label">Label</label>
                <input className="a-input a-w-full" value={label} onChange={(e) => setLabel(e.target.value)} required  />
              </div>
              <div>
                <label className="a-label">Description</label>
                <textarea
                  className="a-input a-inline-e6eed6ec"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  
                  placeholder="Shown below banner row on category pages"
                />
              </div>
              <div>
                <EventImagePicker
                  value={heroUrl}
                  onChange={setHeroUrl}
                  label="Category image"
                  purpose="category_image"
                  source="admin-category"
                />
              </div>
            </div>
          </div>

          <div className="a-card a-inline-e5cf13bb" >
            <div className="a-form-section" >
              SEO
            </div>
            <div className="a-inline-b398b088" >
              <div>
                <label className="a-label">SEO title</label>
                <input className="a-input a-w-full" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)}  maxLength={70} />
                <div className={`a-char-count${seoTitle.length > 60 ? " is-warning" : ""}`}>
                  {seoTitle.length}/60
                </div>
              </div>
              <div>
                <label className="a-label">SEO description</label>
                <textarea className="a-input a-inline-e6eed6ec" value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} rows={3}  maxLength={200} />
                <div className={`a-char-count${seoDesc.length > 160 ? " is-warning" : ""}`}>
                  {seoDesc.length}/160
                </div>
              </div>
              <div>
                <label className="a-label">Page intro</label>
                <textarea
                  className="a-input a-inline-e6eed6ec"
                  value={seoIntro}
                  onChange={(e) => setSeoIntro(e.target.value)}
                  rows={5}
                  
                  placeholder="Shown as the lead text block on this category page"
                />
              </div>
            </div>
          </div>

          <div className="a-inline-edc8bbe4" >
            <button type="submit" className="a-btn a-btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>

        <div className="a-stack-sm" >
          <div className="a-card">
            <div className="a-form-section" >
              Settings
            </div>
            <div className="a-inline-b398b088" >
              <div>
                <label className="a-label">Slug</label>
                <div className="a-inline-fb91cc1e" >
                  {category.slug}
                </div>
              </div>
              <div>
                <label className="a-label">Banner rows</label>
                <select className="a-input a-w-full" value={bannerRows} onChange={(e) => setBannerRows(e.target.value)} >
                  <option value="1">1 row</option>
                  <option value="2">2 rows</option>
                </select>
              </div>
              <div>
                <label className="a-label">Sort order</label>
                <input className="a-input a-w-full" type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}  />
              </div>
            </div>
          </div>

          <div className="a-card">
            <div className="a-form-section" >
              Stats
            </div>
            <div className="a-inline-92f261f0" >
              <div className="a-inline-39536e27" >
                <span className="a-inline-22dfbba3" >Listings</span>
                <a href={`/admin/listings?category=${category.slug}`} className="a-inline-b3f1b3c6" >
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
          className={`a-toast a-toast--${toast.ok ? "success" : "danger"}`}
        >
          {toast.msg}
        </div>
      )}
    </>
  );
}
