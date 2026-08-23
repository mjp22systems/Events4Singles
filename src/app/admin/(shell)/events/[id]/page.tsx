import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventById } from "@/lib/admin-db";
import AdminEditShell from "@/components/admin/edit-shell";
import EventEditForm from "./event-edit-form";

export const metadata: Metadata = { title: "Edit Event" };
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEventEditPage({ params }: Props) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  return (
    <AdminEditShell backHref="/admin/events" backLabel="← Events" title={event.title} eyebrow={`Event ID ${event.id}`}>
      <EventEditForm event={event} />
    </AdminEditShell>
  );
}
