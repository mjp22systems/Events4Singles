import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const websiteRoot = process.cwd();
const configPath = path.join(websiteRoot, "project.config.json");
const quiet = process.argv.includes("--quiet");

const critical = [];
const warnings = [];

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function normalize(value) {
  return String(value ?? "").replace(/\\/g, "/").replace(/\/+$/g, "");
}

function joinProject(relativePath) {
  return path.resolve(websiteRoot, relativePath);
}

function requireFile(relativePath, label = relativePath) {
  if (!existsSync(joinProject(relativePath))) {
    critical.push(`${label} is missing: ${relativePath}`);
  }
}

function requireDir(relativePath, label = relativePath) {
  if (!existsSync(joinProject(relativePath))) {
    critical.push(`${label} is missing: ${relativePath}`);
  }
}

function warnIfMissingText(filePath, needles, label) {
  if (!existsSync(filePath)) {
    warnings.push(`${label} is missing, so doc drift could not be checked.`);
    return;
  }
  const text = readFileSync(filePath, "utf8");
  for (const needle of needles) {
    if (!text.includes(needle)) {
      warnings.push(`${label} does not mention '${needle}'.`);
    }
  }
}

if (!existsSync(configPath)) {
  console.error("Missing project.config.json. This file is the Events4Singles project registry.");
  process.exit(1);
}

const config = readJson(configPath);
const packageJson = readJson(path.join(websiteRoot, "package.json"));
const packageScripts = packageJson.scripts ?? {};

if (normalize(websiteRoot) !== normalize(config.project?.canonicalRepo)) {
  warnings.push(`Current folder is ${websiteRoot}, but config canonicalRepo is ${config.project?.canonicalRepo}.`);
}

for (const [label, relativePath] of Object.entries(config.paths?.source ?? {})) {
  requireDir(relativePath, `source path '${label}'`);
}

for (const [label, relativePath] of Object.entries(config.paths?.assets ?? {})) {
  requireDir(relativePath, `asset path '${label}'`);
}

const expectedScripts = {
  dev: config.commands?.dev,
  "deploy:dad": config.commands?.deploy,
  "cache:purge": config.commands?.cachePurge,
  "memory:refresh": config.commands?.memoryRefresh,
  "memory:hook": config.commands?.memoryHook,
  "memory:status": config.commands?.memoryStatus,
  "config:audit": config.commands?.configAudit,
};

for (const [script, expected] of Object.entries(expectedScripts)) {
  if (!expected) continue;
  if (packageScripts[script] !== expected) {
    critical.push(`package.json script '${script}' is '${packageScripts[script] ?? "<missing>"}', expected '${expected}'.`);
  }
}

requireFile(config.governance?.sourceOfTruthDoc ?? "docs/events4singles-source-of-truth.md", "source-of-truth doc");
requireFile(config.governance?.deploymentRunbook ?? "docs/deployment-runbook.md", "deployment runbook");
requireFile(config.governance?.agentLocalInstructions ?? "CLAUDE.md", "local agent instructions");
requireFile(config.governance?.configDoc ?? "docs/project-config-registry.md", "project config registry doc");

const wranglerPath = path.join(websiteRoot, "wrangler.toml");
if (!existsSync(wranglerPath)) {
  critical.push("wrangler.toml is missing.");
} else {
  const wrangler = readFileSync(wranglerPath, "utf8");
  const checks = [
    [`name = "${config.cloudflare?.workerName}"`, "Cloudflare Worker name"],
    [`account_id = "${config.cloudflare?.accountId}"`, "Cloudflare account ID"],
    [`binding = "${config.cloudflare?.databaseBinding}"`, "D1 binding"],
    [`database_name = "${config.cloudflare?.databaseName}"`, "D1 database name"],
    [`database_id = "${config.cloudflare?.databaseId}"`, "D1 database ID"],
  ];
  for (const [needle, label] of checks) {
    if (!wrangler.includes(needle)) critical.push(`wrangler.toml does not match ${label}: expected ${needle}`);
  }
}

const deployScript = path.join(websiteRoot, "tools", "deploy-cloudflare.mjs");
warnIfMissingText(deployScript, [
  config.cloudflare?.apiTokenEnv,
  config.cloudflare?.accountIdEnv,
], "deploy script");

const cacheScript = path.join(websiteRoot, "tools", "purge-cloudflare-cache.mjs");
warnIfMissingText(cacheScript, [
  config.cloudflare?.apiTokenEnv,
  config.cloudflare?.zoneId,
], "cache purge script");

const sourceDocPath = path.join(websiteRoot, config.governance?.sourceOfTruthDoc ?? "");
warnIfMissingText(sourceDocPath, [
  config.project?.canonicalRepo,
  config.cloudflare?.databaseName,
  config.cloudflare?.workerName,
  config.commands?.configAudit,
], "source-of-truth doc");

const deploymentDocPath = path.join(websiteRoot, config.governance?.deploymentRunbook ?? "");
warnIfMissingText(deploymentDocPath, [
  config.cloudflare?.apiTokenEnv,
  config.cloudflare?.accountIdEnv,
  "npm run deploy:dad",
], "deployment runbook");

const gitignorePath = path.join(websiteRoot, ".gitignore");
warnIfMissingText(gitignorePath, [
  "/.open-next",
  "/.wrangler/",
  "/playwright-report/",
  "/test-results/",
], ".gitignore");

const forbiddenRootNames = [
  "website-hero-deploy",
  "website-hero-release",
  "website-image-source-clean-deploy",
  "website-push-audit-sweep3",
];
const projectRoot = path.resolve(websiteRoot, "..");
for (const folder of forbiddenRootNames) {
  if (existsSync(path.join(projectRoot, folder))) {
    warnings.push(`Old scratch/release folder still exists in project root: ${folder}. Move to archive when no longer needed.`);
  }
}

if (!quiet || critical.length || warnings.length) {
  console.log("Events4Singles project config audit");
  console.log(`Registry: ${configPath}`);
}

if (critical.length) {
  console.log("\nCritical drift:");
  for (const issue of critical) console.log(`- ${issue}`);
}

if (warnings.length && !quiet) {
  console.log("\nWarnings:");
  for (const issue of warnings) console.log(`- ${issue}`);
}

if (!critical.length && !quiet) {
  console.log("\nProject config audit passed.");
  if (warnings.length) console.log(`${warnings.length} warning(s) should be tidied, but they do not block the loop.`);
}

if (critical.length) process.exit(1);
