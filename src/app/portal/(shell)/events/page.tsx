import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAccount, getOrCreateAccount, getPortalEvents, listPortalIntegrations, listPortalMediaAssets } from "@/lib/portal-db";
import {
  createPortalEvent,
  deletePortalEvent,
  hidePortalEvent,
  submitPortalEventForReview,
  submitPortalEventsForReview,
  updatePortalEvent,
} from "@/lib/portal-events";
import { getAllCategories, getAllCities } from "@/lib/data";
import EventsClient from "./events-client";

export const dynamic = "force-dynamic";

async function createEvent(fd: FormData) {
  "use server";
  const user = await currentUser();
  if (!user) return;
  const account = await getAccount(user.id);
  if (!account) return;

  await createPortalEvent(account, user.emailAddresses[0]?.emailAddress ?? null, fd);
}

async function updateEvent(fd: FormData) {
  "use server";
  const user = await currentUser();
  if (!user) return;
  const account = await getAccount(user.id);
  if (!account) return;

  await updatePortalEvent(account, fd);
}

async function deleteEvent(fd: FormData) {
  "use server";
  const user = await currentUser();
  if (!user) return { ok: false, message: "Not signed in" };
  const account = await getAccount(user.id);
  if (!account) return { ok: false, message: "No account found" };

  return deletePortalEvent(account, fd.get("id"));
}

async function submitEventForReview(fd: FormData) {
  "use server";
  const user = await currentUser();
  if (!user) return { ok: false, message: "Not signed in" };
  const account = await getAccount(user.id);
  if (!account) return { ok: false, message: "No account found" };

  return submitPortalEventForReview(account, fd.get("id"));
}

async function hideEvent(fd: FormData) {
  "use server";
  const user = await currentUser();
  if (!user) return { ok: false, message: "Not signed in" };
  const account = await getAccount(user.id);
  if (!account) return { ok: false, message: "No account found" };

  return hidePortalEvent(account, fd.get("id"));
}

async function submitEventsForReview(fd: FormData) {
  "use server";
  const user = await currentUser();
  if (!user) return { ok: false, message: "Not signed in" };
  const account = await getAccount(user.id);
  if (!account) return { ok: false, message: "No account found" };

  const ids = fd.getAll("ids").map(String).filter(Boolean);
  return submitPortalEventsForReview(account, ids);
}

export default async function PortalEvents() {
  const user = await currentUser();
  if (!user) redirect("/portal/sign-in");
  const account = await getOrCreateAccount(user.id, user.emailAddresses[0]?.emailAddress);
  const [events, cities, categories, integrations, mediaAssets] = await Promise.all([
    getPortalEvents(account.id),
    getAllCities(),
    getAllCategories(),
    listPortalIntegrations(account.id),
    listPortalMediaAssets(account.id),
  ]);
  const hasPushIntegration = integrations.some(
    (i) => i.platform === "eventbrite" && i.push_enabled === 1
  );

  return <EventsClient events={events} mediaAssets={mediaAssets} cities={cities} categories={categories} hasPushIntegration={hasPushIntegration} createEvent={createEvent} updateEvent={updateEvent} deleteEvent={deleteEvent} submitEventForReview={submitEventForReview} submitEventsForReview={submitEventsForReview} hideEvent={hideEvent} />;
}
