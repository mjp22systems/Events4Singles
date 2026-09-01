import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Compass,
  HandHeart,
  HeartHandshake,
  Map,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import BodyClass from "@/components/body-class";
import PathwayPager from "@/components/pathway-pager";
import { getCategoryCardImage, getCategoryCardSummary } from "@/lib/category-card-assets";
import { toUrlSlug } from "@/lib/constants";
import type { PathwayContent } from "@/lib/pathways";
import { breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/seo";

const pathwayUi: Record<
  PathwayContent["id"],
  {
    chip: string;
    heroLine: string;
    icon: LucideIcon;
    imageAlt: string;
    stats: [string, string][];
  }
> = {
  partner: {
    chip: "Dating Intention",
    heroLine: "with clearer intent",
    icon: HeartHandshake,
    imageAlt: "Singles meeting through a hosted dating event",
    stats: [
      ["8", "Dating paths"],
      ["3", "Ways to meet"],
      ["100%", "Purpose-led"],
    ],
  },
  social: {
    chip: "Social Momentum",
    heroLine: "without forcing it",
    icon: Users,
    imageAlt: "Singles enjoying a relaxed social activity together",
    stats: [
      ["8", "Social paths"],
      ["3", "Pressure reducers"],
      ["100%", "Solo-arrival friendly"],
    ],
  },
  growth: {
    chip: "Confidence & Wellbeing",
    heroLine: "for a fuller life",
    icon: Sparkles,
    imageAlt: "Single adult investing in wellbeing and personal growth",
    stats: [
      ["11", "Growth paths"],
      ["3", "Foundations"],
      ["100%", "Self-led"],
    ],
  },
};

const benefitIcons = [Compass, HandHeart, BadgeCheck];

function SectionHeading({
  action,
  actionHref,
  eyebrow,
  id,
  sub,
  title,
}: {
  action?: string;
  actionHref?: string;
  eyebrow: string;
  id?: string;
  sub?: string;
  title: string;
}) {
  return (
    <div className="e4s-dance-lovable-heading">
      <div>
        <p>{eyebrow}</p>
        <h2 id={id}>{title}</h2>
        {sub ? <span>{sub}</span> : null}
      </div>
      {action && actionHref ? (
        <Link href={actionHref}>
          {action}
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      ) : null}
    </div>
  );
}

export default function PathwayPage({ pathway }: { pathway: PathwayContent }) {
  const ui = pathwayUi[pathway.id];
  const HeroIcon = ui.icon;
  const branchCategories = pathway.categories.slice(0, 4);
  const jsonLd = [
    collectionPageJsonLd({
      name: pathway.seoTitle,
      description: pathway.seoDescription,
      path: `/${pathway.slug}`,
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: pathway.title, path: `/${pathway.slug}` },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: pathway.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link href="/dance-classes.css" rel="stylesheet" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BodyClass add="e4s-page-pathway" />
      <PathwayPager currentSlug={pathway.slug} />
      <main className={`e4s-dance-lovable e4s-pathway-lovable e4s-pathway-lovable--${pathway.id}`} id="site-content">
        <div className="e4s-dance-lovable-shell e4s-dance-lovable-breadcrumb">
          <nav aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/what-are-you-looking-for">What Are You Looking For</Link>
            <span>/</span>
            <strong>{pathway.title}</strong>
          </nav>
        </div>

        <section className="e4s-dance-lovable-shell e4s-dance-lovable-hero" aria-label={pathway.title}>
          <div className="e4s-dance-lovable-hero__copy">
            <span className="e4s-dance-lovable-chip">
              <HeroIcon aria-hidden="true" size={14} />
              {ui.chip}
            </span>
            <h1>
              {pathway.title} <span>{ui.heroLine}</span>
            </h1>
            <p>{pathway.heroLead}</p>

            <div className="e4s-dance-lovable-hero__actions">
              <Link className="e4s-dance-lovable-button e4s-dance-lovable-button--primary" href="#pathway-fit">
                {pathway.primaryCta}
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
              <Link className="e4s-dance-lovable-button e4s-dance-lovable-button--accent" href="#pathway-categories">
                {pathway.secondaryCta}
              </Link>
            </div>

            <dl className="e4s-dance-lovable-stats" aria-label={`${pathway.title} summary`}>
              {ui.stats.map(([value, label]) => (
                <div key={label}>
                  <dt>{value}</dt>
                  <dd>{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="e4s-dance-lovable-hero__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={ui.imageAlt} src={pathway.image} />
            <div>
              <BadgeCheck aria-hidden="true" size={16} />
              {pathway.number} / {pathway.eyebrow}
            </div>
          </div>
        </section>

        <section className="e4s-dance-styles-strip">
          <div className="e4s-dance-lovable-shell">
            <p>
              <Map aria-hidden="true" size={16} />
              {pathway.shortIntro}
            </p>
            <span>2 min read</span>
          </div>
        </section>

        <section className="e4s-dance-lovable-shell e4s-dance-lovable-guidance" id="pathway-fit">
          <SectionHeading
            eyebrow="Choose by feel"
            sub="Four useful starting points before you browse the full category set."
            title="Start from what you want out of it"
          />
          <div className="e4s-dance-lovable-guidance-grid">
            {branchCategories.map((category, index) => {
              const Icon = benefitIcons[index] ?? BadgeCheck;
              return (
                <article key={category.slug}>
                  <span>
                    <Icon aria-hidden="true" size={18} />
                  </span>
                  <h3>{category.label}</h3>
                  <p>{category.note}</p>
                  <div>
                    <Link href={`/${toUrlSlug(category.slug)}`}>
                      Browse {category.label}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="e4s-dance-lovable-band" id="pathway-categories">
          <div className="e4s-dance-lovable-shell">
            <SectionHeading
              eyebrow="Explore categories"
              sub="Services and experiences in this direction, using the same card shape as the newer dance hubs."
              title="Choose the room that fits this season"
            />
            <div className="e4s-dance-lovable-style-grid e4s-pathway-lovable-category-grid">
              {pathway.categories.map((category) => {
                const image = getCategoryCardImage(category.slug);
                return (
                  <Link key={category.slug} className="e4s-dance-lovable-style-card" href={`/${toUrlSlug(category.slug)}`}>
                    <span className="e4s-dance-lovable-style-card__image">
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img alt={category.label} loading="lazy" src={image} />
                      ) : (
                        <span className="e4s-pathway-lovable-fallback" aria-hidden="true" />
                      )}
                      <span>Explore</span>
                    </span>
                    <span className="e4s-dance-lovable-style-card__copy">
                      <strong>{category.label}</strong>
                      <em>{getCategoryCardSummary(category.slug, category.note)}</em>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="e4s-dance-lovable-shell e4s-dance-lovable-guidance e4s-pathway-lovable-story">
          <SectionHeading
            eyebrow="How to think about it"
            sub="The fuller context from the original pages is still here, but broken into easier-to-scan editorial blocks."
            title="A richer way into the decision"
          />
          <div className="e4s-dance-lovable-guidance-grid">
            {pathway.intro.map((paragraph, index) => (
              <article key={paragraph}>
                <span>{index + 1}</span>
                <p>{paragraph}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="e4s-dance-lovable-shell e4s-dance-lovable-guidance e4s-pathway-lovable-benefits" id="pathway-benefits">
          <SectionHeading
            eyebrow="Why it helps"
            sub="The original pathway benefits, shaped into the same guidance-card language as the dance pages."
            title="The beauty of this path"
          />
          <div className="e4s-dance-lovable-guidance-grid">
            {pathway.benefits.map((benefit, index) => {
              const Icon = benefitIcons[index] ?? BadgeCheck;
              return (
                <article key={benefit.title}>
                  <span>
                    <Icon aria-hidden="true" size={18} />
                  </span>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.copy}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="e4s-dance-lovable-shell e4s-dance-lovable-editorial">
          {pathway.sections.map((section) => (
            <article key={section.title}>
              <Compass aria-hidden="true" size={24} />
              <h2>{section.title}</h2>
              <p>{section.copy}</p>
            </article>
          ))}
        </section>

        <section className="e4s-dance-lovable-band e4s-pathway-lovable-faq">
          <div className="e4s-dance-lovable-shell">
            <SectionHeading
              eyebrow="Good to know"
              sub="Practical doubts answered before someone commits to the next click."
              title="Questions singles often ask"
            />
            <div className="e4s-dance-styles-faq-grid">
              {pathway.faqs.map((faq) => (
                <article key={faq.question}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="e4s-dance-lovable-shell e4s-dance-styles-final e4s-pathway-lovable-final">
          <div>
            <h2>Ready to choose your next step?</h2>
            <p>{pathway.description}</p>
          </div>
          <div>
            <Link className="e4s-dance-lovable-button e4s-dance-lovable-button--primary" href="#pathway-categories">
              {pathway.primaryCta}
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
            <Link className="e4s-dance-lovable-button e4s-dance-lovable-button--ghost" href="/">
              Back to Home
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
