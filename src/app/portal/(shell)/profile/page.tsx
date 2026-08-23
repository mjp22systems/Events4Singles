import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateAccount, getBusinessesForAccount, updateAccount } from "@/lib/portal-db";
import ProfileForm from "./profile-form";

export const dynamic = "force-dynamic";

async function saveProfile(formData: FormData) {
  "use server";
  const user = await currentUser();
  if (!user) return;
  const displayName = String(formData.get("display_name") ?? "").trim();
  const portalEmail = String(formData.get("portal_email") ?? "").trim();
  const billingEmail = formData.get("billing_email") as string | null;
  await updateAccount(user.id, {
    display_name: displayName || null,
    portal_email: portalEmail || null,
    billing_email: billingEmail || null,
  });
}

export default async function PortalProfile() {
  const user = await currentUser();
  if (!user) redirect("/portal/sign-in");
  const account = await getOrCreateAccount(user.id, user.emailAddresses[0]?.emailAddress);
  const businesses = await getBusinessesForAccount(account);
  const providerName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  const providerEmail = user.emailAddresses[0]?.emailAddress ?? "";
  const displayName = account.display_name ?? providerName;
  const portalEmail = account.portal_email ?? providerEmail;

  return (
    <>
      <h1 className="p-page-title">Profile</h1>
      <div className="p-card">
        <div className="p-card__section">
          <h2 className="p-section-title">Account</h2>
          <div className="p-form-grid" style={{ marginTop: "12px" }}>
            <div className="p-field">
              <label className="p-label">Portal account ID</label>
              <input className="p-input" type="text" value={account?.id ?? ""} readOnly style={{ opacity: 0.6 }} />
            </div>
            <div className="p-field">
              <label className="p-label">Login provider user ID</label>
              <input className="p-input" type="text" value={user.id} readOnly style={{ opacity: 0.6 }} />
            </div>
          </div>
          <p className="p-muted" style={{ marginTop: "8px", fontSize: "12px" }}>Internal IDs are locked. Your portal name and contact email can be changed below.</p>
        </div>
        <div className="p-card__section">
          <h2 className="p-section-title">Contact and billing</h2>
          <ProfileForm displayName={displayName} portalEmail={portalEmail} billingEmail={account?.billing_email ?? ""} saveProfile={saveProfile} />
        </div>
        <div className="p-card__section">
          <h2 className="p-section-title">Businesses</h2>
          {businesses.length > 0 ? (
            <div style={{ display: "grid", gap: "8px" }}>
              {businesses.map((business) => (
                <p key={business.id} className="p-muted" style={{ margin: 0 }}>
                  <strong style={{ color: "var(--p-ink)" }}>{business.name}</strong>{" "}
                  <code>#{business.id}</code>
                  {business.is_primary ? " · primary" : ""} · {business.role}
                </p>
              ))}
              <p className="p-muted" style={{ margin: "8px 0 0" }}>
                Manage owned businesses from the <a href="/portal/businesses">Businesses</a> page.
              </p>
            </div>
          ) : (
            <p className="p-muted">No listing linked yet. Email <a href="mailto:support@events4singles.com">support@events4singles.com</a> to claim your listing.</p>
          )}
        </div>
      </div>
    </>
  );
}
