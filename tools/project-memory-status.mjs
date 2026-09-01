import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const websiteRoot = process.cwd();
const projectRoot = path.resolve(websiteRoot, "..");
const graphifyOut = path.join(projectRoot, "graphify-out");
const graphPath = path.join(graphifyOut, "graph.json");
const refreshLogPath = path.join(graphifyOut, "refresh-log.jsonl");
const refreshErrorPath = path.join(graphifyOut, "refresh-errors.log");
const semanticLogPath = path.join(graphifyOut, "semantic-refresh-log.jsonl");
const semanticErrorPath = path.join(graphifyOut, "semantic-refresh-errors.log");

function runGit(args) {
  const result = spawnSync("git", args, {
    cwd: websiteRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) return "";
  return result.stdout.trim();
}

function gitDir() {
  const value = runGit(["rev-parse", "--git-dir"]);
  return value ? path.resolve(websiteRoot, value) : null;
}

function fileMtimeIso(filePath) {
  if (!existsSync(filePath)) return null;
  return statSync(filePath).mtime.toISOString();
}

function formatDate(value) {
  if (!value) return "unknown";
  return new Date(value).toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "medium",
  });
}

function readGraphStats() {
  if (!existsSync(graphPath)) return null;
  const graph = JSON.parse(readFileSync(graphPath, "utf8"));
  const nodes = Array.isArray(graph.nodes) ? graph.nodes.length : null;
  const edgeList = Array.isArray(graph.links) ? graph.links : graph.edges;
  const edges = Array.isArray(edgeList) ? edgeList.length : null;
  const communityIds = new Set(
    Array.isArray(graph.nodes)
      ? graph.nodes.map((node) => node.community).filter((community) => community !== undefined && community !== null)
      : [],
  );
  return {
    nodes,
    edges,
    communities: communityIds.size || null,
    updated_at: fileMtimeIso(graphPath),
  };
}

function readRefreshLog() {
  return readJsonlLog(refreshLogPath);
}

function readSemanticLog() {
  return readJsonlLog(semanticLogPath);
}

function readJsonlLog(filePath) {
  if (!existsSync(filePath)) return [];
  return readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return { ok: false, finished_at: null, error: `Unreadable log line: ${line.slice(0, 120)}` };
      }
    });
}

function hookStatus() {
  const dir = gitDir();
  if (!dir) return "unknown";
  const hookPath = path.join(dir, "hooks", "post-commit");
  if (!existsSync(hookPath)) return "missing";
  const hook = readFileSync(hookPath, "utf8");
  return hook.includes("Events4Singles project memory loop") && hook.includes("refresh-project-memory.mjs")
    ? "installed"
    : "present but unmanaged";
}

function statusCount() {
  const status = runGit(["status", "--short"]);
  return status ? status.split(/\r?\n/).filter(Boolean).length : 0;
}

function lastSuccessfulRefresh(entries) {
  return entries.findLast((entry) => entry.ok);
}

function freshness(lastSuccess, headIso) {
  if (!lastSuccess?.finished_at) return "unknown - no successful refresh log entry yet";
  if (!headIso) return "unknown - git commit date unavailable";
  return new Date(lastSuccess.finished_at) >= new Date(headIso)
    ? "current relative to HEAD"
    : "stale relative to HEAD";
}

const graph = readGraphStats();
const entries = readRefreshLog();
const semanticEntries = readSemanticLog();
const lastEntry = entries.at(-1);
const lastSuccess = lastSuccessfulRefresh(entries);
const lastSemanticEntry = semanticEntries.at(-1);
const lastSemanticSuccess = lastSuccessfulRefresh(semanticEntries);
const head = runGit(["rev-parse", "--short", "HEAD"]) || "unknown";
const headIso = runGit(["log", "-1", "--format=%cI"]) || null;
const dirtyEntries = statusCount();
const recentFailures = entries.filter((entry) => !entry.ok).slice(-3);

console.log("Project memory status");
console.log(`Hook: ${hookStatus()}`);
console.log(`HEAD: ${head} (${formatDate(headIso)})`);
console.log(`Working tree: ${dirtyEntries ? `dirty (${dirtyEntries} entries)` : "clean"}`);

if (graph) {
  console.log(
    `Graph: ${graph.nodes ?? "?"} nodes, ${graph.edges ?? "?"} edges, ${graph.communities ?? "?"} communities`,
  );
  console.log(`Graph updated: ${formatDate(graph.updated_at)}`);
} else {
  console.log("Graph: missing graphify-out/graph.json");
}

if (lastEntry) {
  const outcome = lastEntry.ok ? "ok" : "failed";
  console.log(`Last refresh: ${outcome} ${lastEntry.mode ?? "unknown"} at ${formatDate(lastEntry.finished_at)}`);
} else {
  console.log("Last refresh: no refresh-log.jsonl entries yet");
}

if (lastSuccess) {
  console.log(`Last successful refresh: ${lastSuccess.mode ?? "unknown"} at ${formatDate(lastSuccess.finished_at)}`);
}

if (lastSemanticEntry) {
  const outcome = lastSemanticEntry.ok ? "ok" : "failed";
  console.log(`Last semantic refresh: ${outcome} at ${formatDate(lastSemanticEntry.finished_at)}`);
} else {
  console.log("Last semantic refresh: no semantic-refresh-log.jsonl entries yet");
}

if (lastSemanticSuccess) {
  console.log(`Last successful semantic refresh: ${formatDate(lastSemanticSuccess.finished_at)}`);
}

console.log(`Freshness: ${freshness(lastSuccess, headIso)}`);

if (existsSync(refreshErrorPath)) {
  console.log(`Failure log: ${refreshErrorPath}`);
}

if (existsSync(semanticErrorPath)) {
  console.log(`Semantic failure log: ${semanticErrorPath}`);
}

if (recentFailures.length) {
  console.log("Recent failures:");
  for (const failure of recentFailures) {
    console.log(`- ${formatDate(failure.finished_at)}: ${failure.error ?? "unknown error"}`);
  }
}
