import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

const projectRoot = process.cwd();

const removedPublicDirs = [
  ["public", "images", "optimized"],
  ["public", "images", "categories", "optimized"],
  ["public", "images", "categories", "hero"],
  ["public", "images", "cities", "optimized"],
  ["public", "images", "cities", "hero"],
  ["public", "images", "cities", "source"],
];

const forbiddenRuntimeSnippets = [
  "/images/optimized/",
  "/images/categories/optimized/",
  "/images/categories/hero/",
  "/images/cities/optimized/",
  "/images/cities/hero/",
  "/images/cities/source/",
];

function walk(dir) {
  const entries = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      entries.push(...walk(fullPath));
    } else {
      entries.push(fullPath);
    }
  }
  return entries;
}

test("deprecated public image compatibility folders are not deployed", () => {
  for (const segments of removedPublicDirs) {
    const dir = path.join(projectRoot, ...segments);
    assert.equal(existsSync(dir), false, `${segments.join("/")} should not be in public assets`);
  }
});

test("runtime code only references canonical image folders", () => {
  const files = [
    ...walk(path.join(projectRoot, "src")),
    path.join(projectRoot, "public", "_headers"),
    path.join(projectRoot, "docs", "image-storage.md"),
    path.join(projectRoot, "tools", "generate-hero-frame-assets.mjs"),
  ];

  for (const file of files) {
    const source = readFileSync(file, "utf8");
    for (const snippet of forbiddenRuntimeSnippets) {
      assert.equal(source.includes(snippet), false, `${path.relative(projectRoot, file)} references ${snippet}`);
    }
  }
});

test("city hero source photos are non-public generator inputs", () => {
  const sourceDir = path.join(projectRoot, "assets", "images", "cities", "source");
  assert.equal(existsSync(sourceDir), true, "city hero source folder should live outside public");
});
