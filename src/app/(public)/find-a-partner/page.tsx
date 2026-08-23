import type { Metadata } from "next";
import PathwayPage from "@/components/pathway-page";
import { getPathway } from "@/lib/pathways";
import { pageMetadata } from "@/lib/seo";

const pathway = getPathway("find-a-partner");

export const metadata: Metadata = pathway
  ? pageMetadata({
      title: pathway.seoTitle,
      description: pathway.seoDescription,
      path: `/${pathway.slug}`,
      keywords: ["find a partner", "singles dating events", "speed dating Australia", "introduction agencies"],
    })
  : {};

export default function FindAPartnerPage() {
  if (!pathway) return null;
  return <PathwayPage pathway={pathway} />;
}
