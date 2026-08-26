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
      <div className="a-inline-18d895f9" >
        <form onSubmit={handleSave}>
          <div className="a-card a-inline-e5cf13bb" >
            <div className="a-inline-d84dd62c" >
              City details
            </div>
            <div className="a-inline-b398b088" >
              <div>
                <label className="a-label">Label</label>
                <input className="a-input a-inline-aef14f3c" value={label} onChange={(e) => setLabel(e.target.value)} required  />
              </div>
              <div className="a-inline-99cabfbe" >
                <div>
                  <label className="a-label">State</label>
                  <input className="a-input a-inline-aef14f3c" value={state} onChange={(e) => setState(e.target.value)} placeholder="NSW"  />
                </div>
                <div>
                  <label className="a-label">Region</label>
                  <input className="a-input a-inline-aef14f3c" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="Greater Sydney"  />
                </div>
              </div>
            </div>
          </div>

          <div className="a-card a-inline-e5cf13bb" >
            <div className="a-inline-d84dd62c" >
              SEO
            </div>
            <div className="a-inline-b398b088" >
              <div>
                <label className="a-label">SEO title</label>
                <input className="a-input a-inline-aef14f3c" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)}  maxLength={70} />
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
            </div>
          </div>

          <div className="a-inline-edc8bbe4" >
            <button type="submit" className="a-btn a-btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>

        <div className="a-card">
          <div className="a-inline-d84dd62c" >
            Info
          </div>
          <div className="a-inline-92f261f0" >
            <div className="a-inline-39536e27" >
              <span className="a-inline-22dfbba3" >Slug</span>
              <span className="a-inline-36887086" >{city.slug}</span>
            </div>
            <div className="a-inline-39536e27" >
              <span className="a-inline-22dfbba3" >Listings</span>
              <a href={`/admin/listings?city=${city.slug}`} className="a-inline-b3f1b3c6" >
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
          className={`a-toast a-toast--${toast.ok ? "success" : "danger"}`}
        >
          {toast.msg}
        </div>
      )}
    </>
  );
}
