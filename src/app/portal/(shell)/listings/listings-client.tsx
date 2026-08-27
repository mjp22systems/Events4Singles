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
      <div className="p-inline-7cf1efdb" >
        <h1 className="p-page-title p-flush-text" >Listings</h1>
        <button className="p-btn p-btn--primary" onClick={() => setShowModal(true)}>+ Request listing</button>
      </div>
      <p className="p-muted">Your active listings on Events4Singles.</p>

      {businesses.length > 1 && (
        <form method="GET" action="/portal/listings" className="p-inline-910807be" >
          <select name="business_id" className="p-select p-inline-49182df8" defaultValue={selectedBusinessId ? String(selectedBusinessId) : ""} >
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

      <div className="p-card p-spaced-block">
        {listings.length === 0 ? (
          <div className="p-empty">
            <p>No listings linked to your account yet.</p>
            <p className="p-empty__hint">
              Click <strong>Request listing</strong> above or email{" "}
              <a href="mailto:support@events4singles.com">support@events4singles.com</a>.
            </p>
          </div>
        ) : (
          <table className="p-inline-3d9ff13f" >
            <thead>
              <tr className="p-table-row-border" >
                <th className="p-label p-table-heading-left" >Title</th>
                <th className="p-label p-table-heading-left" >Business</th>
                <th className="p-label p-table-heading-left" >City</th>
                <th className="p-label p-table-heading-left" >Status</th>
                <th className="p-inline-891409a5"  />
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.id} className="p-table-row-border" >
                  <td className="p-inline-3d73efb4" >{l.title}</td>
                  <td className="p-inline-11a67c90" >{l.business_name ?? `#${l.business_id}`}</td>
                  <td className="p-inline-11a67c90" >{l.location_city}</td>
                  <td className="p-inline-d6e989d8" >
                    <span className={`p-status-pill p-status-pill--${l.status === "active" ? "active" : "pending"}`}>{l.status}</span>
                  </td>
                  <td className="p-inline-3534e1cf" >
                    <a href={`/portal/analytics?listing=${l.id}`} className="p-btn p-inline-d0cb2021" >
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
