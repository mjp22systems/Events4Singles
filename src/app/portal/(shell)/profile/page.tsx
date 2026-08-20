import { currentUser } from "@clerk/nextjs/server";
import { getAccount, updateAccount } from "@/lib/portal-db";
import ProfileForm from "./profile-form";

export const dynamic = "force-dynamic";

async function saveProfile(formData: FormData) {
  "use server";
  const user = await currentUser();
  if (!user) return;
  const billingEmail = formData.get("billing_email") as string | null;
  await updateAccount(user.id, { billing_email: billingEmail || null });
}

export default async function PortalProfile() {
  const user = await currentUser();
  const account = await getAccount(user!.id);

  return (
    <>
      <h1 className="p-page-title">Profile</h1>
      <div className="p-card">
        <div className="p-card__section">
          <h2 className="p-section-title">Account</h2>
          <div className="p-form-grid">
            <div className="p-field">
              <label className="p-label">Name</label>
              <input className="p-input" type="text" value={`${user!.firstName ?? ""} ${user!.lastName ?? ""}`.trim()} readOnly style={{ opacity: 0.6 }} />
            </div>
            <div className="p-field">
              <label className="p-label">Sign-in email</label>
              <input className="p-input" type="email" value={user!.emailAddresses[0]?.emailAddress ?? ""} readOnly style={{ opacity: 0.6 }} />
            </div>
          </div>
          <p className="p-muted" style={{ marginTop: "8px", fontSize: "12px" }}>Name and sign-in email are managed via Google.</p>
        </div>
        <div className="p-card__section">
          <h2 className="p-section-title">Billing</h2>
          <ProfileForm billingEmail={account?.billing_email ?? ""} saveProfile={saveProfile} />
        </div>
        <div className="p-card__section">
          <h2 className="p-section-title">Listing</h2>
          {account?.business_id ? (
            <p className="p-muted">Business ID: <code>{account.business_id}</code></p>
          ) : (
            <p className="p-muted">No listing linked yet. Email <a href="mailto:support@events4singles.com">support@events4singles.com</a> to claim your listing.</p>
          )}
        </div>
      </div>
    </>
  );
}
