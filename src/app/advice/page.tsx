import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/content/articles";

export const metadata: Metadata = {
  title: "Dating Advice &amp; Tips",
  description: "Practical dating advice for Australian singles — tips for speed dating, singles dinners, social clubs and more.",
};

export default function AdvicePage() {
  return (
    <main className="e4s-info-page e4s-shell" id="site-content">
      <h1>Dating Advice &amp; Tips</h1>
      <p className="e4s-lead">
        Practical advice for Australian singles — making the most of speed dating, dinner parties,
        dance classes and the wider singles events scene.
      </p>

      <nav className="e4s-article-list" aria-label="Advice articles">
        {articles.map((article) => (
          <Link key={article.slug} href={`/advice/${article.slug}`} className="e4s-article-card">
            <h2 className="e4s-article-card__title">{article.title}</h2>
            <p className="e4s-article-card__desc">{article.description}</p>
            <span className="e4s-article-card__cta">Read article →</span>
          </Link>
        ))}
      </nav>
    </main>
  );
}
