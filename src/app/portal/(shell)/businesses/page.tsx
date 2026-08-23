import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createBusinessClaimRequest, getOrCreateAccount, getBusinessesForAccount } from "@/lib/portal-db";
import BusinessRequestForm from "./business-request-form";

export const dynamic = "force-dynamic";

async function requestBusiness(fd: FormData) {
  "use server";
  const user = await currentUser();
  if (!user) return;
  const account = await getOrCreateAccount(user.id, user.emailAddresses[0]?.emailAddress);
  const businessName = String(fd.get("business_name") ?? "").trim();
  if (!businessName) return;

  await createBusinessClaimRequest(account, {
    business_name: businessName,
    website: String(fd.get("website") ?? "").trim() || null,
    city: String(fd.get("city") ?? "").trim() || null,
    contact_email: String(fd.get("contact_email") ?? "").trim() || null,
    phone: String(fd.get("phone") ?? "").trim() || null,
    message: String(fd.get("message") ?? "").trim() || null,
    portal_email: user.emailAddresses[0]?.emailAddress ?? null,
  });

  const resendKey = (process.env.RESEND_API_KEY as string) || "";
  if (!resendKey) return;

  const fields = {
    business_name: businessName,
    website: fd.get("website"),
    city: fd.get("city"),
    contact_email: fd.get("contact_email"),
    phone: fd.get("phone"),
    message: fd.get("message"),
    portal_user: user.emailAddresses[0]?.emailAddress,
    clerk_user_id: user.id,
  };

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Events4Singles Portal <hello@events4singles.com>",
      to: ["support@events4singles.com"],
      subject: `Business add/claim request: ${fields.business_name}`,
      text: Object.entries(fields).map(([key, value]) => `${key}: ${value}`).join("\n"),
    }),
  });
}

export default async function PortalBusinessesPage() {
  const user = await currentUser();
  if (!user) redirect("/portal/sign-in");
  const account = await getOrCreateAccount(user.id, user.emailAddresses[0]?.emailAddress);
  const businesses = await getBusinessesForAccount(account);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
        <h1 className="p-page-title" style={{ margin: 0 }}>Businesses</h1>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/portal/listings" className="p-btn">View listings</Link>
          <BusinessRequestForm requestBusiness={requestBusiness} />
        </div>
      </div>
      <p className="p-muted">Businesses linked to your portal login.</p>

      <div className="p-card" style={{ marginTop: "20px" }}>
        {businesses.length === 0 ? (
          <div className="p-empty">
            <p>No businesses linked to your account yet.</p>
            <p style={{ fontSize: "13px" }}>
              Use <strong>Add business</strong> to claim or connect a business.
            </p>
          </div>
        ) : (
          <div className="p-card__section" style={{ display: "grid", gap: "14px" }}>
            {businesses.map((business) => (
              <div key={business.id} style={{ display: "grid", gap: "8px", borderBottom: "1px solid var(--p-border)", paddingBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                  <div>
                    <h2 className="p-section-title" style={{ margin: 0 }}>{business.name}</h2>
                    <p className="p-muted" style={{ margin: "4px 0 0", fontSize: "13px" }}>
                      Business ID <code>{business.id}</code> · {business.role}{business.is_primary ? " · primary" : ""}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <Link href={`/portal/listings?business_id=${business.id}`} className="p-btn" style={{ height: "32px" }}>
                      {business.listing_count} listing{business.listing_count === 1 ? "" : "s"}
                    </Link>
                    {business.website && (
                      <a href={business.website.startsWith("http") ? business.website : `https://${business.website}`} className="p-btn" style={{ height: "32px" }} target="_blank" rel="noopener">
                        Website
                      </a>
                    )}
                  </div>
                </div>
                {business.description && <p className="p-muted" style={{ margin: 0 }}>{business.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
