import type { Metadata } from "next";
import Link from "next/link";
import NewEventForm from "./new-event-form";

export const metadata: Metadata = { title: "New Event" };

export default function NewEventPage() {
  return (
    <>
      <div className="a-inline-e5cf13bb" >
        <Link href="/admin/events" className="a-btn a-btn-ghost a-inline-fed8595c" >
          ← Events
        </Link>
      </div>
      <h1 className="a-page-title">New Event</h1>
      <NewEventForm />
    </>
  );
}
