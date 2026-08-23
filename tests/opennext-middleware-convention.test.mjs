import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

const projectRoot = process.cwd();

test("keeps middleware convention while OpenNext Cloudflare lacks proxy support", () => {
  const middlewarePath = path.join(projectRoot, "src", "middleware.ts");
  const proxyPath = path.join(projectRoot, "src", "proxy.ts");

  assert.equal(existsSync(middlewarePath), true, "src/middleware.ts should contain deployable request middleware");
  assert.equal(existsSync(proxyPath), false, "src/proxy.ts currently fails OpenNext Cloudflare deployment");

  const middlewareSource = readFileSync(middlewarePath, "utf8");
  assert.match(middlewareSource, /export default function middleware\(/);
  assert.match(middlewareSource, /export const config\s*=/);
  assert.match(middlewareSource, /@opennextjs\/cloudflare/);
});
