import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

const projectRoot = process.cwd();

test("uses the Next proxy convention instead of deprecated middleware file", () => {
  const middlewarePath = path.join(projectRoot, "src", "middleware.ts");
  const proxyPath = path.join(projectRoot, "src", "proxy.ts");

  assert.equal(existsSync(middlewarePath), false, "src/middleware.ts triggers the deprecated Next convention warning");
  assert.equal(existsSync(proxyPath), true, "src/proxy.ts should contain the request proxy logic");

  const proxySource = readFileSync(proxyPath, "utf8");
  assert.match(proxySource, /export default function proxy\(/);
  assert.match(proxySource, /export const config\s*=/);
});
