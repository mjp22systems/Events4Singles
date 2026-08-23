import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateAccount, getBusinessesForAccount, getBusinessIdsForAccount, getListingsForBusinessIds } from "@/lib/portal-db";
import ListingsClient from "./listings-client";

export const dynamic = "force-dynamic";

async function requestListing(fd: FormData) {
  "use server";
  const user = await currentUser();
  const resendKey = (process.env.RESEND_API_KEY as string) || "";
  if (!resendKey) return;

  const fields = {
    business_name: fd.get("business_name"),
    city: fd.get("city"),
    category: fd.get("category"),
    website: fd.get("website"),
    contact_email: fd.get("contact_email"),
    phone: fd.get("phone"),
    message: fd.get("message"),
    portal_user: user?.emailAddresses[0]?.emailAddress,
  };

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Events4Singles Portal <hello@events4singles.com>",
      to: ["support@events4singles.com"],
      subject: `Listing request: ${fields.business_name}`,
      text: Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join("\n"),
    }),
  });
}

export default async function PortalListings({
  searchParams,
}: {
  searchParams: Promise<{ business_id?: string }>;
}) {
  const params = await searchParams;
  const user = await currentUser();
  if (!user) redirect("/portal/sign-in");
  const account = await getOrCreateAccount(user.id, user.emailAddresses[0]?.emailAddress);
  const businesses = await getBusinessesForAccount(account);
  const businessIds = await getBusinessIdsForAccount(account);
  const selectedBusinessId = Number(params.business_id ?? "");
  const filterBusinessId = Number.isFinite(selectedBusinessId) && selectedBusinessId > 0 ? selectedBusinessId : undefined;
  const listings = businessIds.length ? await getListingsForBusinessIds(businessIds, filterBusinessId) : [];

  return (
    <ListingsClient
      listings={listings as { id: string; title: string; status: string; location_city: string; business_id: number; business_name: string }[]}
      businesses={businesses}
      selectedBusinessId={filterBusinessId}
      requestListing={requestListing}
    />
  );
}
