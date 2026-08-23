# Events4Singles Deployment Runbook

## Source Of Truth

GitHub `main` is the source of truth. Cloudflare production must only be deployed from a clean, pushed `main` commit.

## Standard Release

Project keyword: **Release** means save the intended work, push it to GitHub, then deploy through the locked process. If Matt says "release this", "make this live", or "ship it", do the full sequence instead of asking him to name every command.

1. Work on a branch.
2. Run local checks.
3. Commit the source changes.
4. Push the branch and review.
5. Merge to `main`.
6. On a clean local `main`, run:

```powershell
npm run deploy:dad
```

The deploy script refuses to run unless:

- the current branch is `main`
- there are no uncommitted changes
- local `main` exactly matches `origin/main`
- build and admin smoke checks pass

## Cloudflare

Use only the Dad account environment variables:

```powershell
CLOUDFLARE_API_TOKEN_DAD
CLOUDFLARE_ACCOUNT_ID_DAD
```

Do not use browser login state as the deployment authority. Do not deploy with plain `wrangler deploy` from a dirty workspace.

## D1 Migrations

Every schema change needs a committed migration file. Apply locally first, then apply remotely only as part of a release checkpoint.

Before remote migration work, export the remote D1 database:

```powershell
$env:CLOUDFLARE_API_TOKEN = $env:CLOUDFLARE_API_TOKEN_DAD
$env:CLOUDFLARE_ACCOUNT_ID = $env:CLOUDFLARE_ACCOUNT_ID_DAD
$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"
npx wrangler d1 export events4singles --remote --output ..\events4singles-d1-backup.sql
```

## Generated Files

Do not commit OpenNext output, Playwright reports, test results, local logs, or temporary stylesheet snapshots.
