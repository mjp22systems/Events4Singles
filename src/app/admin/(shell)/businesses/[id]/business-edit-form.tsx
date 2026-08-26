"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

type Business = {
  id: number;
  name: string;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  status: string | null;
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

function statusLabel(status: string | null) {
  return (status ?? "active").replace(/_/g, " ");
}

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
      <div className="a-inline-201c0b79" >
        <div>
          <form onSubmit={handleSave}>
            <div className="a-card a-inline-e5cf13bb" >
              <div className="a-inline-d84dd62c" >
                Business details
              </div>
              <div className="a-inline-b398b088" >
                <div>
                  <div className="a-inline-97ce338b" >
                    <label className="a-label a-inline-ac18bab6" >Name</label>
                    <span className={`a-badge ${BADGE[business.status ?? "active"] ?? "a-badge-paused"}`}>
                      {statusLabel(business.status)}
                    </span>
                  </div>
                  <input className="a-input a-inline-aef14f3c" value={name} onChange={(e) => setName(e.target.value)} required  />
                </div>
                <div>
                  <label className="a-label">Description</label>
                  <textarea className="a-input a-inline-e6eed6ec" value={description} onChange={(e) => setDescription(e.target.value)} rows={4}  />
                </div>
                <div>
                  <label className="a-label">Website</label>
                  <input className="a-input a-inline-aef14f3c" value={website} onChange={(e) => setWebsite(e.target.value)} type="url" placeholder="https://"  />
                </div>
                <div>
                  <label className="a-label">Logo URL</label>
                  <input className="a-input a-inline-aef14f3c" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://"  />
                </div>
              </div>
              <div className="a-inline-8f9a8dc2" >
                <button type="submit" className="a-btn a-btn-primary" disabled={saving}>
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          </form>

          <div className="a-card">
            <div className="a-inline-d84dd62c" >
              Listings
              <span className="a-inline-3f964057" >{listings.length}</span>
            </div>
            <div className="a-table-wrap">
              <table className="a-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>City</th>
                    <th>Status</th>
                    <th className="a-inline-ff9d652c" >Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="a-inline-58f76306" >
                        No listings
                      </td>
                    </tr>
                  ) : (
                    listings.map((l) => (
                      <tr key={l.id}>
                        <td className="a-inline-5d69a8cc" >{l.id}</td>
                        <td className="a-inline-da6c85ac" >{l.title}</td>
                        <td className="a-inline-691df809" >{l.location_city ?? "—"}</td>
                        <td>
                          {l.unclaimed_flag ? (
                            <span className="a-badge a-badge-unclaimed">unclaimed</span>
                          ) : (
                            <span className={`a-badge ${BADGE[l.status ?? ""] ?? "a-badge-paused"}`}>
                              {l.status ?? "unknown"}
                            </span>
                          )}
                        </td>
                        <td className="a-inline-ff9d652c" >
                          <a
                            href={`/admin/listings/${l.id}`}
                            className="a-btn a-btn-ghost a-inline-fed8595c"
                            
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

        <div className="a-inline-b55e6460" >
          <div className="a-card">
            <div className="a-inline-d84dd62c" >
              Info
            </div>
            <div className="a-inline-92f261f0" >
              <div className="a-inline-39536e27" >
                <span className="a-inline-22dfbba3" >ID</span>
                <span className="a-inline-36887086" >#{business.id}</span>
              </div>
              <div className="a-inline-39536e27" >
                <span className="a-inline-22dfbba3" >Listings</span>
                <a href={`/admin/listings?business_id=${business.id}`} className="a-inline-b3f1b3c6" >
                  {business.listing_count}
                </a>
              </div>
              {business.advertiser_id && (
                <div className="a-inline-39536e27" >
                  <span className="a-inline-22dfbba3" >Advertiser</span>
                  <a href={`/admin/customers/${business.advertiser_id}`} className="a-inline-b3f1b3c6" >
                    #{business.advertiser_id}
                  </a>
                </div>
              )}
              {business.merged_into_business_id && (
                <div className="a-inline-51cbbbeb" >
                  Merged into{" "}
                  <a href={`/admin/businesses/${business.merged_into_business_id}`} className="a-inline-06e70187" >
                    #{business.merged_into_business_id}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="a-card">
            <div className="a-inline-d84dd62c" >
              Merge into another
            </div>
            <div className="a-inline-a14dfa31" >
              <p className="a-inline-857ef196" >
                All {listings.length} listing{listings.length !== 1 ? "s" : ""} will be moved to the target. This cannot be undone.
              </p>
              <input
                className="a-input a-inline-432fc8cd"
                placeholder="Search target business…"
                value={mergeSearch}
                onChange={(e) => { setMergeSearch(e.target.value); setMergeTarget(null); }}
                
              />
              {filteredBusinesses.length > 0 && (
                <div className="a-inline-d7d3fea6" >
                  {filteredBusinesses.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => { setMergeTarget(b); setMergeSearch(b.name); }}
                      className={`a-merge-option${mergeTarget?.id === b.id ? " is-selected" : ""}`}
                    >
                      {b.name}
                      <span className="a-inline-dae2c4fd" >
                        {b.listing_count} listings · #{b.id}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {mergeTarget && (
                <button
                  type="button"
                  className="a-btn a-inline-63b2c909"
                  
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
          className="a-inline-7daee487" 
          onClick={() => setShowMergeConfirm(false)}
        >
          <div className="a-card a-inline-241cea78"  onClick={(e) => e.stopPropagation()}>
            <h2 className="a-inline-b25e3a7f" >Confirm merge</h2>
            <p className="a-inline-33527e7e" >
              All <strong className="a-inline-7a608131" >{listings.length} listing{listings.length !== 1 ? "s" : ""}</strong> will move from{" "}
              <strong className="a-inline-7a608131" >{business.name}</strong> to{" "}
              <strong className="a-inline-7a608131" >{mergeTarget.name}</strong>.
            </p>
            <p className="a-inline-81ccf392" >
              The source business will be marked merged and cannot be reused. Cannot be undone.
            </p>
            <div className="a-inline-592e210f" >
              <button type="button" className="a-btn a-btn-ghost" onClick={() => setShowMergeConfirm(false)} disabled={merging}>
                Cancel
              </button>
              <button
                type="button"
                className="a-btn a-inline-9d143ee8"
                
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
          className={`a-toast a-toast--${toast.ok ? "success" : "danger"}`}
        >
          {toast.msg}
        </div>
      )}
    </>
  );
}
