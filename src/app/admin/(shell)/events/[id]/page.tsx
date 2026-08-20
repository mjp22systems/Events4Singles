import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getEventById } from "@/lib/admin-db";
import EventEditForm from "./event-edit-form";

export const metadata: Metadata = { title: "Edit Event" };
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEventEditPage({ params }: Props) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/admin/events" className="a-btn a-btn-ghost" style={{ fontSize: "12px", padding: "4px 10px", minHeight: "auto" }}>
          ← Events
        </Link>
      </div>
      <h1 className="a-page-title">{event.title}</h1>
      <EventEditForm event={event} />
    </>
  );
}
