import Link from "next/link";
import BodyClass from "@/components/body-class";
import PathwayPager from "@/components/pathway-pager";
import { getCategoryCardImage, getCategoryCardSummary } from "@/lib/category-card-assets";
import type { PathwayContent } from "@/lib/pathways";

export default function PathwayPage({ pathway }: { pathway: PathwayContent }) {
  return (
    <>
      <BodyClass add="e4s-page-info" />
      <PathwayPager currentSlug={pathway.slug} />
      <main className={`e4s-pathway-page e4s-pathway-page--${pathway.id}`} id="site-content">
        <section className="e4s-pathway-hero">
          <div className="e4s-shell e4s-pathway-hero__grid">
            <div className="e4s-pathway-hero__copy">
              <p className="e4s-pathway-eyebrow">{pathway.eyebrow}</p>
              <h1>{pathway.title}</h1>
              <p className="e4s-pathway-hero__lead">{pathway.heroLead}</p>
              <div className="e4s-pathway-hero__actions">
                <Link className="e4s-pathway-btn e4s-pathway-btn--primary" href="#pathway-benefits">
                  {pathway.primaryCta}
                </Link>
                <Link className="e4s-pathway-btn" href="#pathway-categories">
                  {pathway.secondaryCta}
                </Link>
              </div>
            </div>
            <div className="e4s-pathway-hero__image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={pathway.title} src={pathway.image} />
              <span>{pathway.number}</span>
            </div>
          </div>
        </section>

        <section className="e4s-shell e4s-pathway-intro">
          {pathway.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        <section className="e4s-pathway-band" id="pathway-benefits">
          <div className="e4s-shell">
            <div className="e4s-pathway-section-head">
              <p className="e4s-pathway-eyebrow">Why it helps</p>
              <h2>The beauty of this path</h2>
            </div>
            <div className="e4s-pathway-benefits">
              {pathway.benefits.map((benefit) => (
                <article key={benefit.title} className="e4s-pathway-benefit">
                  <h3>{benefit.title}</h3>
                  <p>{benefit.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="e4s-shell e4s-pathway-categories" id="pathway-categories">
          <div className="e4s-pathway-section-head">
            <p className="e4s-pathway-eyebrow">Explore categories</p>
            <h2>Services and experiences in this direction</h2>
          </div>
          <div className="e4s-home-cat-grid e4s-pathway-category-grid">
            {pathway.categories.map((category) => {
              const image = getCategoryCardImage(category.slug);
              return (
                <Link key={category.slug} className="e4s-home-cat-tile" href={`/${category.slug}`}>
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt={category.label} loading="lazy" src={image} />
                  ) : (
                    <span className="e4s-home-cat-tile__fallback" aria-hidden="true" />
                  )}
                  <span className="e4s-home-cat-tile__copy">
                    <span className="e4s-home-cat-tile__label">{category.label}</span>
                    <span className="e4s-home-cat-tile__sub">{getCategoryCardSummary(category.slug, category.note)}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="e4s-shell e4s-pathway-editorial">
          {pathway.sections.map((section) => (
            <article key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.copy}</p>
            </article>
          ))}
        </section>

        <section className="e4s-pathway-band e4s-pathway-band--light">
          <div className="e4s-shell e4s-pathway-faq">
            <div className="e4s-pathway-section-head">
              <p className="e4s-pathway-eyebrow">Good to know</p>
              <h2>Questions singles often ask</h2>
            </div>
            <div className="e4s-pathway-faq__list">
              {pathway.faqs.map((faq) => (
                <article key={faq.question}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="e4s-shell e4s-pathway-final">
          <h2>Ready to choose your next step?</h2>
          <p>{pathway.description}</p>
          <Link className="e4s-pathway-btn e4s-pathway-btn--primary" href="#pathway-benefits">
            {pathway.primaryCta}
          </Link>
        </section>
      </main>
    </>
  );
}
