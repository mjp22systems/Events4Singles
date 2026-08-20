import type { Metadata } from "next";
import { listRedirects } from "@/lib/admin-db";
import RedirectsClient from "./redirects-client";

export const metadata: Metadata = { title: "SEO Redirects" };
export const dynamic = "force-dynamic";

export default async function AdminSEOPage() {
  const redirects = await listRedirects();
  return <RedirectsClient initial={redirects} />;
}
