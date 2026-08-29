import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const websiteRoot = process.cwd();
const gitDirResult = spawnSync("git", ["rev-parse", "--git-dir"], {
  cwd: websiteRoot,
  encoding: "utf8",
});

if (gitDirResult.status !== 0) {
  console.error("Could not locate .git directory from website root.");
  process.exit(1);
}

const gitDir = path.resolve(websiteRoot, gitDirResult.stdout.trim());
const hooksDir = path.join(gitDir, "hooks");
const hookPath = path.join(hooksDir, "post-commit");
const hookBody = `#!/bin/sh
# Events4Singles project memory loop.
# Keeps the parent-level Graphify graph current after commits.
# Successes are recorded in ../graphify-out/refresh-log.jsonl.
# Failures are recorded there too, plus ../graphify-out/refresh-errors.log.
repo_root="$(git rev-parse --show-toplevel 2>/dev/null)"
if [ -n "$repo_root" ] && command -v node >/dev/null 2>&1; then
  (cd "$repo_root" && node tools/refresh-project-memory.mjs --quiet-hook) || true
fi
`;

mkdirSync(hooksDir, { recursive: true });

if (existsSync(hookPath)) {
  const marker = "Events4Singles project memory loop";
  const existing = await import("node:fs").then((fs) => fs.readFileSync(hookPath, "utf8"));
  if (existing.includes(marker)) {
    if (existing.trim() !== hookBody.trim()) {
      writeFileSync(hookPath, hookBody, "utf8");
      console.log("Updated project memory post-commit hook.");
    } else {
      console.log("Project memory post-commit hook is already installed.");
    }
    process.exit(0);
  }
  writeFileSync(hookPath, `${existing.trimEnd()}\n\n${hookBody}`, "utf8");
} else {
  writeFileSync(hookPath, hookBody, "utf8");
}

if (process.platform !== "win32") {
  spawnSync("chmod", ["+x", hookPath], { stdio: "ignore" });
}

console.log(`Installed project memory post-commit hook at ${hookPath}`);
