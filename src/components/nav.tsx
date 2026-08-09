import Link from "next/link";
import { CITIES } from "@/lib/constants";

export default function Nav() {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-bold text-teal-600 tracking-tight">
            Events<span className="text-slate-800">4Singles</span>
          </span>
          <span className="hidden sm:inline text-xs text-slate-500 font-medium border border-slate-200 rounded px-1.5 py-0.5">
            .com
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto">
          {CITIES.map((city) => (
            <Link
              key={city.id}
              href={`/${city.id}`}
              className="text-sm text-slate-700 hover:text-teal-700 px-3 py-1.5 transition-colors whitespace-nowrap"
            >
              {city.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/portal"
            className="text-sm text-slate-600 hover:text-teal-600 px-3 py-1.5 rounded hover:bg-slate-50 transition-colors"
          >
            List Your Business
          </Link>
          <Link
            href="/portal"
            className="text-sm bg-teal-600 text-white px-3 py-1.5 rounded hover:bg-teal-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Mobile city strip */}
      <div className="lg:hidden border-t border-slate-100 overflow-x-auto">
        <div className="flex gap-1 px-4 py-2 min-w-max">
          {CITIES.map((city) => (
            <Link
              key={city.id}
              href={`/${city.id}`}
              className="text-xs text-slate-700 hover:text-teal-700 px-2.5 py-1 transition-colors whitespace-nowrap"
            >
              {city.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
