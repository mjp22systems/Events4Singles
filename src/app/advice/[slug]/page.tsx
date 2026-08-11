import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { articles, getArticle } from "@/content/articles";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return { title: article.title, description: article.description };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <main className="e4s-info-page e4s-shell" id="site-content">
      <Link className="e4s-back-link" href="/advice">← Advice &amp; Tips</Link>
      <h1>{article.title}</h1>
      <p className="e4s-lead">{article.description}</p>
      <div
        className="e4s-article-body"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </main>
  );
}
