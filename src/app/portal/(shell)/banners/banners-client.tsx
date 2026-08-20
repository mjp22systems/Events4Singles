"use client";

import { useState } from "react";
import { Banner } from "@/lib/portal-db";
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
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--p-border)" }}>
                  <th className="p-label" style={{ textAlign: "left", padding: "8px 0", fontWeight: 600 }}>Preview</th>
                  <th className="p-label" style={{ textAlign: "left", padding: "8px 0", fontWeight: 600 }}>Title</th>
                  <th className="p-label" style={{ textAlign: "left", padding: "8px 0", fontWeight: 600 }}>Link</th>
                  <th className="p-label" style={{ textAlign: "left", padding: "8px 0", fontWeight: 600 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((b) => (
                  <tr key={b.id} style={{ borderBottom: "1px solid var(--p-border)" }}>
                    <td style={{ padding: "10px 0" }}>
                      <img src={b.image_url} alt={b.title ?? "Banner"} style={{ width: 90, height: 60, objectFit: "cover", borderRadius: 4, border: "1px solid var(--p-border)" }} />
                    </td>
                    <td style={{ padding: "10px 0 10px 12px", fontSize: "14px", color: "var(--p-ink)" }}>{b.title ?? "—"}</td>
                    <td style={{ padding: "10px 0", fontSize: "13px", color: "var(--p-muted)", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      <a href={b.link_url} target="_blank" rel="noopener noreferrer">{b.link_url}</a>
                    </td>
                    <td style={{ padding: "10px 0" }}>
                      <span style={{
                        fontSize: "12px", padding: "2px 8px", borderRadius: "12px",
                        background: b.status === "active" ? "#d1fae5" : b.status === "rejected" ? "#fee2e2" : "#fef3c7",
                        color: b.status === "active" ? "#065f46" : b.status === "rejected" ? "#991b1b" : "#92400e",
                      }}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
