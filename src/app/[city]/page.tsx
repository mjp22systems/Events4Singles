import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { CITIES, CATEGORIES, CITY_IDS } from "@/lib/constants";
import { getListings, getEvents } from "@/lib/data";
import ListingCard from "@/components/listing-card";
import type { CityId } from "@/lib/constants";

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return CITY_IDS.map((city) => ({ city }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = CITIES.find((c) => c.id === citySlug);
  if (!city) return {};
  return {
    title: `Singles Events in ${city.name}, ${city.state}`,
    description: `Find speed dating, dinner parties, dance classes and social clubs for singles in ${city.name}.`,
  };
}

export default async function CityPage({ params }: Props) {
  const { city: citySlug } = await params;
  const city = CITIES.find((c) => c.id === citySlug);
  if (!city) notFound();

  const listings = getListings({ cityId: citySlug as CityId });
  const events = getEvents({ cityId: citySlug as CityId });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Singles Events in {city.name}
        </h1>
        <p className="text-slate-600">
          {listings.length} businesses listed across {city.name}, {city.state}
        </p>
      </div>

      {/* Category nav */}
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/${city.id}/${cat.id}`}
            className="text-sm border border-slate-200 text-slate-700 px-4 py-1.5 rounded-full hover:border-teal-400 hover:text-teal-700 transition-colors"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Listings */}
        <div className="lg:col-span-2">
          {CATEGORIES.map((cat) => {
            const catListings = listings.filter((l) => l.categoryId === cat.id);
            if (catListings.length === 0) return null;
            return (
              <div key={cat.id} className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900">{cat.name}</h2>
                  <Link
                    href={`/${city.id}/${cat.id}`}
                    className="text-sm text-teal-600 hover:text-teal-700 transition-colors"
                  >
                    View all
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  {catListings.slice(0, 3).map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </div>
            );
          })}

          {listings.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <p className="text-lg font-medium mb-2">No listings yet for {city.name}</p>
              <p className="text-sm">Be the first to list your singles events business here.</p>
              <Link
                href="/portal"
                className="inline-block mt-6 bg-teal-600 text-white px-6 py-2.5 rounded-lg hover:bg-teal-700 transition-colors text-sm font-semibold"
              >
                List your business
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Upcoming events */}
          {events.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-5">
              <h3 className="font-bold text-slate-900 mb-4">Upcoming in {city.name}</h3>
              <div className="flex flex-col gap-3">
                {events.slice(0, 4).map((event) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="shrink-0 text-center w-10">
                      <p className="text-lg font-bold text-teal-600 leading-none">
                        {new Date(event.eventDate).getDate()}
                      </p>
                      <p className="text-xs text-slate-600 uppercase">
                        {new Date(event.eventDate).toLocaleString("en-AU", { month: "short" })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 leading-tight">{event.title}</p>
                      {event.price != null && (
                        <p className="text-xs text-slate-600 mt-0.5">${event.price}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advertise CTA */}
          <div className="bg-teal-700 rounded-xl p-5 text-white">
            <h3 className="font-bold mb-2">List your business in {city.name}</h3>
            <p className="text-teal-100 text-sm mb-4 leading-relaxed">
              Reach singles looking for events in {city.name}. Plans from $39/month.
            </p>
            <Link
              href="/portal"
              className="block text-center bg-white text-teal-700 font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-teal-50 transition-colors"
            >
              Get listed
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
