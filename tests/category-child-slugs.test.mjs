import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

const projectRoot = process.cwd();
const constantsSource = readFileSync(path.join(projectRoot, "src", "lib", "constants.ts"), "utf8");

test("dance child route helpers keep nested style URLs clean", () => {
  assert.match(
    constantsSource,
    /parentDbSlug === "dance_classes" && childDbSlug\.startsWith\("dance_"\)/
  );
  assert.match(
    constantsSource,
    /candidates\.push\(`dance_\$\{childDbSlug\}`\)/
  );
});
