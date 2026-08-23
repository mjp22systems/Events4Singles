import type { Metadata } from "next";
import Link from "next/link";
import { getAllCities, getAllCategories, getPublicEventOrganisers, getUpcomingEvents } from "@/lib/data";
import { toDbSlug } from "@/lib/constants";
import EventsFilter from "@/components/events-filter";
import EventsCalendarLoader from "@/components/events-calendar-loader";
import EventCardGrid from "@/components/event-card-grid";


export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "What's On — Upcoming Singles Events Australia",
  description: "Browse upcoming singles events across Australia — speed dating, dinner parties, social nights, dance classes and more. List view and calendar.",
};

function defaultMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; category?: string; paid?: string; organiser?: string; view?: string; month?: string }>;
}) {
  const { city, category, paid, organiser, view: viewParam, month: monthParam } = await searchParams;

  const view = viewParam === "calendar" ? "calendar" : "list";
  const month = monthParam || defaultMonth();
  const paidFilter = paid === "free" ? "free" : paid === "paid" ? "paid" : undefined;
  const cityDbSlug = city ? toDbSlug(city) : undefined;
  const categoryDbSlug = category ? toDbSlug(category) : undefined;

  const limit = view === "calendar" ? 50 : 16;

  const [events, cities, categories, organisers] = await Promise.all([
    getUpcomingEvents(limit, cityDbSlug, categoryDbSlug, paidFilter, organiser),
    getAllCities(),
    getAllCategories(),
    getPublicEventOrganisers(),
  ]);

  return (
    <main className="e4s-events-page" id="site-content">
      <div className="e4s-shell e4s-events-page-header">
        <div>
          <h1>Upcoming Singles Events &amp; What&apos;s On</h1>
          <p className="e4s-lead">
            Browse upcoming singles events, social activities, speed dating nights, walks, dinners and organiser-run events across Australia. Filter by city, category, price or organiser to find the next event that suits you.
          </p>
        </div>
        <EventsFilter
          cities={cities}
          categories={categories}
          organisers={organisers}
          selectedCity={city}
          selectedCategory={category}
          selectedPaid={paid}
          selectedOrganiser={organiser}
          view={view}
          month={month}
        />
      </div>

      {view === "calendar" ? (
        <div className="e4s-shell e4s-events-view">
          <EventsCalendarLoader events={events} month={month} />
        </div>
      ) : events.length > 0 ? (
        <EventCardGrid events={events} />
      ) : (
        <div className="e4s-shell e4s-empty-state">
          <p>No events match those filters yet.</p>
        </div>
      )}

      <div className="e4s-shell e4s-page-foot">
        <h2>List Your Event</h2>
        <p>
          Running singles events? <Link href="/advertise">View advertising packages</Link> to get
          your events in front of thousands of singles across Australia.
        </p>
      </div>
    </main>
  );
}
