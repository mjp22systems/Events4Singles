import type { Metadata } from "next";
import Link from "next/link";
import { TIERS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Advertiser Portal",
};

const TIER_STYLES: Record<string, string> = {
  starter: "border-teal-300 bg-teal-50",
  professional: "border-purple-300 bg-purple-50",
  premium: "border-amber-300 bg-amber-50",
};

const TIER_BTN: Record<string, string> = {
  starter: "bg-teal-600 hover:bg-teal-700",
  professional: "bg-purple-600 hover:bg-purple-700",
  premium: "bg-amber-600 hover:bg-amber-700",
};

const TIER_FEATURES: Record<string, string[]> = {
  starter: ["Logo + description", "Contact details + link", "Standard placement", "Up to 2 events/month"],
  professional: ["Full profile + image gallery", "Unlimited event listings", "Featured placement", "Analytics dashboard"],
  premium: ["Sticky top-of-page listing", "Banner ad rotation", "All city pages", "Priority in events calendar", "Dedicated landing page"],
};

export default function PortalPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Advertiser Portal</h1>
        <p className="text-slate-600 max-w-xl mx-auto">
          List your singles events business on Australia&apos;s longest-running directory.
          Self-service portal launching soon — sign up to be notified.
        </p>
      </div>

      {/* Pricing */}
      <div className="grid sm:grid-cols-3 gap-6 mb-12">
        {(["starter", "professional", "premium"] as const).map((tier) => (
          <div
            key={tier}
            className={`border-2 rounded-2xl p-6 ${TIER_STYLES[tier]}`}
          >
            <p className="font-bold text-slate-900 text-lg mb-1 capitalize">{TIERS[tier].name}</p>
            <p className="text-3xl font-bold text-slate-900 mb-1">
              ${TIERS[tier].price}
              <span className="text-base font-normal text-slate-600">/mo</span>
            </p>
            <ul className="mt-4 space-y-2">
              {TIER_FEATURES[tier].map((f) => (
                <li key={f} className="text-sm text-slate-700 flex gap-2">
                  <span className="text-teal-600 font-bold shrink-0">+</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Coming soon / contact */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Self-service portal coming soon</h2>
        <p className="text-slate-300 mb-6">
          In the meantime, contact us to get your business listed.
        </p>
        <a
          href="mailto:info@events4singles.com"
          className="inline-block bg-teal-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-teal-400 transition-colors"
        >
          Contact us to list
        </a>
        <p className="mt-4 text-slate-400 text-sm">
          Or{" "}
          <Link href="/" className="text-teal-400 hover:text-teal-300 transition-colors">
            browse listings
          </Link>{" "}
          to see your competitors.
        </p>
      </div>
    </div>
  );
}
