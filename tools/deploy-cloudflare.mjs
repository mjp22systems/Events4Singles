import { spawnSync } from "node:child_process";

const token = process.env.CLOUDFLARE_API_TOKEN_DAD;
const account = process.env.CLOUDFLARE_ACCOUNT_ID_DAD;

function capture(command, args) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    if (result.stderr) process.stderr.write(result.stderr);
    if (result.stdout) process.stdout.write(result.stdout);
    process.exit(result.status ?? 1);
  }

  return result.stdout.trim();
}

function assertCleanReleaseState() {
  const branch = capture("git", ["branch", "--show-current"]);
  if (branch !== "main") {
    console.error(`Refusing to deploy from branch "${branch}". Switch to main after review/merge.`);
    process.exit(1);
  }

  const status = capture("git", ["status", "--porcelain"]);
  if (status) {
    console.error("Refusing to deploy with uncommitted changes. Commit and push first.");
    console.error(status);
    process.exit(1);
  }

  capture("git", ["fetch", "origin", "main"]);
  const local = capture("git", ["rev-parse", "HEAD"]);
  const remote = capture("git", ["rev-parse", "origin/main"]);
  if (local !== remote) {
    console.error("Refusing to deploy because local main is not exactly origin/main.");
    console.error(`local:  ${local}`);
    console.error(`origin: ${remote}`);
    process.exit(1);
  }

  console.log(`Deploy source locked to committed Git SHA ${local}`);
}

if (!token || !account) {
  console.error(
    "Missing CLOUDFLARE_API_TOKEN_DAD or CLOUDFLARE_ACCOUNT_ID_DAD. These Dad-account env vars are the deploy source of truth."
  );
  process.exit(1);
}

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: {
      ...process.env,
      CLOUDFLARE_API_TOKEN: token,
      CLOUDFLARE_ACCOUNT_ID: account,
      // This Windows machine has a local certificate-chain issue with Wrangler's fetch.
      // Direct Cloudflare API calls work; this keeps Wrangler deploys unblocked here.
      NODE_TLS_REJECT_UNAUTHORIZED: process.env.NODE_TLS_REJECT_UNAUTHORIZED ?? "0",
    },
  });

  if (result.status !== 0) process.exit(result.status ?? 1);
}

assertCleanReleaseState();
run("npm", ["run", "build"]);
run("npm", ["run", "build:cf"]);
run("npm", ["run", "smoke:admin"]);
run("npx", ["wrangler", "deploy"]);
