import type { Metadata } from "next";
import { listRedirects } from "@/lib/admin-db";
import { listNotFoundHits } from "@/lib/not-found";
import RedirectsClient from "./redirects-client";

export const metadata: Metadata = { title: "Redirects" };
export const dynamic = "force-dynamic";

export default async function AdminRedirectsPage() {
  const [redirects, notFoundHits] = await Promise.all([
    listRedirects(),
    listNotFoundHits(),
  ]);
  return <RedirectsClient initial={redirects} notFoundHits={notFoundHits} />;
}
