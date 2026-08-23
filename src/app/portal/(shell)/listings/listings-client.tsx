"use client";

import { useState } from "react";
import ListingRequestModal from "./listing-request-modal";
import type { PortalBusiness } from "@/lib/portal-db";

type Listing = {
  id: string;
  title: string;
  status: string;
  location_city: string;
  business_id: number;
  business_name: string | null;
};

export default function ListingsClient({
  listings,
  businesses,
  selectedBusinessId,
  requestListing,
}: {
  listings: Listing[];
  businesses: PortalBusiness[];
  selectedBusinessId?: number;
  requestListing: (fd: FormData) => Promise<void>;
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
        <h1 className="p-page-title" style={{ margin: 0 }}>Listings</h1>
        <button className="p-btn p-btn--primary" onClick={() => setShowModal(true)}>+ Request listing</button>
      </div>
      <p className="p-muted">Your active listings on Events4Singles.</p>

      {businesses.length > 1 && (
        <form method="GET" action="/portal/listings" style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "18px", flexWrap: "wrap" }}>
          <select name="business_id" className="p-select" defaultValue={selectedBusinessId ? String(selectedBusinessId) : ""} style={{ maxWidth: "280px" }}>
            <option value="">All businesses</option>
            {businesses.map((business) => (
              <option key={business.id} value={business.id}>
                {business.name}
              </option>
            ))}
          </select>
          <button type="submit" className="p-btn">Filter</button>
          {selectedBusinessId && <a href="/portal/listings" className="p-btn">Clear</a>}
        </form>
      )}

      <div className="p-card" style={{ marginTop: "20px" }}>
        {listings.length === 0 ? (
          <div className="p-empty">
            <p>No listings linked to your account yet.</p>
            <p style={{ fontSize: "13px" }}>
              Click <strong>Request listing</strong> above or email{" "}
              <a href="mailto:support@events4singles.com">support@events4singles.com</a>.
            </p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--p-border)" }}>
                <th className="p-label" style={{ textAlign: "left", padding: "8px 0", fontWeight: 600 }}>Title</th>
                <th className="p-label" style={{ textAlign: "left", padding: "8px 0", fontWeight: 600 }}>Business</th>
                <th className="p-label" style={{ textAlign: "left", padding: "8px 0", fontWeight: 600 }}>City</th>
                <th className="p-label" style={{ textAlign: "left", padding: "8px 0", fontWeight: 600 }}>Status</th>
                <th style={{ width: "120px" }} />
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.id} style={{ borderBottom: "1px solid var(--p-border)" }}>
                  <td style={{ padding: "10px 0", fontSize: "14px", color: "var(--p-ink)" }}>{l.title}</td>
                  <td style={{ padding: "10px 0", fontSize: "14px", color: "var(--p-muted)" }}>{l.business_name ?? `#${l.business_id}`}</td>
                  <td style={{ padding: "10px 0", fontSize: "14px", color: "var(--p-muted)" }}>{l.location_city}</td>
                  <td style={{ padding: "10px 0" }}>
                    <span style={{
                      fontSize: "12px", padding: "2px 8px", borderRadius: "12px",
                      background: l.status === "active" ? "#d1fae5" : "#fef3c7",
                      color: l.status === "active" ? "#065f46" : "#92400e",
                    }}>{l.status}</span>
                  </td>
                  <td style={{ padding: "10px 0", textAlign: "right" }}>
                    <a href={`/portal/analytics?listing=${l.id}`} className="p-btn" style={{ fontSize: "12px", height: "28px", padding: "0 10px" }}>
                      Analytics
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <ListingRequestModal onClose={() => setShowModal(false)} requestListing={requestListing} />
      )}
    </>
  );
}
