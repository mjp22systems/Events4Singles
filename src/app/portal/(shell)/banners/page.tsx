import { currentUser } from "@clerk/nextjs/server";
import { getAccount, getBannersForAccount, createBanner } from "@/lib/portal-db";
import BannersClient from "./banners-client";

export const dynamic = "force-dynamic";

async function submitBanner(fd: FormData) {
  "use server";
  const user = await currentUser();
  if (!user) return;
  const account = await (await import("@/lib/portal-db")).getAccount(user.id);
  if (!account) return;

  const imageUrl = fd.get("image_url") as string;
  const linkUrl = fd.get("link_url") as string;
  const title = fd.get("title") as string | null;

  if (!imageUrl || !linkUrl) return;
  await createBanner(account.id, imageUrl, linkUrl, title || undefined);
}

export default async function PortalBanners() {
  const user = await currentUser();
  const account = await getAccount(user!.id);
  const banners = account ? await getBannersForAccount(account.id) : [];

  return <BannersClient banners={banners} submitBanner={submitBanner} />;
}
