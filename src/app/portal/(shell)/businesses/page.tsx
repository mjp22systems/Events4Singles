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
      <div className="p-inline-72c7fa58" >
        <h1 className="p-page-title p-inline-b646589c" >Businesses</h1>
        <div className="p-inline-306fee7f" >
          <Link href="/portal/listings" className="p-btn">View listings</Link>
          <BusinessRequestForm requestBusiness={requestBusiness} />
        </div>
      </div>
      <p className="p-muted">Businesses linked to your portal login.</p>

      <div className="p-card p-inline-ba93ebdf" >
        {businesses.length === 0 ? (
          <div className="p-empty">
            <p>No businesses linked to your account yet.</p>
            <p className="p-inline-eca1b296" >
              Use <strong>Add business</strong> to claim or connect a business.
            </p>
          </div>
        ) : (
          <div className="p-card__section p-inline-a7c5473c" >
            {businesses.map((business) => (
              <div key={business.id} className="p-inline-4b0ede5a" >
                <div className="p-inline-5175b1e6" >
                  <div>
                    <h2 className="p-section-title p-inline-b646589c" >{business.name}</h2>
                    <p className="p-muted p-inline-3b7ea823" >
                      Business ID <code>{business.id}</code> · {business.role}{business.is_primary ? " · primary" : ""}
                    </p>
                  </div>
                  <div className="p-inline-12abe072" >
                    <Link href={`/portal/listings?business_id=${business.id}`} className="p-btn p-inline-ec69b25e" >
                      {business.listing_count} listing{business.listing_count === 1 ? "" : "s"}
                    </Link>
                    {business.website && (
                      <a href={business.website.startsWith("http") ? business.website : `https://${business.website}`} className="p-btn p-inline-ec69b25e"  target="_blank" rel="noopener">
                        Website
                      </a>
                    )}
                  </div>
                </div>
                {business.description && <p className="p-muted p-inline-b646589c" >{business.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
