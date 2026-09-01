"use client";
import { useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { toUrlSlug } from "@/lib/constants";
import type { City, Category } from "@/lib/types";

function usePersisted(key: string, defaultVal: boolean): [boolean, (v: boolean | ((p: boolean) => boolean)) => void] {
  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return defaultVal;
    const saved = window.localStorage.getItem(key);
    return saved === null ? defaultVal : saved === "1";
  }, [defaultVal, key]);
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === "undefined") return () => {};
      const storageEventName = `e4s-storage:${key}`;
      const onStorage = (event: StorageEvent) => {
        if (event.key === key) onStoreChange();
      };

      window.addEventListener("storage", onStorage);
      window.addEventListener(storageEventName, onStoreChange);
      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(storageEventName, onStoreChange);
      };
    },
    [key],
  );
  const val = useSyncExternalStore(subscribe, getSnapshot, () => defaultVal);
  function set(next: boolean | ((p: boolean) => boolean)) {
    const resolved = typeof next === "function" ? next(getSnapshot()) : next;
    window.localStorage.setItem(key, resolved ? "1" : "0");
    window.dispatchEvent(new Event(`e4s-storage:${key}`));
  }
  return [val, set];
}

interface Props {
  cities: City[];
  categories: Category[];
  catMid: number;
}

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`e4s-footer__chevron${open ? " e4s-footer__chevron--open" : ""}`}
    />
  );
}

function Accordion({
  heading,
  id,
  open,
  onToggle,
  children,
}: {
  heading: string;
  id: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`e4s-footer__accordion${open ? " e4s-footer__accordion--open" : ""}`}>
      <h2 className="e4s-footer__accordion-heading">
        <button
          aria-controls={id}
          aria-expanded={open}
          className="e4s-footer__accordion-btn"
          onClick={onToggle}
          type="button"
        >
          <span className="e4s-footer__accordion-label">{heading}</span>
          <Chevron open={open} />
        </button>
      </h2>
      <div className="e4s-footer__accordion-body" id={id}>
        {children}
      </div>
    </div>
  );
}

export default function FooterContent({ cities, categories, catMid }: Props) {
  const [masterOpen, setMasterOpen] = usePersisted("e4s-footer-master", true);
  const [advertOpen, setAdvertOpen] = usePersisted("e4s-footer-advert", true);
  const [citiesOpen, setCitiesOpen] = usePersisted("e4s-footer-cities", true);
  const [catsOpen, setCatsOpen] = usePersisted("e4s-footer-cats", true);

  function toggleMaster() {
    const next = !masterOpen;
    setMasterOpen(next);
    setAdvertOpen(next);
    setCitiesOpen(next);
    setCatsOpen(next);
    localStorage.setItem("e4s-footer-advert", next ? "1" : "0");
    localStorage.setItem("e4s-footer-cities", next ? "1" : "0");
    localStorage.setItem("e4s-footer-cats", next ? "1" : "0");
  }

  return (
    <>
      {masterOpen && (
        <div className="e4s-shell e4s-footer__grid">
          <div className="e4s-footer__brand">
            <section>
              <h2>Events4Singles</h2>
              <p>
                Australia&rsquo;s original singles events directory, online since 2001.
                We connect Australian singles with speed dating, dinner parties, dance
                classes, introduction agencies, social clubs and more across Sydney,
                Melbourne, Brisbane, Perth, Adelaide, Gold Coast, Canberra and beyond.
              </p>
              <p>
                Over 20 years of listings. Hundreds of businesses. Thousands of singles
                finding their people every week.
              </p>
            </section>
            <Accordion
              heading="Site Information"
              id="footer-advertise"
              open={advertOpen}
              onToggle={() => setAdvertOpen((v) => !v)}
            >
              <nav aria-label="Footer site information" className="e4s-footer__advertise-nav">
                <Link href="/advertise">List Your Business</Link>
                <Link href="/advertise#pricing">Pricing Plans</Link>
                <Link href="/portal">Advertiser Portal</Link>
                <Link href="/dating-resources">Dating Resources</Link>
                <Link href="/businesses">Business Directory</Link>
                <Link href="/about">About Events4Singles</Link>
                <Link href="/contact">Contact Us</Link>
                <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </nav>
            </Accordion>
          </div>

          <Accordion
            heading="Cities"
            id="footer-cities"
            open={citiesOpen}
            onToggle={() => setCitiesOpen((v) => !v)}
          >
            <nav aria-label="Footer cities" className="e4s-footer__cities">
              {cities.map((city) => (
                <Link key={city.slug} href={`/${toUrlSlug(city.slug)}`}>
                  {city.label}
                </Link>
              ))}
            </nav>
          </Accordion>

          <Accordion
            heading="Categories"
            id="footer-categories"
            open={catsOpen}
            onToggle={() => setCatsOpen((v) => !v)}
          >
            <div className="e4s-footer__pair">
              <nav aria-label="Footer categories A">
                {categories.slice(0, catMid).map((cat) => (
                  <Link key={cat.slug} href={`/${toUrlSlug(cat.slug)}`}>
                    {cat.label}
                  </Link>
                ))}
              </nav>
              <nav aria-label="Footer categories B">
                {categories.slice(catMid).map((cat) => (
                  <Link key={cat.slug} href={`/${toUrlSlug(cat.slug)}`}>
                    {cat.label}
                  </Link>
                ))}
              </nav>
            </div>
          </Accordion>
        </div>
      )}

      <div className="e4s-shell e4s-footer__legal">
        <div>
          <p>&copy; {new Date().getFullYear()} Events4Singles. All rights reserved.</p>
          <p>
            <Link href="/privacy-policy">Privacy Policy</Link>
            {" - "}
            <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
          </p>
        </div>
        <button
          aria-label={masterOpen ? "Collapse footer" : "Expand footer"}
          className="e4s-footer__master-toggle"
          onClick={toggleMaster}
          type="button"
        >
          <Chevron open={masterOpen} />
        </button>
      </div>
    </>
  );
}
