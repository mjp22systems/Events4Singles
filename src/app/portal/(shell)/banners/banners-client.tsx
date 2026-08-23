"use client";

import { useState } from "react";
import type { Banner } from "@/lib/portal-db";
import Modal from "@/components/portal/modal";
import BannerSubmitForm from "./banner-submit-form";

export default function BannersClient({
  banners,
  submitBanner,
}: {
  banners: Banner[];
  submitBanner: (fd: FormData) => Promise<void>;
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
        <h1 className="p-page-title" style={{ margin: 0 }}>Banners</h1>
        <button className="p-btn p-btn--primary" onClick={() => setShowModal(true)}>+ Add banner</button>
      </div>
      <p className="p-muted">Sidebar banners (180×120px) displayed on listing and category pages.</p>

      <div className="p-card" style={{ marginTop: "20px" }}>
        <div className="p-card__section">
          <h2 className="p-section-title">Your banners</h2>
          {banners.length === 0 ? (
            <div className="p-empty"><p>No banners yet. Click <strong>Add banner</strong> to submit one.</p></div>
          ) : (
            <div className="p-table-wrap">
            <table className="p-table p-banners-table">
              <thead>
                <tr>
                  <th className="p-banners-table__preview-col">Preview</th>
                  <th>Title</th>
                  <th>Link</th>
                  <th className="p-banners-table__status-col">Status</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <img className="p-banner-thumb" src={b.image_url} alt={b.title ?? "Banner"} />
                    </td>
                    <td className="p-banners-table__title">{b.title ?? "-"}</td>
                    <td className="p-banners-table__link">
                      <a href={b.link_url} target="_blank" rel="noopener noreferrer" title={b.link_url}>{b.link_url}</a>
                    </td>
                    <td>
                      <span className={`p-status-chip p-status-chip--${b.status}`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <Modal title="Add a banner" onClose={() => setShowModal(false)}>
          <BannerSubmitForm
            submitBanner={submitBanner}
            onDone={() => setShowModal(false)}
          />
        </Modal>
      )}
    </>
  );
}
