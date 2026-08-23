import type { Integration } from "@/lib/admin-db";
import type { EventDraft, SyncAdapter } from "@/lib/sync-engine";
import { cityNameToDbSlug, parseIntegrationConfig } from "@/lib/adapters/shared";

type IcalEvent = Record<string, string>;

function unfoldIcal(input: string): string[] {
  return input
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .reduce<string[]>((lines, line) => {
      if (/^[ \t]/.test(line) && lines.length) {
        lines[lines.length - 1] += line.slice(1);
      } else {
        lines.push(line);
      }
      return lines;
    }, []);
}

function unescapeIcal(value: string): string {
  return value
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\")
    .trim();
}

function parseDate(value: string | undefined): string | null {
  if (!value) return null;
  const dateOnly = value.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (dateOnly) return `${dateOnly[1]}-${dateOnly[2]}-${dateOnly[3]}T00:00:00`;

  const dateTime = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/);
  if (!dateTime) return null;
  const formatted = `${dateTime[1]}-${dateTime[2]}-${dateTime[3]}T${dateTime[4]}:${dateTime[5]}:${dateTime[6]}`;
  return dateTime[7] ? `${formatted}Z` : formatted;
}

function inferCity(location: string | null): string | null {
  if (!location) return null;
  const parts = location.split(",").map((part) => part.trim()).filter(Boolean);
  for (const part of parts.reverse()) {
    const city = cityNameToDbSlug(part);
    if (city) return city;
  }
  return cityNameToDbSlug(location);
}

function parseEvents(input: string): IcalEvent[] {
  const events: IcalEvent[] = [];
  let current: IcalEvent | null = null;

  for (const line of unfoldIcal(input)) {
    const divider = line.indexOf(":");
    if (divider === -1) continue;

    const rawName = line.slice(0, divider);
    const value = unescapeIcal(line.slice(divider + 1));
    const name = rawName.split(";")[0].toUpperCase();

    if (name === "BEGIN" && value.toUpperCase() === "VEVENT") {
      current = {};
      continue;
    }

    if (name === "END" && value.toUpperCase() === "VEVENT") {
      if (current) events.push(current);
      current = null;
      continue;
    }

    if (current) current[name] = value;
  }

  return events;
}

export const icalAdapter: SyncAdapter = {
  platform: "ical",
  async fetchEvents(integration: Integration): Promise<EventDraft[]> {
    const config = parseIntegrationConfig(integration.config);
    const feedUrl = typeof config.feed_url === "string" ? config.feed_url.trim() : "";
    if (!feedUrl) throw new Error("iCal integration is missing config.feed_url");

    const response = await fetch(feedUrl, { headers: { Accept: "text/calendar,text/plain,*/*" } });
    if (!response.ok) throw new Error(`iCal fetch failed: ${response.status}`);

    const text = await response.text();
    const drafts: EventDraft[] = [];
    for (const event of parseEvents(text)) {
      const startsAt = parseDate(event.DTSTART);
      if (!event.SUMMARY || !startsAt) continue;

      const sourceId = event.UID || event.URL || `${event.SUMMARY}-${startsAt}`;
      const location = event.LOCATION || null;
      drafts.push({
        title: event.SUMMARY,
        description: event.DESCRIPTION || null,
        starts_at: startsAt,
        ends_at: parseDate(event.DTEND),
        timezone: "Australia/Sydney",
        venue_name: location,
        address: location,
        suburb: null,
        city: inferCity(location),
        source_id: sourceId,
        source_url: event.URL || null,
        ticket_url: event.URL || null,
        image_url: null,
        category: null,
      });
    }

    return drafts;
  },
};
