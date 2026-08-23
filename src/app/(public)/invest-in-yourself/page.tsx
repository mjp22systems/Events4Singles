import type { Metadata } from "next";
import PathwayPage from "@/components/pathway-page";
import { getPathway } from "@/lib/pathways";
import { pageMetadata } from "@/lib/seo";

const pathway = getPathway("invest-in-yourself");

export const metadata: Metadata = pathway
  ? pageMetadata({
      title: pathway.seoTitle,
      description: pathway.seoDescription,
      path: `/${pathway.slug}`,
      keywords: ["personal growth for singles", "dating confidence", "wellbeing for singles", "life coaches for singles"],
    })
  : {};

export default function InvestInYourselfPage() {
  if (!pathway) return null;
  return <PathwayPage pathway={pathway} />;
}
