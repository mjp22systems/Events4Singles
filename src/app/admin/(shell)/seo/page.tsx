import type { Metadata } from "next";
import { listRedirects } from "@/lib/admin-db";
import RedirectsClient from "./redirects-client";

export const metadata: Metadata = { title: "Redirects" };
export const dynamic = "force-dynamic";

export default async function AdminRedirectsPage() {
  const redirects = await listRedirects();
  return <RedirectsClient initial={redirects} />;
}
