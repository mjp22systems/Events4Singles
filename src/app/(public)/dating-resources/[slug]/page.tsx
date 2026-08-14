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
  return {
    title: article.title,
    description: article.description,
  };
}

export default async function DatingResourceArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <main className="e4s-info-page e4s-shell e4s-blog-article" id="site-content">
      <Link className="e4s-back-link" href="/dating-resources">&lt;- Dating Resources</Link>
      <p className="e4s-blog-eyebrow">{article.category || "Dating Resources"}</p>
      <h1>{article.title}</h1>
      <p className="e4s-lead">{article.description}</p>
      <div
        className="e4s-article-body"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </main>
  );
}
