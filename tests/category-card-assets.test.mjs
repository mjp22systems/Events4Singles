import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

const projectRoot = process.cwd();
const mappingFile = path.join(projectRoot, "src", "lib", "category-card-assets.ts");

const ACTIVE_CATEGORY_SLUGS = [
  "adventure-for-singles",
  "beauty-for-singles",
  "comedians",
  "cruises4singles",
  "dance-ceroc",
  "dance-classes",
  "dance-party-clubs",
  "dance-salsa",
  "dance-tango",
  "dance-teachers",
  "dinner-for-six",
  "dinner-parties",
  "dating-coaches",
  "dating-profile-photography",
  "fitness4singles",
  "function-centres",
  "healing-and-happiness",
  "houseparties",
  "image-and-photography",
  "intro-agencies",
  "jazz",
  "lgbtqia-singles-events",
  "life-coaches",
  "mature-dating-events",
  "nightclubs",
  "online-dating",
  "psychics4singles",
  "psychology",
  "restaurants-cafes",
  "retreats-for-singles",
  "seminars",
  "singles-health",
  "singles-mixers",
  "christian-singles",
  "social-clubs",
  "social-walks",
  "solo-travel",
  "speed-dating",
  "sport-adventure",
  "tours4singles",
  "wineries4singles",
  "yoga-classes",
];

function parseRecord(source, constantName) {
  const match = source.match(new RegExp(`const ${constantName}: Record<string, string> = \\{([\\s\\S]*?)\\};`));
  assert.ok(match, `Could not find ${constantName}`);
  return Object.fromEntries(
    [...match[1].matchAll(/"([^"]+)":\s*"([^"]+)"/g)].map((entry) => [entry[1], entry[2]]),
  );
}

test("every active category has a unique project-owned card image", () => {
  const source = readFileSync(mappingFile, "utf8");
  const images = parseRecord(source, "CATEGORY_CARD_IMAGES");
  const categories = ACTIVE_CATEGORY_SLUGS;

  const missing = categories.filter((slug) => !images[slug]);
  assert.deepEqual(missing, [], `Missing image mappings for: ${missing.join(", ")}`);

  const duplicateUrls = Object.entries(
    Object.values(images).reduce((acc, imageUrl) => {
      acc[imageUrl] = (acc[imageUrl] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .filter(([, count]) => count > 1)
    .map(([imageUrl]) => imageUrl);
  assert.deepEqual(duplicateUrls, [], `Duplicate category images: ${duplicateUrls.join(", ")}`);

  for (const [slug, imageUrl] of Object.entries(images)) {
    assert.ok(
      imageUrl.startsWith("/images/categories/optimized/"),
      `${slug} should use the website-owned category image directory`,
    );
    assert.ok(
      existsSync(path.join(projectRoot, "public", imageUrl)),
      `${slug} image file does not exist: ${imageUrl}`,
    );
  }
});

test("every active category has a card summary", () => {
  const source = readFileSync(mappingFile, "utf8");
  const summaries = parseRecord(source, "CATEGORY_CARD_SUMMARIES");
  const categories = ACTIVE_CATEGORY_SLUGS;
  const missing = categories.filter((slug) => !summaries[slug]);

  assert.deepEqual(missing, [], `Missing summaries for: ${missing.join(", ")}`);
});
