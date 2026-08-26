"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PortalIntegration } from "@/lib/portal-db";

type ProviderMode = "oauth" | "group_url" | "feed_url";
type ScanSummary = {
  sourceCount: number;
  localCount: number;
  newCount: number;
  changedCount: number;
  matchedCount: number;
  localOnlyCount: number;
  changed: Array<{ source_id: string; title: string; fields: string[] }>;
  newEvents: Array<{ source_id: string; title: string; starts_at: string }>;
  localOnly: Array<{ source_id: string; title: string; starts_at: string }>;
};

type Provider = {
  id: string;
  label: string;
  mode: ProviderMode;
  supported: boolean;
  placeholder?: string;
  helper: string;
};

const PROVIDERS: Provider[] = [
  {
    id: "eventbrite",
    label: "Eventbrite",
    mode: "oauth",
    supported: true,
    helper: "Connect your Eventbrite account and import upcoming live events.",
  },
  {
    id: "meetup",
    label: "Meetup",
    mode: "group_url",
    supported: true,
    placeholder: "https://www.meetup.com/your-group/",
    helper: "Paste a public Meetup group URL. GraphQL is used when a Meetup token is available; otherwise the public page importer runs.",
  },
  {
    id: "ical",
    label: "iCal / Google Calendar feed",
    mode: "feed_url",
    supported: true,
    placeholder: "https://example.com/calendar.ics",
    helper: "Use this for any public calendar feed, including exported Google Calendar or website calendar feeds.",
  },
  {
    id: "humanitix",
    label: "Humanitix",
    mode: "feed_url",
    supported: false,
    helper: "Likely next source for Australian organisers.",
  },
  {
    id: "trybooking",
    label: "TryBooking",
    mode: "feed_url",
    supported: false,
    helper: "Common Australian ticketing source, but not wired yet.",
  },
  {
    id: "ticketebo",
    label: "Ticketebo",
    mode: "feed_url",
    supported: false,
    helper: "Worth planning for as a later source.",
  },
  {
    id: "stickytickets",
    label: "Sticky Tickets",
    mode: "feed_url",
    supported: false,
    helper: "Worth planning for as a later source.",
  },
];

const ERROR_MESSAGES: Record<string, string> = {
  account: "We could not find your advertiser account. Please sign out and back in, then try again.",
  config: "Eventbrite is not configured on the server yet.",
  eventbrite: "Eventbrite did not return the details needed to finish connecting.",
  organization: "Eventbrite connected, but we could not find an organization on your account.",
  save: "Eventbrite connected, but the portal could not save the integration. Please try again.",
  state: "The Eventbrite connection expired or did not match your portal session. Please try again.",
  token: "Eventbrite rejected the authorization code. Please try connecting again.",
};

function configValue(integration: PortalIntegration | undefined, key: string) {
  if (!integration?.config) return "";
  try {
    const parsed = JSON.parse(integration.config) as Record<string, unknown>;
    return typeof parsed[key] === "string" ? parsed[key] as string : "";
  } catch {
    return "";
  }
}

function providerFor(id: string) {
  return PROVIDERS.find((provider) => provider.id === id) ?? PROVIDERS[0];
}

function providerLabel(id: string) {
  return providerFor(id).label;
}

export default function IntegrationsClient({
  integrations,
  connectedPlatform,
  integrationError,
}: {
  integrations: PortalIntegration[];
  connectedPlatform?: string;
  integrationError?: string;
}) {
  const [selectedProvider, setSelectedProvider] = useState(PROVIDERS[0].id);
  const [sourceValue, setSourceValue] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [scanResults, setScanResults] = useState<Record<string, ScanSummary>>({});
  const [scanErrors, setScanErrors] = useState<Record<string, string>>({});
  const byPlatform = useMemo(
    () => new Map<string, PortalIntegration>(integrations.map((integration) => [integration.platform, integration])),
    [integrations],
  );
  const selected = providerFor(selectedProvider);
  const selectedIntegration = byPlatform.get(selected.id);
  const needsSource = selected.mode === "group_url" || selected.mode === "feed_url";
  const sourceField = selected.mode === "group_url" ? "group_url" : selected.mode === "feed_url" ? "feed_url" : "";

  async function connect(platform: string, key?: string, value?: string) {
    setBusy(platform);
    await fetch("/api/portal/integrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, ...(key ? { [key]: value } : {}) }),
    });
    window.location.reload();
  }

  async function patch(id: string, body: Record<string, boolean>) {
    setBusy(id);
    await fetch(`/api/portal/integrations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    window.location.reload();
  }

  async function disconnect(id: string) {
    if (!confirm("Disconnect this integration? Imported events will remain in the calendar.")) return;
    setBusy(id);
    await fetch(`/api/portal/integrations/${id}`, { method: "DELETE" });
    window.location.reload();
  }

  async function sync(id: string) {
    setBusy(`sync-${id}`);
    await fetch(`/api/portal/integrations/${id}/sync`, { method: "POST" });
    window.location.reload();
  }

  async function scan(id: string) {
    setBusy(`scan-${id}`);
    setScanErrors((current) => ({ ...current, [id]: "" }));
    try {
      const response = await fetch(`/api/portal/integrations/${id}/scan`, { method: "POST" });
      const body = await response.json() as { ok?: boolean; summary?: ScanSummary; error?: string };
      if (!response.ok || !body.summary) {
        setScanErrors((current) => ({ ...current, [id]: body.error ?? "Scan failed" }));
        return;
      }
      setScanResults((current) => ({ ...current, [id]: body.summary as ScanSummary }));
    } catch {
      setScanErrors((current) => ({ ...current, [id]: "Scan failed: network error" }));
    } finally {
      setBusy(null);
    }
  }

  function submitSelected(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected.supported || selectedIntegration) return;
    if (selected.mode === "oauth") return;
    connect(selected.id, sourceField, sourceValue);
  }

  return (
    <>
      <h1 className="p-page-title">Integrations</h1>
      <p className="p-muted">Connect event sources and import upcoming events into your Events4Singles calendar queue.</p>
      {connectedPlatform && (
        <p className="p-alert p-alert--success">
          {connectedPlatform === "eventbrite" ? "Eventbrite is connected." : "Integration connected."}
        </p>
      )}
      {integrationError && (
        <p className="p-alert p-alert--error">
          {ERROR_MESSAGES[integrationError] ?? "The integration could not be connected. Please try again."}
        </p>
      )}

      <section className="p-card p-integration-connect">
        <form className="p-integration-connect__form" onSubmit={submitSelected}>
          <label className="p-label" htmlFor="provider">Add integration</label>
          <div className="p-integration-connect__row">
            <select
              id="provider"
              className="p-select"
              value={selectedProvider}
              onChange={(event) => {
                setSelectedProvider(event.target.value);
                setSourceValue("");
              }}
            >
              <optgroup label="Available now">
                {PROVIDERS.filter((provider) => provider.supported).map((provider) => (
                  <option key={provider.id} value={provider.id}>{provider.label}</option>
                ))}
              </optgroup>
              <optgroup label="Planned">
                {PROVIDERS.filter((provider) => !provider.supported).map((provider) => (
                  <option key={provider.id} value={provider.id} disabled>{provider.label} - coming soon</option>
                ))}
              </optgroup>
            </select>
            {needsSource && (
              <input
                className="p-input"
                value={sourceValue}
                onChange={(event) => setSourceValue(event.target.value)}
                placeholder={selected.placeholder}
                required
              />
            )}
            {selected.mode === "oauth" ? (
              <Link
                className={`p-btn p-btn--primary${selectedIntegration ? " p-btn--disabled" : ""}`}
                href={selectedIntegration ? "/portal/integrations" : "/portal/connect/eventbrite"}
                aria-disabled={Boolean(selectedIntegration)}
              >
                {selectedIntegration ? "Connected" : "Connect"}
              </Link>
            ) : (
              <button
                className="p-btn p-btn--primary"
                disabled={!selected.supported || Boolean(selectedIntegration) || busy === selected.id}
              >
                {selectedIntegration ? "Connected" : "Connect"}
              </button>
            )}
          </div>
          <p className="p-muted p-integration-connect__help">{selected.helper}</p>
        </form>
      </section>

      <div className="p-section-header p-inline-94d668c2" >
        <div className="p-section-header__text">
          <h2 className="p-section-title p-inline-b646589c" >Connected integrations</h2>
          <p className="p-muted">Only sources you have connected appear here.</p>
        </div>
      </div>

      <div className="p-integration-list">
        {integrations.length === 0 ? (
          <div className="p-empty">
            <p>No integrations connected yet.</p>
          </div>
        ) : integrations.map((integration) => (
          <section key={integration.id} className="p-card p-integration-item">
            <div className="p-integration-item__main">
              <div>
                <h3 className="p-integration-item__title">{providerLabel(integration.platform)}</h3>
                <p className="p-muted">
                  {integration.sync_status} · {integration.event_count} imported · {integration.last_synced ? `Last synced ${new Date(integration.last_synced).toLocaleString("en-AU")}` : "Not synced yet"}
                </p>
                {integration.platform === "meetup" && (
                  <p className="p-muted p-integration-item__source">{configValue(integration, "group_url")}</p>
                )}
                {integration.platform === "ical" && (
                  <p className="p-muted p-integration-item__source">{configValue(integration, "feed_url")}</p>
                )}
                {integration.sync_error && <p className="p-alert p-alert--error">{integration.sync_error}</p>}
              </div>
              <div className="p-integration-item__actions">
                <button className="p-btn p-btn--compact" disabled={busy === `scan-${integration.id}`} onClick={() => scan(integration.id)}>
                  {busy === `scan-${integration.id}` ? "Scanning..." : "Scan"}
                </button>
                <button className="p-btn p-btn--compact" disabled={busy === `sync-${integration.id}`} onClick={() => sync(integration.id)}>Sync Now</button>
                <button className="p-btn p-btn--compact" disabled={busy === integration.id} onClick={() => disconnect(integration.id)}>Disconnect</button>
              </div>
            </div>
            {scanErrors[integration.id] && <p className="p-alert p-alert--error">{scanErrors[integration.id]}</p>}
            {scanResults[integration.id] && (
              <div className="p-integration-scan">
                <div className="p-integration-scan__stats">
                  <span><strong>{scanResults[integration.id].sourceCount}</strong> source</span>
                  <span><strong>{scanResults[integration.id].localCount}</strong> local</span>
                  <span><strong>{scanResults[integration.id].newCount}</strong> new</span>
                  <span><strong>{scanResults[integration.id].changedCount}</strong> changed</span>
                  <span><strong>{scanResults[integration.id].matchedCount}</strong> matching</span>
                  <span><strong>{scanResults[integration.id].localOnlyCount}</strong> local only</span>
                </div>
                {(scanResults[integration.id].newEvents.length > 0 || scanResults[integration.id].changed.length > 0 || scanResults[integration.id].localOnly.length > 0) && (
                  <div className="p-integration-scan__details">
                    {scanResults[integration.id].newEvents.length > 0 && (
                      <p><strong>New:</strong> {scanResults[integration.id].newEvents.map((event) => event.title).join(", ")}</p>
                    )}
                    {scanResults[integration.id].changed.length > 0 && (
                      <p><strong>Changed:</strong> {scanResults[integration.id].changed.map((event) => `${event.title} (${event.fields.join(", ")})`).join(", ")}</p>
                    )}
                    {scanResults[integration.id].localOnly.length > 0 && (
                      <p><strong>Local only:</strong> {scanResults[integration.id].localOnly.map((event) => event.title).join(", ")}</p>
                    )}
                  </div>
                )}
              </div>
            )}
            <div className="p-integration-item__toggles">
              <label className="p-check-label">
                <input type="checkbox" checked={integration.auto_approve === 1} onChange={(event) => patch(integration.id, { auto_approve: event.target.checked })} />
                Auto-approve imported events
              </label>
              <label className="p-check-label">
                <input type="checkbox" checked={integration.push_enabled === 1} onChange={(event) => patch(integration.id, { push_enabled: event.target.checked })} />
                Enable push back
              </label>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
