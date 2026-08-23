"use client";

import { useCallback, useMemo, useState } from "react";
import { Eye, EyeOff, Send } from "lucide-react";
import Modal from "@/components/portal/modal";
import EventCreateForm from "./event-create-form";
import type { Category, City } from "@/lib/types";
import type { PortalEvent, PortalMediaAsset } from "@/lib/portal-db";

type SortKey = "title" | "starts_at" | "city" | "source" | "shared_status" | "status";
type SortDirection = "asc" | "desc";

const STATUS_ORDER = ["pending", "approved", "hidden", "rejected", "cancelled", "draft"];
const SOURCE_ORDER = ["admin", "advertiser", "eventbrite", "meetup", "humanitix", "ical", "trybooking"];

function formatEventDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatPrice(min: number | null) {
  if (min === null) return "—";
  if (min === 0) return "Free";
  return `$${(min / 100).toFixed(0)}`;
}

function platformLabel(platform: string) {
  return platform
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function EventsClient({
  events,
  mediaAssets,
  cities,
  categories,
  hasPushIntegration,
  createEvent,
  updateEvent,
  deleteEvent,
  approveEvent,
  approveEvents,
  hideEvent,
}: {
  events: PortalEvent[];
  mediaAssets: PortalMediaAsset[];
  cities: City[];
  categories: Category[];
  hasPushIntegration: boolean;
  createEvent: (fd: FormData) => Promise<void>;
  updateEvent: (fd: FormData) => Promise<void>;
  deleteEvent: (fd: FormData) => Promise<{ ok: boolean; message: string }>;
  approveEvent: (fd: FormData) => Promise<{ ok: boolean; message: string }>;
  approveEvents: (fd: FormData) => Promise<{ ok: boolean; message: string }>;
  hideEvent: (fd: FormData) => Promise<{ ok: boolean; message: string }>;
}) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<PortalEvent | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pushingId, setPushingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("starts_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [bulkAction, setBulkAction] = useState("");
  const [hideApproved, setHideApproved] = useState(false);

  const cityLabels = useMemo(() => new Map(cities.map((city) => [city.slug, city.label])), [cities]);
  const cityLabel = useCallback((city: string | null | undefined) => {
    if (!city) return "";
    const knownLabel = cityLabels.get(city);
    if (knownLabel) return knownLabel;
    return city
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }, [cityLabels]);
  const sharedDestinations = useCallback((event: PortalEvent) => {
    const destinations: Array<{ platform: string; status: string; url?: string | null; externalId?: string | null }> = [];
    for (const ref of (event.shared_refs ?? "").split("\u001e")) {
      const [platform, url, externalId] = ref.split("|");
      if (!platform || destinations.some((item) => item.platform.toLowerCase() === platform.toLowerCase() && item.externalId === externalId)) continue;
      destinations.push({
        platform: platformLabel(platform),
        status: "Shared",
        url: url || null,
        externalId: externalId || null,
      });
    }
    if (event.push_id || event.push_url) {
      if (destinations.some((item) => item.platform.toLowerCase() === "eventbrite")) return destinations;
      destinations.push({
        platform: "Eventbrite",
        status: "Shared",
        url: event.push_url,
        externalId: event.push_id,
      });
    }
    return destinations;
  }, []);
  const cityOptions = useMemo(
    () => Array.from(new Set(events.map((event) => event.city).filter(Boolean))).sort((a, b) => cityLabel(a).localeCompare(cityLabel(b))),
    [cityLabel, events],
  );
  const sourceOptions = useMemo(() => {
    const sources = Array.from(new Set(events.map((event) => event.source || "advertiser")));
    return sources.sort((a, b) => {
      const ai = SOURCE_ORDER.indexOf(a);
      const bi = SOURCE_ORDER.indexOf(b);
      if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      return sourceLabel(a).localeCompare(sourceLabel(b));
    });
  }, [events]);
  const statusOptions = useMemo(() => {
    const statuses = Array.from(new Set(events.map((event) => event.status).filter(Boolean)));
    return statuses.sort((a, b) => {
      const ai = STATUS_ORDER.indexOf(a);
      const bi = STATUS_ORDER.indexOf(b);
      if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      return statusLabel(a).localeCompare(statusLabel(b));
    });
  }, [events]);
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = events.filter((event) => {
      const source = event.source || "advertiser";
      if (hideApproved && event.status === "approved") return false;
      if (cityFilter !== "all" && event.city !== cityFilter) return false;
      if (sourceFilter !== "all" && source !== sourceFilter) return false;
      if (statusFilter !== "all" && event.status !== statusFilter) return false;
      if (!q) return true;
      return [
        event.title,
        event.suburb,
        cityLabel(event.city),
        sourceLabel(source),
        statusLabel(event.status),
      ].some((value) => value?.toLowerCase().includes(q));
    });

    return [...filtered].sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      const av = sortKey === "starts_at"
        ? new Date(a.starts_at).getTime()
        : sortKey === "shared_status"
          ? sharedDestinations(a).length
          : sortKey === "city"
            ? cityLabel(a.city).toLowerCase()
          : String(a[sortKey] ?? "").toLowerCase();
      const bv = sortKey === "starts_at"
        ? new Date(b.starts_at).getTime()
        : sortKey === "shared_status"
          ? sharedDestinations(b).length
          : sortKey === "city"
            ? cityLabel(b.city).toLowerCase()
          : String(b[sortKey] ?? "").toLowerCase();
      if (av < bv) return -1 * direction;
      if (av > bv) return 1 * direction;
      return 0;
    });
  }, [cityFilter, cityLabel, events, hideApproved, query, sharedDestinations, sortDirection, sortKey, sourceFilter, statusFilter]);
  const selectable = list;
  const selectedCount = selectedIds.size;
  const allSelectableSelected = selectable.length > 0 && selectable.every((event) => selectedIds.has(event.id));
  const selectedEvents = useMemo(() => events.filter((event) => selectedIds.has(event.id)), [events, selectedIds]);
  const selectedApprovableCount = selectedEvents.filter((event) => event.status !== "approved").length;
  const selectedPushableEvents = selectedEvents.filter((event) => event.status === "approved");
  const selectedPushableCount = selectedPushableEvents.length;
  const hasFilters = Boolean(query) || cityFilter !== "all" || sourceFilter !== "all" || statusFilter !== "all" || hideApproved;
  const sortValue = `${sortKey}:${sortDirection}`;

  async function handleCreate(fd: FormData) {
    await createEvent(fd);
    setShowModal(false);
    window.location.reload();
  }

  async function handleUpdate(fd: FormData) {
    await updateEvent(fd);
    setEditing(null);
    window.location.reload();
  }

  async function handleDelete(event: PortalEvent) {
    if (!confirm(`Delete ${event.title}?`)) return;
    const fd = new FormData();
    fd.set("id", event.id);
    const result = await deleteEvent(fd);
    setMessage(result.message);
    if (result.ok) window.location.reload();
  }

  async function handleApprove(event: PortalEvent) {
    const fd = new FormData();
    fd.set("id", event.id);
    const result = await approveEvent(fd);
    setMessage(result.message);
    if (result.ok) window.location.reload();
  }

  async function handleHide(event: PortalEvent) {
    const fd = new FormData();
    fd.set("id", event.id);
    const result = await hideEvent(fd);
    setMessage(result.message);
    if (result.ok) window.location.reload();
  }

  async function handlePush(ev: PortalEvent) {
    const alreadyPushed = Boolean(ev.push_id);
    if (!confirm(`${alreadyPushed ? "Update" : "Push"} "${ev.title}" ${alreadyPushed ? "on" : "to"} Eventbrite?`)) return;
    setPushingId(ev.id);
    try {
      const res = await fetch(`/api/portal/events/${ev.id}/push`, { method: "POST" });
      const data = await res.json() as { ok?: boolean; action?: "created" | "updated"; push_url?: string; warning?: string; error?: string };
      if (data.ok) {
        const verb = data.action === "updated" ? "Updated on Eventbrite" : "Pushed to Eventbrite";
        setMessage(data.warning ? `${verb} with warning: ${data.warning}` : `${verb} successfully.`);
        window.location.reload();
      } else {
        setMessage(`Push failed: ${data.error ?? "Unknown error"}`);
      }
    } catch {
      setMessage("Push failed: network error");
    } finally {
      setPushingId(null);
    }
  }

  async function handleRowAction(ev: PortalEvent, action: string) {
    if (action === "approve") {
      await handleApprove(ev);
      return;
    }
    if (action === "hide") {
      await handleHide(ev);
      return;
    }
    if (action === "push") {
      await handlePush(ev);
      return;
    }
    if (action === "view" && ev.push_url) {
      window.open(ev.push_url, "_blank", "noopener,noreferrer");
      return;
    }
    if (action === "edit") {
      setEditing(ev);
      return;
    }
    if (action === "delete") {
      await handleDelete(ev);
    }
  }

  async function handleBulkApprove() {
    if (selectedApprovableCount === 0) {
      setMessage("Select at least one event that is not already approved.");
      return;
    }
    const fd = new FormData();
    for (const id of selectedIds) fd.append("ids", id);
    const result = await approveEvents(fd);
    setMessage(result.message);
    if (result.ok) window.location.reload();
  }

  async function handleBulkHide() {
    if (selectedCount === 0) {
      setMessage("Select at least one event to hide.");
      return;
    }
    if (!confirm(`Hide ${selectedCount} selected event(s)?`)) return;
    let hidden = 0;
    let failed = 0;
    for (const event of selectedEvents) {
      const fd = new FormData();
      fd.set("id", event.id);
      const result = await hideEvent(fd);
      if (result.ok) hidden++;
      else failed++;
    }
    setMessage(`Bulk hide complete: ${hidden} hidden, ${failed} failed.`);
    if (hidden > 0) window.location.reload();
  }

  async function handleBulkPush() {
    if (selectedPushableCount === 0) {
      setMessage("Select at least one approved event to push to Eventbrite.");
      return;
    }
    if (!confirm(`Push or update ${selectedPushableCount} approved event(s) on Eventbrite?`)) return;
    const ids = selectedPushableEvents.map((event) => event.id);
    let pushed = 0;
    let failed = 0;
    const warnings: string[] = [];
    const errors: string[] = [];
    for (const id of ids) {
      setPushingId(id);
      try {
        const res = await fetch(`/api/portal/events/${id}/push`, { method: "POST" });
        const data = await res.json() as { ok?: boolean; warning?: string; error?: string };
        if (data.ok) {
          pushed++;
          if (data.warning) warnings.push(data.warning);
        } else {
          failed++;
          if (data.error) errors.push(data.error);
        }
      } catch {
        failed++;
        errors.push("Network error");
      }
    }
    setPushingId(null);
    const details = [...warnings, ...errors].slice(0, 2);
    setMessage(`Eventbrite push/update complete: ${pushed} succeeded, ${failed} failed${details.length ? ` — ${details.join(" ")}` : ""}`);
    if (pushed > 0) window.location.reload();
  }

  async function handleBulkApply(action = bulkAction) {
    if (selectedCount === 0) {
      setMessage("Select at least one event first.");
      return;
    }
    if (action === "approve") {
      await handleBulkApprove();
      return;
    }
    if (action === "hide") {
      await handleBulkHide();
      return;
    }
    if (action === "push") {
      await handleBulkPush();
      return;
    }
    if (action === "clear") {
      setSelectedIds(new Set());
      setBulkAction("");
      return;
    }
    setMessage("Choose a bulk action first.");
  }

  function toggleSelected(id: string, checked: boolean) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleAll(checked: boolean) {
    setSelectedIds(checked ? new Set(selectable.map((event) => event.id)) : new Set());
  }

  function handleSortChange(value: string) {
    const [nextKey, nextDirection] = value.split(":") as [SortKey, SortDirection];
    setSortKey(nextKey);
    setSortDirection(nextDirection);
  }

  function sourceLabel(source: string | null | undefined) {
    const value = source || "advertiser";
    const labels: Record<string, string> = {
      admin: "EFS Native",
      advertiser: "Advertiser",
      eventbrite: "Eventbrite",
      meetup: "Meetup",
      ical: "iCal",
      humanitix: "Humanitix",
      trybooking: "TryBooking",
    };
    return labels[value] ?? value;
  }

  function statusLabel(status: string | null | undefined) {
    if (!status) return "";
    const labels: Record<string, string> = {
      pending: "Pending",
      approved: "Approved",
      hidden: "Hidden",
      rejected: "Rejected",
      cancelled: "Cancelled",
      draft: "Draft",
    };
    return labels[status] ?? status.replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function sharedTitle(event: PortalEvent) {
    const destinations = sharedDestinations(event);
    if (destinations.length === 0) return "Not shared anywhere yet";
    return destinations
      .map((destination) => {
        const id = destination.externalId ? ` (${destination.externalId})` : "";
        return `${destination.platform}: ${destination.status}${id}`;
      })
      .join("\n");
  }

  return (
    <>
      <div className="p-page-header">
        <h1 className="p-page-title">
          Events <span className="p-page-title__count">{list.length}</span>
        </h1>
        <button className="p-btn p-btn--primary" onClick={() => setShowModal(true)}>+ Add event</button>
      </div>
      <p className="p-muted">Events submitted to the Events4Singles calendar.</p>
      {message && <p className="p-muted" style={{ marginTop: "10px", color: message.includes("cannot") ? "#991b1b" : "var(--p-teal)" }}>{message}</p>}

      {events.length > 0 && (
        <div className="p-control-row" aria-label="Event filters and sorting">
          <input className="p-input p-table-filter p-control-row__search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search events..." aria-label="Search events" />
          <select className="p-select p-table-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
            <option value="all">All Statuses</option>
            {statusOptions.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}
          </select>
          <select className="p-select p-table-filter" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} aria-label="Filter by city">
            <option value="all">All Cities</option>
            {cityOptions.map((city) => <option key={city} value={city}>{cityLabel(city)}</option>)}
          </select>
          <select className="p-select p-table-filter" value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} aria-label="Filter by source">
            <option value="all">All Sources</option>
            {sourceOptions.map((source) => <option key={source} value={source}>{sourceLabel(source)}</option>)}
          </select>
          <select className="p-select p-table-filter" value={sortValue} onChange={(e) => handleSortChange(e.target.value)} aria-label="Sort events">
            <option value="starts_at:asc">Date (Soonest)</option>
            <option value="starts_at:desc">Date (Latest)</option>
            <option value="title:asc">Title A-Z</option>
            <option value="title:desc">Title Z-A</option>
            <option value="city:asc">City A-Z</option>
            <option value="status:asc">Status</option>
          </select>
          <button
            className="p-btn p-btn--compact"
            disabled={!hasFilters}
            onClick={() => {
              setQuery("");
              setCityFilter("all");
              setSourceFilter("all");
              setStatusFilter("all");
              setHideApproved(false);
            }}
          >
            Reset
          </button>
        </div>
      )}

      <div className="p-card" style={{ marginTop: "20px" }}>
        {events.length === 0 ? (
          <div className="p-empty">
            <p>No events submitted yet.</p>
            <p style={{ fontSize: "13px" }}>Click <strong>Add event</strong> to submit an event for review.</p>
          </div>
        ) : (
          <>
          <div className="p-bulk-row">
            <label className="p-bulk-row__select-all">
              <input
                type="checkbox"
                aria-label="Select all visible events"
                checked={allSelectableSelected}
                disabled={selectable.length === 0}
                onChange={(event) => toggleAll(event.target.checked)}
              />
              All
            </label>
            <span className="p-bulk-row__summary">
              <strong>{selectedCount}</strong> selected
              {hasFilters && <span> · {list.length} of {events.length} shown</span>}
            </span>
            <div className="p-bulk-row__right">
              <button
                className={`p-btn p-btn--compact${hideApproved ? " p-btn--active" : ""}`}
                onClick={() => setHideApproved((v) => !v)}
                title={hideApproved ? "Show approved events" : "Hide approved events"}
              >
                {hideApproved ? "Show Approved" : "Hide Approved"}
              </button>
              <select
                className="p-select p-bulk-row__action"
                value={bulkAction}
                disabled={pushingId !== null}
                onChange={async (event) => {
                  const action = event.target.value;
                  setBulkAction(action);
                  if (action) {
                    await handleBulkApply(action);
                    setBulkAction("");
                  }
                }}
                aria-label="Bulk action"
              >
                <option value="">Bulk Action...</option>
                <option value="approve" disabled={selectedCount === 0 || selectedApprovableCount === 0}>Approve Selected</option>
                <option value="hide" disabled={selectedCount === 0}>Hide Selected</option>
                {hasPushIntegration && <option value="push" disabled={selectedCount === 0 || selectedPushableCount === 0}>Push/Update Eventbrite</option>}
                <option value="clear" disabled={selectedCount === 0}>Clear Selection</option>
              </select>
            </div>
          </div>
          <div className="p-table-wrap">
          <table className="p-table p-events-table">
            <thead>
              <tr>
                <th className="p-table-select"></th>
                <th className="p-events-table__number-col">#</th>
                <th className="p-events-table__event-col">Title</th>
                <th className="p-events-table__date-col">Date</th>
                <th className="p-events-table__city-col">City</th>
                <th className="p-events-table__price-col">Price</th>
                <th className="p-events-table__source-col">Source</th>
                <th className="p-events-table__shared-col">Shared</th>
                <th className="p-events-table__status-col">Status</th>
                <th className="p-events-table__actions-col p-table--numeric">
                  <span className="p-table-heading">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-events-table__empty">No events match those filters.</td>
                </tr>
              ) : list.map((ev, index) => (
                <tr key={ev.id}>
                  <td className="p-table-select">
                    <input
                      type="checkbox"
                      aria-label={`Select ${ev.title}`}
                      checked={selectedIds.has(ev.id)}
                      onChange={(event) => toggleSelected(ev.id, event.target.checked)}
                    />
                  </td>
                  <td className="p-events-table__number">{index + 1}</td>
                  <td className="p-events-table__title" title={ev.title}>{ev.title}</td>
                  <td className="p-events-table__muted">{formatEventDate(ev.starts_at)}</td>
                  <td className="p-events-table__muted">{cityLabel(ev.city)}</td>
                  <td className="p-events-table__muted">{formatPrice(ev.price_min)}</td>
                  <td><span className="p-source-chip">{sourceLabel(ev.source)}</span></td>
                  <td>
                    {sharedDestinations(ev).length > 0 ? (
                      ev.push_url ? (
                        <a
                          className="p-share-chip p-share-chip--shared"
                          href={ev.push_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={sharedTitle(ev)}
                          aria-label={`Shared destinations for ${ev.title}: ${sharedTitle(ev)}`}
                        >
                          <Send aria-hidden="true" />
                          <span>{sharedDestinations(ev).length}</span>
                        </a>
                      ) : (
                        <span className="p-share-chip p-share-chip--shared" title={sharedTitle(ev)} aria-label={`Shared destinations for ${ev.title}: ${sharedTitle(ev)}`}>
                          <Send aria-hidden="true" />
                          <span>{sharedDestinations(ev).length}</span>
                        </span>
                      )
                    ) : (
                      <span className="p-share-chip" title={sharedTitle(ev)} aria-label={`${ev.title} has not been shared anywhere yet`}>
                        <Send aria-hidden="true" />
                        <span>0</span>
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`p-status-chip p-status-chip--${ev.status}`}>
                      {ev.status === "hidden" ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                      {statusLabel(ev.status)}
                    </span>
                  </td>
                  <td className="p-events-table__actions">
                    <select
                      className="p-select p-row-action-select"
                      aria-label={`Actions for ${ev.title}`}
                      value=""
                      disabled={pushingId === ev.id}
                      onChange={async (event) => {
                        const action = event.target.value;
                        event.target.value = "";
                        if (action) await handleRowAction(ev, action);
                      }}
                    >
                      <option value="">{pushingId === ev.id ? (ev.push_id ? "Updating…" : "Pushing…") : "Actions"}</option>
                      {ev.status === "approved" ? (
                        <option value="hide">Hide</option>
                      ) : (
                        <option value="approve">{ev.status === "hidden" ? "Show" : "Approve"}</option>
                      )}
                      {hasPushIntegration && ev.status === "approved" && (
                        <option value="push">{ev.push_id ? "Update Eventbrite" : "Push Eventbrite"}</option>
                      )}
                      {ev.push_url && <option value="view">View Eventbrite</option>}
                      <option value="edit">Edit</option>
                      <option value="delete">Delete</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          </>
        )}
      </div>

      {showModal && (
        <Modal title="Add an event" size="wide" onClose={() => setShowModal(false)}>
          <EventCreateForm mediaAssets={mediaAssets} cities={cities} categories={categories} createEvent={handleCreate} onCancel={() => setShowModal(false)} />
        </Modal>
      )}
      {editing && (
        <Modal title="Edit event" size="wide" onClose={() => setEditing(null)}>
          <EventCreateForm event={editing} mediaAssets={mediaAssets} cities={cities} categories={categories} submitLabel="Save event" createEvent={handleUpdate} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </>
  );
}
