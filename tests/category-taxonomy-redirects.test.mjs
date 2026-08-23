import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

const projectRoot = process.cwd();
const nextConfig = readFileSync(path.join(projectRoot, "next.config.ts"), "utf8");

const EXPECTED_REDIRECTS = new Map([
  ["/travel-for-singles", "/solo-travel"],
  ["/travel_for_singles.htm", "/solo-travel"],
  ["/walks4singles", "/social-walks"],
  ["/walks4singles.htm", "/social-walks"],
  ["/lotto4singles", "/dating-resources"],
  ["/lotto4singles.htm", "/dating-resources"],
  ["/singles-products", "/dating-resources"],
  ["/singles_products.htm", "/dating-resources"],
  ["/special-offers", "/advertise"],
  ["/special_offers.htm", "/advertise"],
  ["/singles-news", "/dating-resources"],
  ["/singles_news.htm", "/dating-resources"],
  ["/finance-mortgage", "/life-coaches"],
  ["/finance_mortgage.htm", "/life-coaches"],
  ["/golf", "/sport-adventure"],
  ["/golf.htm", "/sport-adventure"],
  ["/toastmasters", "/seminars"],
  ["/toastmasters.htm", "/seminars"],
  ["/art-galleries", "/social-clubs"],
  ["/art_galleries.htm", "/social-clubs"],
  ["/spiritual-path", "/retreats-for-singles"],
  ["/spiritual_path.htm", "/retreats-for-singles"],
  ["/sms-phone-dating", "/online-dating"],
  ["/sms-phone-dating.htm", "/online-dating"],
]);

test("retired and renamed category routes redirect to active destinations", () => {
  for (const [source, destination] of EXPECTED_REDIRECTS) {
    const sourcePattern = new RegExp(`source:\\s*"${source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`);
    const destinationPattern = new RegExp(`destination:\\s*"${destination.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`);
    assert.match(nextConfig, sourcePattern, `Missing redirect source ${source}`);
    const sourceIndex = nextConfig.search(sourcePattern);
    const destinationIndex = nextConfig.slice(sourceIndex, sourceIndex + 160).search(destinationPattern);
    assert.notEqual(destinationIndex, -1, `${source} should redirect to ${destination}`);
  }
});
