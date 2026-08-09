import Link from "next/link";
import { CITIES, CATEGORIES } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <p className="text-white font-bold text-lg mb-1">
              Events<span className="text-teal-400">4Singles</span>
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Australia&apos;s singles events directory since 2001.
            </p>
          </div>

          <div>
            <p className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">Cities</p>
            <ul className="space-y-1.5">
              {CITIES.map((city) => (
                <li key={city.id}>
                  <Link
                    href={`/${city.id}`}
                    className="text-slate-400 hover:text-teal-400 text-sm transition-colors"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">Categories</p>
            <ul className="space-y-1.5">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/sydney/${cat.id}`}
                    className="text-slate-400 hover:text-teal-400 text-sm transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">Advertise</p>
            <ul className="space-y-1.5">
              <li>
                <Link href="/portal" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">
                  List Your Business
                </Link>
              </li>
              <li>
                <Link href="/portal" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/portal" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">
                  Advertiser Portal
                </Link>
              </li>
              <li>
                <a
                  href="mailto:info@events4singles.com"
                  className="text-slate-400 hover:text-teal-400 text-sm transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Events4Singles. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
