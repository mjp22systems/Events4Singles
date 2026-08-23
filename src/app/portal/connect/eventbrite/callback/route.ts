import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getAccount, upsertPortalIntegration } from "@/lib/portal-db";
import { eventbriteRedirectUri } from "@/lib/portal-oauth";

export const dynamic = "force-dynamic";

type EventbriteTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
};

type EventbriteOrganizationsResponse = {
  organizations?: { id?: string }[];
};

function decodeState(state: string): string {
  const normalized = state.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - normalized.length % 4) % 4), "=");
  return atob(padded);
}

function portalRedirect(req: NextRequest, path: string): NextResponse {
  return NextResponse.redirect(new URL(path, req.url));
}

async function readErrorSnippet(response: Response): Promise<string> {
  try {
    return (await response.text()).slice(0, 240);
  } catch {
    return "";
  }
}

export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user) return portalRedirect(req, "/portal/sign-in");

  const account = await getAccount(user.id);
  if (!account) return portalRedirect(req, "/portal?integration_error=account");

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  if (!code || !state) return portalRedirect(req, "/portal/integrations?integration_error=eventbrite");

  let stateAccountId = "";
  try {
    stateAccountId = decodeState(state);
  } catch {
    return portalRedirect(req, "/portal/integrations?integration_error=state");
  }

  if (stateAccountId !== account.id) {
    return portalRedirect(req, "/portal/integrations?integration_error=state");
  }

  const clientId = process.env.EVENTBRITE_CLIENT_ID;
  const clientSecret = process.env.EVENTBRITE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return portalRedirect(req, "/portal/integrations?integration_error=config");
  }

  const redirectUri = await eventbriteRedirectUri();
  let tokenBody: EventbriteTokenResponse;
  try {
    const tokenResponse = await fetch("https://www.eventbrite.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      console.error("Eventbrite token exchange failed", tokenResponse.status, await readErrorSnippet(tokenResponse));
      return portalRedirect(req, "/portal/integrations?integration_error=token");
    }

    tokenBody = await tokenResponse.json() as EventbriteTokenResponse;
  } catch (err) {
    console.error("Eventbrite token exchange threw", err);
    return portalRedirect(req, "/portal/integrations?integration_error=token");
  }

  if (!tokenBody.access_token) return portalRedirect(req, "/portal/integrations?integration_error=token");

  let orgId = "";
  try {
    const organizationsResponse = await fetch(
      "https://www.eventbriteapi.com/v3/users/me/organizations/",
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${tokenBody.access_token}`,
        },
      },
    );

    if (!organizationsResponse.ok) {
      console.error("Eventbrite organization lookup failed", organizationsResponse.status, await readErrorSnippet(organizationsResponse));
      return portalRedirect(req, "/portal/integrations?integration_error=organization");
    }

    const organizationsBody = await organizationsResponse.json() as EventbriteOrganizationsResponse;
    orgId = organizationsBody.organizations?.find((org) => org.id)?.id ?? "";
  } catch (err) {
    console.error("Eventbrite organization lookup threw", err);
    return portalRedirect(req, "/portal/integrations?integration_error=organization");
  }

  if (!orgId) return portalRedirect(req, "/portal/integrations?integration_error=organization");

  try {
    await upsertPortalIntegration(
      account.id,
      "eventbrite",
      { org_id: orgId },
      {
        access_token: tokenBody.access_token,
        refresh_token: tokenBody.refresh_token ?? null,
        token_expiry: tokenBody.expires_in
          ? new Date(Date.now() + tokenBody.expires_in * 1000).toISOString()
          : null,
      },
    );
  } catch (err) {
    console.error("Eventbrite integration save failed", err);
    return portalRedirect(req, "/portal/integrations?integration_error=save");
  }

  return portalRedirect(req, "/portal/integrations?connected=eventbrite");
}
