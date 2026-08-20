"use client";

import nextDynamic from "next/dynamic";
import type { PublicEvent } from "@/lib/data";

const EventsCalendar = nextDynamic(() => import("@/components/events-calendar"), {
  ssr: false,
  loading: () => <div className="e4s-cal-loading">Loading calendar…</div>,
});

interface Props {
  events: PublicEvent[];
  month: string;
}

export default function EventsCalendarLoader({ events, month }: Props) {
  return <EventsCalendar events={events} month={month} />;
}
