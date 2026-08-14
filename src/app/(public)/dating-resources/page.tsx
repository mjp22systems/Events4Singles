import type { Metadata } from "next";
import DatingResourcesHub from "@/components/dating-resources-hub";

export const metadata: Metadata = {
  title: "Dating Resources",
  description:
    "Dating advice, singles guides and relationship resources for Australian singles.",
};

export default function DatingResourcesPage() {
  return <DatingResourcesHub />;
}
