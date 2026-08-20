import type { Metadata } from "next";
import Link from "next/link";
import NewEventForm from "./new-event-form";

export const metadata: Metadata = { title: "New Event" };

export default function NewEventPage() {
  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/admin/events" className="a-btn a-btn-ghost" style={{ fontSize: "12px", padding: "4px 10px", minHeight: "auto" }}>
          ← Events
        </Link>
      </div>
      <h1 className="a-page-title">New Event</h1>
      <NewEventForm />
    </>
  );
}
