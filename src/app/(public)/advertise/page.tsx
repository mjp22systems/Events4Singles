import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import AdvertiseExperience from "./advertise-experience";

export const metadata: Metadata = pageMetadata({
  title: "Advertise with Events4Singles",
  description:
    "Advertise singles events, services and venues on Events4Singles. Start with a free listing during launch, then add featured placements, banners and event promotion.",
  path: "/advertise",
  keywords: [
    "advertise singles events",
    "list singles event",
    "promote dating services Australia",
    "singles event advertising",
  ],
});

export default function AdvertisePage() {
  return <AdvertiseExperience />;
}
