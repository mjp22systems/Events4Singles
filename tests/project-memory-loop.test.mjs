import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

const root = process.cwd();

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

test("package exposes project memory loop commands", () => {
  const pkg = JSON.parse(read("package.json"));

  assert.equal(pkg.scripts["memory:refresh"], "node tools/refresh-project-memory.mjs");
  assert.equal(pkg.scripts["memory:hook"], "node tools/install-project-memory-hook.mjs");
  assert.equal(pkg.scripts["memory:status"], "node tools/project-memory-status.mjs");
});

test("refresh command records auditable successes and non-blocking hook failures", () => {
  const source = read("tools/refresh-project-memory.mjs");

  assert.match(source, /refresh\.lock/);
  assert.match(source, /acquireRefreshLock/);
  assert.match(source, /refresh-log\.jsonl/);
  assert.match(source, /refresh-errors\.log/);
  assert.match(source, /appendRefreshLog/);
  assert.match(source, /appendFailureLog/);
  assert.match(source, /mode: refreshMode/);
  assert.match(source, /if \(quietHook\)/);
  assert.match(source, /process\.exitCode = 1/);
});

test("status command reports graph freshness and hook state from durable files", () => {
  const source = read("tools/project-memory-status.mjs");

  assert.match(source, /refresh-log\.jsonl/);
  assert.match(source, /refresh-errors\.log/);
  assert.match(source, /Freshness:/);
  assert.match(source, /Events4Singles project memory loop/);
});

test("hook installer keeps post-commit memory refresh non-blocking", () => {
  const source = read("tools/install-project-memory-hook.mjs");

  assert.match(source, /refresh-project-memory\.mjs --quiet-hook/);
  assert.match(source, /\|\| true/);
  assert.match(source, /refresh-log\.jsonl/);
  assert.match(source, /refresh-errors\.log/);
});
