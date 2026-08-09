import Link from "next/link";
import type { Metadata } from "next";
import { CITIES, CATEGORIES } from "@/lib/constants";
import { getListings, getEvents } from "@/lib/data";
import ListingCard from "@/components/listing-card";

export const metadata: Metadata = {
  title: "Events4Singles — Australian Singles Events Directory",
};

export default function HomePage() {
  const featured = getListings().filter((l) => l.tier === "premium").slice(0, 4);
  const upcoming = getEvents().slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-teal-400 text-sm font-semibold uppercase tracking-widest mb-4">
            Australia&apos;s Singles Events Directory
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
            Find singles events<br />near you
          </h1>
          <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto">
            Speed dating, dinner parties, dance classes and social clubs — curated events
            for singles across every major Australian city.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {CITIES.map((city) => (
              <Link
                key={city.id}
                href={`/${city.id}`}
                className="bg-white text-teal-800 font-semibold px-5 py-2.5 rounded-lg hover:bg-teal-50 transition-colors text-sm"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Browse by category</h2>
          <p className="text-slate-600 mb-8">Find the type of event that suits you</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/sydney/${cat.id}`}
                className="bg-white border border-slate-200 rounded-xl p-4 text-center hover:border-teal-300 hover:shadow-sm transition-all"
              >
                <p className="font-semibold text-slate-800 text-sm">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured listings */}
      {featured.length > 0 && (
        <section className="py-14 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Featured businesses</h2>
            <p className="text-slate-600 mb-8">Premium-listed organisers across Australia</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {featured.map((listing) => (
                <ListingCard key={listing.id} listing={listing} showCity />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming events */}
      {upcoming.length > 0 && (
        <section className="py-14 px-4 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Upcoming events</h2>
            <p className="text-slate-600 mb-8">Events happening soon</p>
            <div className="flex flex-col gap-4">
              {upcoming.map((event) => (
                <div key={event.id} className="bg-white border border-slate-200 rounded-xl p-5 flex gap-5">
                  <div className="shrink-0 text-center w-14">
                    <p className="text-2xl font-bold text-teal-600 leading-none">
                      {new Date(event.eventDate).getDate()}
                    </p>
                    <p className="text-xs text-slate-600 uppercase">
                      {new Date(event.eventDate).toLocaleString("en-AU", { month: "short" })}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{event.title}</p>
                    {event.location && (
                      <p className="text-sm text-slate-600 mt-0.5">{event.location}</p>
                    )}
                    <div className="flex gap-3 mt-2 text-xs text-slate-600">
                      <span className="capitalize">{event.cityId.replace("-", " ")}</span>
                      {event.price != null && <span>${event.price}</span>}
                    </div>
                  </div>
                  {event.bookingUrl && (
                    <a
                      href={event.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto shrink-0 self-center text-sm bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      Book
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Advertiser CTA */}
      <section className="py-14 px-4 bg-teal-700 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Run singles events?</h2>
          <p className="text-teal-100 text-lg mb-8">
            List your business on Australia&apos;s longest-running singles events directory.
            Plans from $39/month.
          </p>
          <Link
            href="/portal"
            className="inline-block bg-white text-teal-700 font-semibold px-8 py-3 rounded-lg hover:bg-teal-50 transition-colors"
          >
            List your business
          </Link>
        </div>
      </section>
    </>
  );
}
