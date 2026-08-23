"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { eventPath } from "@/lib/event-slugs";
import type { PublicEvent } from "@/lib/data";

interface Props {
  events: PublicEvent[];
  month: string; // "YYYY-MM"
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function parseMonth(m: string): { year: number; month: number } {
  const [y, mo] = m.split("-").map(Number);
  return { year: y || new Date().getFullYear(), month: (mo || new Date().getMonth() + 1) - 1 };
}

function formatMonth(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function eventDateKey(iso: string): string {
  return iso.slice(0, 10);
}

function formatTime(iso: string, timezone: string): string {
  try {
    return new Date(iso).toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: timezone });
  } catch { return ""; }
}

function eventHref(ev: PublicEvent): string {
  return eventPath(ev);
}

export default function EventsCalendar({ events, month }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const { year, month: monthIdx } = parseMonth(month);
  const firstDay = new Date(year, monthIdx, 1).getDay();
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();

  const eventsByDay = new Map<string, PublicEvent[]>();
  for (const ev of events) {
    const key = eventDateKey(ev.starts_at);
    if (!eventsByDay.has(key)) eventsByDay.set(key, []);
    eventsByDay.get(key)!.push(ev);
  }

  function navigate(y: number, m: number) {
    const p = new URLSearchParams(searchParams.toString());
    p.set("month", formatMonth(y, m));
    p.set("view", "calendar");
    router.push(`/events?${p}`);
  }

  function prevMonth() {
    const d = new Date(year, monthIdx - 1, 1);
    navigate(d.getFullYear(), d.getMonth());
  }

  function nextMonth() {
    const d = new Date(year, monthIdx + 1, 1);
    navigate(d.getFullYear(), d.getMonth());
  }

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="e4s-cal">
      <div className="e4s-cal__nav">
        <button className="e4s-cal__nav-btn" onClick={prevMonth} type="button" aria-label="Previous month">&#8249;</button>
        <span className="e4s-cal__title">{MONTHS[monthIdx]} {year}</span>
        <button className="e4s-cal__nav-btn" onClick={nextMonth} type="button" aria-label="Next month">&#8250;</button>
      </div>

      <div className="e4s-cal__grid">
        {DAYS.map((d) => (
          <div key={d} className="e4s-cal__day-header">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} className="e4s-cal__cell e4s-cal__cell--empty" />;
          const key = `${year}-${String(monthIdx + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayEvents = eventsByDay.get(key) || [];
          const isToday = key === todayKey;
          return (
            <div key={key} className={`e4s-cal__cell${isToday ? " e4s-cal__cell--today" : ""}${dayEvents.length > 0 ? " e4s-cal__cell--has-events" : ""}`}>
              <span className="e4s-cal__day-num">{day}</span>
              {dayEvents.slice(0, 3).map((ev) => (
                <a
                  key={ev.id}
                  className="e4s-cal__event-pill"
                  href={eventHref(ev)}
                  title={ev.title}
                >
                  <span className="e4s-cal__event-time">{formatTime(ev.starts_at, ev.timezone)}</span>
                  {" "}{ev.title}
                </a>
              ))}
              {dayEvents.length > 3 && (
                <button
                  className="e4s-cal__event-more"
                  type="button"
                  onClick={() => setExpandedDay(expandedDay === key ? null : key)}
                  aria-expanded={expandedDay === key}
                >
                  +{dayEvents.length - 3} more
                </button>
              )}
              {expandedDay === key && (
                <div className="e4s-cal__day-expanded">
                  {dayEvents.map((ev) => (
                    <a key={ev.id} href={eventHref(ev)}>
                      <span>{formatTime(ev.starts_at, ev.timezone)}</span>
                      {ev.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
