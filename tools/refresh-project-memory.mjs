import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const websiteRoot = process.cwd();
const projectRoot = path.resolve(websiteRoot, "..");
const graphifyOut = path.join(projectRoot, "graphify-out");
const quietHook = process.argv.includes("--quiet-hook");
const requiredIgnoreRules = [
  "/.claude/",
  "/.codex/",
  "/.impeccable/",
  "/graphify-out/",
  "/website-hero-deploy/",
  "/website-hero-release/",
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
];

function log(message) {
  if (!quietHook) console.log(message);
}

function commandExists(command) {
  const probe = process.platform === "win32" ? "where.exe" : "command";
  const args = process.platform === "win32" ? [command] : ["-v", command];
  return spawnSync(probe, args, { stdio: "ignore", shell: process.platform !== "win32" }).status === 0;
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
  throw new Error("Graphify CLI not found. Install graphifyy before refreshing project memory.");
}

function runGraphifyUpdate() {
  const command = graphifyCommand();
  log(`Refreshing Graphify project memory from ${projectRoot}`);
  const result = spawnSync(command, ["update", "."], {
    cwd: projectRoot,
    stdio: quietHook ? "ignore" : "inherit",
    shell: false,
  });
  if (result.status !== 0) {
    throw new Error(`Graphify update failed with exit code ${result.status ?? "unknown"}`);
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

try {
  ensureGraphifyIgnore();
  runGraphifyUpdate();
  restoreRootMarker();
  log("Project memory refreshed.");
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  if (quietHook) {
    console.warn(`[project-memory] ${message}`);
    process.exit(0);
  }
  console.error(message);
  process.exit(1);
}
