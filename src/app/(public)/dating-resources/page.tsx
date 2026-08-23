import type { Metadata } from "next";
import DatingResourcesHub from "@/components/dating-resources-hub";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Dating Resources for Australian Singles",
  description:
    "Modern dating advice, safety checklists, singles event guides and relationship resources for Australian singles.",
  path: "/dating-resources",
  keywords: ["dating resources", "dating advice Australia", "singles advice", "relationship resources"],
});

export default function DatingResourcesPage() {
  return <DatingResourcesHub />;
}
