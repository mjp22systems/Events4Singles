import { appendFileSync, existsSync, mkdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const websiteRoot = process.cwd();
const projectRoot = path.resolve(websiteRoot, "..");
const graphifyOut = path.join(projectRoot, "graphify-out");
const graphPath = path.join(graphifyOut, "graph.json");
const lockPath = path.join(graphifyOut, "refresh.lock");
const semanticLogPath = path.join(graphifyOut, "semantic-refresh-log.jsonl");
const semanticErrorPath = path.join(graphifyOut, "semantic-refresh-errors.log");
const startedAt = new Date();
const staleLockMs = 30 * 60 * 1000;
const passThroughArgs = process.argv.slice(2);

const requiredIgnoreRules = [
  "/.claude/",
  "/.codex/",
  "/.codex-backups/",
  "/.impeccable/",
  "/graphify-out/",
  "/repo-state-backups/",
  "/website-hero-deploy/",
  "/website-hero-release/",
  "/website-image-classify/",
  "/website-image-clean-deploy/",
  "/website-image-source-clean-deploy/",
  "/website-push-audit-sweep3/",
  "**/node_modules/",
  "**/.next/",
  "**/.wrangler/",
  "**/.open-next/",
  "**/out/",
  "**/build/",
  "**/coverage/",
  "**/playwright-report/",
  "**/test-results/",
  "**/package-lock.json",
  "**/worker-configuration.d.ts",
  "**/next-env.d.ts",
  "**/*.tsbuildinfo",
  "**/*.png",
  "**/*.PNG",
  "**/*.jpg",
  "**/*.JPG",
  "**/*.jpeg",
  "**/*.JPEG",
  "**/*.gif",
  "**/*.GIF",
  "**/*.webp",
  "**/*.WEBP",
  "**/*.svg",
  "**/*.SVG",
  "**/*.ico",
  "**/*.ICO",
  "**/*.avif",
  "**/*.AVIF",
  "/website/public/images/",
  "/website/tmp/",
];

function commandExists(command) {
  const probe = process.platform === "win32" ? "where.exe" : "command";
  const args = process.platform === "win32" ? [command] : ["-v", command];
  return spawnSync(probe, args, { stdio: "ignore", shell: process.platform !== "win32" }).status === 0;
}

function runGit(args) {
  const result = spawnSync("git", args, {
    cwd: websiteRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) return "";
  return result.stdout.trim();
}

function currentGitState() {
  const status = runGit(["status", "--short"]);
  return {
    commit: runGit(["rev-parse", "--short", "HEAD"]) || null,
    dirty_entries: status ? status.split(/\r?\n/).filter(Boolean).length : 0,
  };
}

function fileMtimeIso(filePath) {
  if (!existsSync(filePath)) return null;
  return statSync(filePath).mtime.toISOString();
}

function tail(text, limit = 1800) {
  if (!text) return "";
  return text.length <= limit ? text : text.slice(-limit);
}

function graphStats() {
  if (!existsSync(graphPath)) {
    return { nodes: null, edges: null, communities: null, updated_at: null };
  }

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

function appendSemanticLog(entry) {
  mkdirSync(graphifyOut, { recursive: true });
  appendFileSync(semanticLogPath, `${JSON.stringify(entry)}\n`, "utf8");
}

function appendFailureLog(entry) {
  mkdirSync(graphifyOut, { recursive: true });
  appendFileSync(
    semanticErrorPath,
    `[${entry.finished_at}] semantic refresh failed: ${entry.error}${entry.stderr ? `\n${entry.stderr}` : ""}\n\n`,
    "utf8",
  );
}

function acquireRefreshLock() {
  mkdirSync(graphifyOut, { recursive: true });
  const payload = JSON.stringify({
    pid: process.pid,
    mode: "semantic",
    started_at: startedAt.toISOString(),
  });

  try {
    writeFileSync(lockPath, payload, { encoding: "utf8", flag: "wx" });
    return true;
  } catch (error) {
    if (error?.code !== "EEXIST") throw error;

    const lockAgeMs = Date.now() - statSync(lockPath).mtime.getTime();
    if (lockAgeMs > staleLockMs) {
      unlinkSync(lockPath);
      writeFileSync(lockPath, payload, { encoding: "utf8", flag: "wx" });
      return true;
    }

    return false;
  }
}

function releaseRefreshLock() {
  if (existsSync(lockPath)) unlinkSync(lockPath);
}

function graphifyCommand() {
  const userPythonLauncher = path.join(
    process.env.APPDATA ?? "",
    "Python",
    "Python314",
    "Scripts",
    process.platform === "win32" ? "graphify.exe" : "graphify",
  );
  if (userPythonLauncher && existsSync(userPythonLauncher)) return userPythonLauncher;
  if (commandExists("graphify")) return "graphify";
  throw new Error("Graphify CLI not found. Install graphifyy before refreshing semantic project memory.");
}

function hasHeadlessSemanticBackend() {
  const envKeys = [
    "GEMINI_API_KEY",
    "GOOGLE_API_KEY",
    "KIMI_API_KEY",
    "ANTHROPIC_API_KEY",
    "ANTHROPIC_BASE_URL",
    "OPENAI_API_KEY",
    "OPENAI_BASE_URL",
    "DEEPSEEK_API_KEY",
  ];
  return envKeys.some((key) => Boolean(process.env[key]));
}

function runProjectConfigAudit() {
  const auditPath = path.join(websiteRoot, "tools", "audit-project-config.mjs");
  if (!existsSync(auditPath)) {
    throw new Error("Project config audit script is missing.");
  }

  const result = spawnSync(process.execPath, [auditPath, "--quiet"], {
    cwd: websiteRoot,
    encoding: "utf8",
    stdio: "inherit",
    shell: false,
  });
  if (result.status !== 0) {
    throw new Error(`Project config audit failed with exit code ${result.status ?? "unknown"}`);
  }
}

function ensureGraphifyIgnore() {
  const ignorePath = path.join(projectRoot, ".graphifyignore");
  const existing = existsSync(ignorePath) ? readFileSync(ignorePath, "utf8") : "";
  const lines = new Set(existing.split(/\r?\n/).map((line) => line.trim()).filter(Boolean));
  let changed = false;
  for (const rule of requiredIgnoreRules) {
    if (!lines.has(rule)) {
      lines.add(rule);
      changed = true;
    }
  }
  if (changed || !existsSync(ignorePath)) {
    writeFileSync(ignorePath, `${Array.from(lines).join("\n")}\n`, "utf8");
  }
}

function restoreRootMarker() {
  mkdirSync(graphifyOut, { recursive: true });
  writeFileSync(path.join(graphifyOut, ".graphify_root"), projectRoot, "utf8");
}

function runGraphifyExtract() {
  if (!hasHeadlessSemanticBackend()) {
    throw new Error(
      "No headless Graphify semantic backend is configured. Set GEMINI_API_KEY, GOOGLE_API_KEY, or another Graphify extract backend env var before running npm run memory:refresh:semantic. In an interactive agent session, use /graphify . --update from the project root for assistant-backed semantic extraction.",
    );
  }

  const command = graphifyCommand();
  const args = ["extract", ".", "--out", ".", ...passThroughArgs];
  console.log(`Refreshing semantic Graphify project memory from ${projectRoot}`);
  console.log(`Running: graphify ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    encoding: "utf8",
    stdio: "inherit",
    shell: false,
  });
  if (result.status !== 0) {
    throw new Error(`Graphify semantic extract failed with exit code ${result.status ?? "unknown"}`);
  }
  return { command, status: result.status };
}

let lockAcquired = false;

try {
  lockAcquired = acquireRefreshLock();
  if (!lockAcquired) {
    throw new Error("Another project memory refresh is already running.");
  }

  runProjectConfigAudit();
  ensureGraphifyIgnore();
  const result = runGraphifyExtract();
  restoreRootMarker();

  const finishedAt = new Date();
  appendSemanticLog({
    ok: true,
    mode: "semantic",
    started_at: startedAt.toISOString(),
    finished_at: finishedAt.toISOString(),
    duration_ms: finishedAt.getTime() - startedAt.getTime(),
    git: currentGitState(),
    graph: graphStats(),
    command: path.basename(result.command),
    args: passThroughArgs,
  });
  console.log("Semantic project memory refreshed.");
} catch (error) {
  const finishedAt = new Date();
  const message = error instanceof Error ? error.message : String(error);
  const entry = {
    ok: false,
    mode: "semantic",
    started_at: startedAt.toISOString(),
    finished_at: finishedAt.toISOString(),
    duration_ms: finishedAt.getTime() - startedAt.getTime(),
    git: currentGitState(),
    graph: graphStats(),
    error: message,
    stdout: tail(error?.stdout ?? ""),
    stderr: tail(error?.stderr ?? ""),
  };
  appendSemanticLog(entry);
  appendFailureLog(entry);
  console.error(message);
  process.exitCode = 1;
} finally {
  if (lockAcquired) releaseRefreshLock();
}
