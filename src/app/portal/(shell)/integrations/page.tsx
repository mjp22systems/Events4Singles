import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateAccount, listPortalIntegrations } from "@/lib/portal-db";
import IntegrationsClient from "./integrations-client";

export const dynamic = "force-dynamic";

export default async function PortalIntegrationsPage({
  searchParams,
}: {
  searchParams?: Promise<{ connected?: string; integration_error?: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/portal/sign-in");
  const account = await getOrCreateAccount(user.id, user.emailAddresses[0]?.emailAddress);
  const integrations = await listPortalIntegrations(account.id);
  const params = await searchParams;
  return (
    <IntegrationsClient
      integrations={integrations}
      connectedPlatform={params?.connected}
      integrationError={params?.integration_error}
    />
  );
}
