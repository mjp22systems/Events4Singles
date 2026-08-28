import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import sharp from "sharp";

const projectRoot = process.cwd();

const ACTIVE_CITY_SLUGS = [
  "adelaide",
  "brisbane",
  "byron-bay",
  "cairns",
  "canberra",
  "central-coast",
  "darwin",
  "geelong",
  "gold-coast",
  "hobart",
  "melbourne",
  "newcastle",
  "perth",
  "sunshine-coast",
  "sydney",
  "toowoomba",
  "townsville",
  "wollongong",
];

test("every active city has an optimized wide hero image", async () => {
  for (const slug of ACTIVE_CITY_SLUGS) {
    const imagePath = path.join(
      projectRoot,
      "public",
      "images",
      "cities",
      "heroes",
      `location-photo-${slug}-photo.webp`,
    );

    assert.ok(existsSync(imagePath), `${slug} city hero image file does not exist`);
    const metadata = await sharp(imagePath).metadata();
    assert.equal(metadata.width, 1920, `${slug} city hero image should be 1920px wide`);
    assert.equal(metadata.height, 320, `${slug} city hero image should be 320px high`);
  }
});
