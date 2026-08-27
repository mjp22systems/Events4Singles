import Link from "next/link";
import BodyClass from "@/components/body-class";
import {
  danceStyleDecisionPaths,
  danceStyleFamilies,
  danceStyleLinks,
} from "@/content/dance-styles";
import { breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/seo";

export default function DanceStylesGuide() {
  const jsonLd = [
    collectionPageJsonLd({
      name: "Dance Styles for Singles",
      description:
        "A guide to choosing social dance classes, dance styles and beginner-friendly ways for singles to get moving.",
      path: "/dance-classes/styles",
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Dance Classes", path: "/dance-classes" },
      { name: "Dance Styles", path: "/dance-classes/styles" },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BodyClass add="e4s-page-info" />
      <main className="e4s-pathway-page e4s-pathway-page--dance-styles" id="site-content">
        <section className="e4s-pathway-hero">
          <div className="e4s-shell e4s-pathway-hero__grid">
            <div className="e4s-pathway-hero__copy">
              <p className="e4s-pathway-eyebrow">Dance Classes</p>
              <h1>Dance Styles</h1>
              <p className="e4s-pathway-hero__lead">
                Find the kind of dance class that matches your music, mood and social comfort zone,
                then move into the styles and cities where listings are available.
              </p>
              <div className="e4s-pathway-hero__actions">
                <Link className="e4s-pathway-btn e4s-pathway-btn--primary" href="#dance-style-families">
                  Browse Styles
                </Link>
                <Link className="e4s-pathway-btn" href="/dance-classes">
                  View Dance Classes
                </Link>
              </div>
            </div>
            <div className="e4s-pathway-hero__image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Dance Styles" src="/images/categories/cards/dance-styles.webp" />
              <span>01</span>
            </div>
          </div>
        </section>

        <section className="e4s-shell e4s-pathway-intro">
          <p>
            The old Events4Singles dance pages had the right instinct: dance is not just a listing
            category. It is a way to choose a room, a rhythm and a reason to go out.
          </p>
          <p>
            Some people search directly for Salsa, Tango, Swing, Ceroc or Ballroom. Others are not
            sure yet; they know they want something lively, elegant, low-pressure, fitness-focused
            or easy to attend without a partner. This guide connects both paths.
          </p>
        </section>

        <section className="e4s-pathway-band" id="dance-style-families">
          <div className="e4s-shell">
            <div className="e4s-pathway-section-head">
              <p className="e4s-pathway-eyebrow">Choose by feel</p>
              <h2>Start with the kind of night you want</h2>
            </div>
            <div className="e4s-pathway-benefits">
              {danceStyleDecisionPaths.map((path) => (
                <article key={path.title} className="e4s-pathway-benefit">
                  <h3>{path.title}</h3>
                  <p>{path.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="e4s-shell e4s-pathway-categories" id="dance-style-links">
          <div className="e4s-pathway-section-head">
            <p className="e4s-pathway-eyebrow">Browse listings</p>
            <h2>Dance class paths people actually search for</h2>
          </div>
          <div className="e4s-home-cat-grid e4s-pathway-category-grid">
            {danceStyleLinks.map((style) => (
              <Link key={style.href} className="e4s-home-cat-tile" href={style.href}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={style.title} loading="lazy" src={style.image} />
                <span className="e4s-home-cat-tile__copy">
                  <span className="e4s-home-cat-tile__label">{style.title}</span>
                  <span className="e4s-home-cat-tile__sub">{style.summary}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="e4s-shell e4s-pathway-editorial">
          {danceStyleFamilies.map((family) => (
            <article key={family.title}>
              <p className="e4s-pathway-eyebrow">{family.mood}</p>
              <h2>{family.title}</h2>
              <p>{family.copy}</p>
              <p>
                {family.links.map((link, index) => (
                  <span key={link.href}>
                    {index > 0 ? " | " : ""}
                    <Link href={link.href}>{link.title}</Link>
                  </span>
                ))}
              </p>
            </article>
          ))}
        </section>

        <section className="e4s-pathway-band e4s-pathway-band--light">
          <div className="e4s-shell e4s-pathway-faq">
            <div className="e4s-pathway-section-head">
              <p className="e4s-pathway-eyebrow">For studios and promoters</p>
              <h2>Why dance belongs in a singles directory</h2>
            </div>
            <div className="e4s-pathway-faq__list">
              <article>
                <h3>People do not have to be dating-first to be singles-relevant</h3>
                <p>
                  Many singles choose dance because it gets them out of the house, builds confidence
                  and creates repeat social contact. A studio does not need to advertise as a singles
                  event to be useful to singles.
                </p>
              </article>
              <article>
                <h3>Style pages create targeted advertising surfaces</h3>
                <p>
                  A salsa school, tango club, Ceroc organiser or dance fitness instructor can appear
                  beside the exact intent a visitor is exploring, then refine further by city.
                </p>
              </article>
              <article>
                <h3>Good guide content makes the listing pages more trustworthy</h3>
                <p>
                  The guide helps visitors understand what kind of class may suit them before they
                  compare listings. That makes the directory feel useful even before a booking click.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="e4s-shell e4s-pathway-final">
          <h2>Ready to find a class?</h2>
          <p>
            Start with the full Dance Classes hub, choose a style, or narrow by city when you know
            where you want to go.
          </p>
          <Link className="e4s-pathway-btn e4s-pathway-btn--primary" href="/dance-classes">
            Browse Dance Classes
          </Link>
        </section>
      </main>
    </>
  );
}
