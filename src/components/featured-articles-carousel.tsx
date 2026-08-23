"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export interface FeaturedArticleCard {
  slug: string;
  title: string;
  description: string;
  category: string;
}

interface Props {
  articles: FeaturedArticleCard[];
}

export default function FeaturedArticlesCarousel({ articles }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  function scroll(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".e4s-blog-feature-card");
    const distance = card ? card.offsetWidth + 14 : 320;
    track.scrollBy({ left: direction * distance, behavior: "smooth" });
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track || articles.length < 5) return;

    const timer = window.setInterval(() => {
      if (pausedRef.current) return;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      if (atEnd) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scroll(1);
      }
    }, 5500);

    return () => window.clearInterval(timer);
  }, [articles.length]);

  if (!articles.length) return null;

  return (
    <div
      className="e4s-blog-feature-carousel"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onFocus={() => {
        pausedRef.current = true;
      }}
      onBlur={() => {
        pausedRef.current = false;
      }}
    >
      <div className="e4s-blog-feature-controls" aria-label="Featured article carousel controls">
        <button className="e4s-blog-feature-control e4s-blog-feature-control--prev" type="button" onClick={() => scroll(-1)} aria-label="Previous featured articles">
          &lt;
        </button>
        <button className="e4s-blog-feature-control e4s-blog-feature-control--next" type="button" onClick={() => scroll(1)} aria-label="Next featured articles">
          &gt;
        </button>
      </div>
      <div className="e4s-blog-featured-track" ref={trackRef}>
        {articles.map((article) => (
          <Link key={article.slug} href={`/dating-resources/${article.slug}`} className="e4s-blog-feature-card">
            <span>{article.category}</span>
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <strong>Read article -&gt;</strong>
          </Link>
        ))}
      </div>
    </div>
  );
}
