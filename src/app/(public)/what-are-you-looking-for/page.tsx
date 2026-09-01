import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Compass, Map, Sparkles } from "lucide-react";
import BodyClass from "@/components/body-class";
import { PATHWAYS } from "@/lib/pathways";
import { breadcrumbJsonLd, collectionPageJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "What Are You Looking For? Singles Events and Services by Intent",
  description:
    "Choose the Events4Singles pathway that fits where you are now: find a partner, get out there socially, or invest in yourself.",
  path: "/what-are-you-looking-for",
  keywords: [
    "singles events by intent",
    "find singles events Australia",
    "dating and social pathways for singles",
  ],
});

export default function WhatAreYouLookingForPage() {
  const jsonLd = [
    collectionPageJsonLd({
      name: "What Are You Looking For?",
      description:
        "A pathway hub for singles choosing between dating intention, social momentum and personal growth.",
      path: "/what-are-you-looking-for",
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "What Are You Looking For?", path: "/what-are-you-looking-for" },
    ]),
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
      <main className="e4s-dance-lovable e4s-looking-hub" id="site-content">
        <div className="e4s-dance-lovable-shell e4s-dance-lovable-breadcrumb">
          <nav aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <strong>What Are You Looking For?</strong>
          </nav>
        </div>

        <section className="e4s-dance-lovable-shell e4s-dance-lovable-hero" aria-label="What are you looking for?">
          <div className="e4s-dance-lovable-hero__copy">
            <span className="e4s-dance-lovable-chip">
              <Compass aria-hidden="true" size={14} />
              Singles Pathway Guide
            </span>
            <h1>
              What are you looking for? <span>Start with the reason</span>
            </h1>
            <p>
              Some singles are ready to meet someone directly. Some want to get out more
              and let connection happen naturally. Some are rebuilding confidence, wellbeing
              and a fuller life first. Choose the doorway that feels most true right now.
            </p>

            <div className="e4s-dance-lovable-hero__actions">
              <Link className="e4s-dance-lovable-button e4s-dance-lovable-button--primary" href="#pathways">
                Compare the three paths
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
              <Link className="e4s-dance-lovable-button e4s-dance-lovable-button--accent" href="/categories">
                Browse all categories
              </Link>
            </div>

            <dl className="e4s-dance-lovable-stats" aria-label="Pathway summary">
              <div>
                <dt>3</dt>
                <dd>Ways in</dd>
              </div>
              <div>
                <dt>{PATHWAYS.reduce((total, pathway) => total + pathway.categories.length, 0)}</dt>
                <dd>Category routes</dd>
              </div>
              <div>
                <dt>100%</dt>
                <dd>Solo-arrival friendly</dd>
              </div>
            </dl>
          </div>

          <div className="e4s-dance-lovable-hero__media">
            {PATHWAYS.map((pathway) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={pathway.slug} alt={pathway.title} src={pathway.image} />
            ))}
            <div>
              <Sparkles aria-hidden="true" size={16} />
              Find the branch that fits this season
            </div>
          </div>
        </section>

        <section className="e4s-dance-styles-strip">
          <div className="e4s-dance-lovable-shell">
            <p>
              <Map aria-hidden="true" size={16} />
              This page is the branch point before categories: dating intention, social momentum,
              or personal growth.
            </p>
            <span>3 paths</span>
          </div>
        </section>

        <section className="e4s-dance-lovable-band" id="pathways">
          <div className="e4s-dance-lovable-shell">
            <div className="e4s-dance-lovable-heading">
              <div>
                <p>Choose by intent</p>
                <h2>Three useful ways to begin</h2>
                <span>Each pathway gathers related categories, examples and next steps.</span>
              </div>
            </div>
            <div className="e4s-dance-lovable-style-grid e4s-looking-hub-paths">
              {PATHWAYS.map((pathway) => (
                <Link key={pathway.slug} className="e4s-dance-lovable-style-card" href={`/${pathway.slug}`}>
                  <span className="e4s-dance-lovable-style-card__image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt={pathway.title} loading="lazy" src={pathway.image} />
                    <span>{pathway.number}</span>
                  </span>
                  <span className="e4s-dance-lovable-style-card__copy">
                    <strong>{pathway.title}</strong>
                    <em>{pathway.description}</em>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="e4s-dance-lovable-shell e4s-dance-styles-final">
          <div>
            <h2>Prefer to browse the full directory?</h2>
            <p>Jump straight into categories if you already know the type of event or service you want.</p>
          </div>
          <div>
            <Link className="e4s-dance-lovable-button e4s-dance-lovable-button--primary" href="/categories">
              Browse Categories
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
