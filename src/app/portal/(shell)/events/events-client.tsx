"use client";

import { useState } from "react";
import Modal from "@/components/portal/modal";
import EventCreateForm from "./event-create-form";

type Event = { id: string; title: string; starts_at: string; city: string; status: string; category: string };

export default function EventsClient({
  events,
  createEvent,
}: {
  events: Event[];
  createEvent: (fd: FormData) => Promise<void>;
}) {
  const [showModal, setShowModal] = useState(false);
  const [list, setList] = useState(events);

  async function handleCreate(fd: FormData) {
    await createEvent(fd);
    setShowModal(false);
    window.location.reload();
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
        <h1 className="p-page-title" style={{ margin: 0 }}>Events</h1>
        <button className="p-btn p-btn--primary" onClick={() => setShowModal(true)}>+ Add event</button>
      </div>
      <p className="p-muted">Events submitted to the Events4Singles calendar.</p>

      <div className="p-card" style={{ marginTop: "20px" }}>
        {list.length === 0 ? (
          <div className="p-empty">
            <p>No events submitted yet.</p>
            <p style={{ fontSize: "13px" }}>Click <strong>Add event</strong> to submit an event for review.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--p-border)" }}>
                <th className="p-label" style={{ textAlign: "left", padding: "8px 0", fontWeight: 600 }}>Event</th>
                <th className="p-label" style={{ textAlign: "left", padding: "8px 0", fontWeight: 600 }}>Date</th>
                <th className="p-label" style={{ textAlign: "left", padding: "8px 0", fontWeight: 600 }}>City</th>
                <th className="p-label" style={{ textAlign: "left", padding: "8px 0", fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map((ev) => (
                <tr key={ev.id} style={{ borderBottom: "1px solid var(--p-border)" }}>
                  <td style={{ padding: "10px 0", fontSize: "14px", color: "var(--p-ink)" }}>{ev.title}</td>
                  <td style={{ padding: "10px 0", fontSize: "13px", color: "var(--p-muted)" }}>
                    {new Date(ev.starts_at).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "10px 0", fontSize: "13px", color: "var(--p-muted)" }}>{ev.city}</td>
                  <td style={{ padding: "10px 0" }}>
                    <span style={{
                      fontSize: "12px", padding: "2px 8px", borderRadius: "12px",
                      background: ev.status === "approved" ? "#d1fae5" : ev.status === "rejected" ? "#fee2e2" : "#fef3c7",
                      color: ev.status === "approved" ? "#065f46" : ev.status === "rejected" ? "#991b1b" : "#92400e",
                    }}>{ev.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal title="Add an event" onClose={() => setShowModal(false)}>
          <EventCreateForm createEvent={handleCreate} onCancel={() => setShowModal(false)} />
        </Modal>
      )}
    </>
  );
}
