import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

const projectRoot = process.cwd();
const taxonomySource = readFileSync(path.join(projectRoot, "src/lib/category-taxonomy.ts"), "utf8");
const dataSource = readFileSync(path.join(projectRoot, "src/lib/data.ts"), "utf8");
const newEventForm = readFileSync(path.join(projectRoot, "src/app/admin/(shell)/events/new/new-event-form.tsx"), "utf8");
const editEventForm = readFileSync(path.join(projectRoot, "src/app/admin/(shell)/events/[id]/event-edit-form.tsx"), "utf8");

const REQUIRED_REPAIR_SLUGS = [
  "singles_mixers",
  "christian_singles",
  "lgbtqia_singles_events",
  "solo_travel",
  "social_walks",
  "dating_coaches",
  "dating_profile_photography",
];

test("canonical category repair list covers pathway-linked fallback categories", () => {
  for (const slug of REQUIRED_REPAIR_SLUGS) {
    assert.match(taxonomySource, new RegExp(`slug:\\s*"${slug}"`), `Missing canonical repair slug ${slug}`);
  }
});

test("category metadata falls back to canonical repairs before returning 404", () => {
  assert.match(dataSource, /CANONICAL_CATEGORY_BY_SLUG\.get\(dbSlug\)/);
  assert.match(dataSource, /canonicalCategoryToCategory\(canonicalCategory/);
});

test("legacy travel and walk placements feed their canonical category pages", () => {
  assert.match(taxonomySource, /slug:\s*"solo_travel"[\s\S]*aliases:\s*\["travel_for_singles", "tours4singles"\]/);
  assert.match(taxonomySource, /slug:\s*"social_walks"[\s\S]*aliases:\s*\["walks4singles"\]/);
});

test("merged category buckets feed their canonical category pages", () => {
  assert.match(taxonomySource, /slug:\s*"dinner_parties"[\s\S]*aliases:\s*\["dinner_for_six"\]/);
  assert.match(taxonomySource, /slug:\s*"adventure_for_singles"[\s\S]*aliases:\s*\["sport_adventure"\]/);
  assert.match(dataSource, /"dinner_for_six"/);
  assert.match(dataSource, /"sport_adventure"/);
  assert.match(dataSource, /"tours4singles"/);
});

test("admin event forms use the shared category list", () => {
  assert.match(newEventForm, /EVENT_CATEGORY_OPTIONS/);
  assert.match(editEventForm, /EVENT_CATEGORY_OPTIONS/);
  assert.doesNotMatch(newEventForm, /const CATEGORIES =/);
  assert.doesNotMatch(editEventForm, /const CATEGORIES =/);
});
