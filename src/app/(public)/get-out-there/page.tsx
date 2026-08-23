import type { Metadata } from "next";
import PathwayPage from "@/components/pathway-page";
import { getPathway } from "@/lib/pathways";
import { pageMetadata } from "@/lib/seo";

const pathway = getPathway("get-out-there");

export const metadata: Metadata = pathway
  ? pageMetadata({
      title: pathway.seoTitle,
      description: pathway.seoDescription,
      path: `/${pathway.slug}`,
      keywords: ["social events for singles", "singles activities", "singles social clubs", "meet people naturally"],
    })
  : {};

export default function GetOutTherePage() {
  if (!pathway) return null;
  return <PathwayPage pathway={pathway} />;
}
