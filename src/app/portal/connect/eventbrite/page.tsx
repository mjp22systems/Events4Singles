import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAccount } from "@/lib/portal-db";
import { eventbriteRedirectUri } from "@/lib/portal-oauth";

export const dynamic = "force-dynamic";

function encodeState(accountId: string): string {
  return btoa(accountId).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export default async function EventbriteConnectPage() {
  const user = await currentUser();
  if (!user) redirect("/portal/sign-in");

  const account = await getAccount(user.id);
  if (!account) redirect("/portal");

  const clientId = process.env.EVENTBRITE_CLIENT_ID;
  if (!clientId) {
    return (
      <>
        <h1 className="p-page-title">Connect Eventbrite</h1>
        <p className="p-muted">Eventbrite OAuth is not configured yet.</p>
      </>
    );
  }

  const callbackUrl = await eventbriteRedirectUri();
  const authorizeUrl = new URL("https://www.eventbrite.com/oauth/authorize");
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", callbackUrl);
  authorizeUrl.searchParams.set("state", encodeState(account.id));

  redirect(authorizeUrl.toString());
}
