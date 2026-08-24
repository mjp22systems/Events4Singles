import { test, expect } from "@playwright/test";
import { SignJWT } from "jose";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const SESSION_COOKIE = "e4s_admin_session";
const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:10400";
// Local smoke D1 seeds business 1; live/staging data has historically used 374.
const KNOWN_ID = process.env.E2E_BASE_URL ? 374 : 1;

function loadLocalEnv(name: string) {
  if (process.env[name]) return process.env[name];
  const envPath = join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return undefined;
  const match = readFileSync(envPath, "utf8").match(new RegExp(`^${name}=(.*)$`, "m"));
  return match?.[1]?.trim();
}

async function signAdminToken(secret: string) {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + 8 * 60 * 60)
    .sign(new TextEncoder().encode(secret));
}

async function addAdminCookie(page: import("@playwright/test").Page) {
  const sessionSecret = loadLocalEnv("ADMIN_SESSION_SECRET");
  if (!sessionSecret) throw new Error("ADMIN_SESSION_SECRET is required for admin profile tests.");
  const url = new URL(BASE_URL);
  await page.context().addCookies([{
    name: SESSION_COOKIE,
    value: await signAdminToken(sessionSecret),
    domain: url.hostname,
    path: "/",
    httpOnly: true,
    secure: url.protocol === "https:",
    sameSite: "Lax",
    expires: Math.floor(Date.now() / 1000) + 8 * 60 * 60,
  }]);
}

test.describe("Profile page", () => {
  test("known profile responds with 200", async ({ page }) => {
    const response = await page.goto(`/profile/${KNOWN_ID}`);
    // May redirect to slug URL — follow it; final status should be 200
    const status = response?.status() ?? 200;
    expect(status).toBeLessThan(400);
  });

  test("profile page with known ID renders a heading", async ({ page }) => {
    await page.goto(`/profile/${KNOWN_ID}`);
    // Profile page shows listing cards with h2 titles, not h1
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test("profile page includes site header", async ({ page }) => {
    await page.goto(`/profile/${KNOWN_ID}`);
    await expect(page.locator('[role="banner"]')).toBeVisible({ timeout: 10000 });
  });

  test("admin-authenticated profile pages remain scrollable", async ({ page }) => {
    await addAdminCookie(page);
    await page.goto(`/profile/${KNOWN_ID}`, { waitUntil: "domcontentloaded" });
    await expect(page.locator(".e4s-admin-bar")).toBeVisible({ timeout: 10000 });

    const before = await page.evaluate(() => ({
      htmlOverflow: getComputedStyle(document.documentElement).overflowY,
      bodyOverflow: getComputedStyle(document.body).overflowY,
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight,
      scrollY: window.scrollY,
    }));
    expect(before.htmlOverflow).not.toBe("hidden");
    expect(before.bodyOverflow).not.toBe("hidden");
    expect(before.scrollHeight).toBeGreaterThan(before.clientHeight);

    await page.mouse.wheel(0, 800);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before.scrollY);
  });

  test("admin edit drawer opens and cleans up page state", async ({ page }) => {
    await addAdminCookie(page);
    await page.goto(`/profile/${KNOWN_ID}`, { waitUntil: "domcontentloaded" });

    await page.getByRole("button", { name: "Edit Listing" }).click();
    await expect(page.getByRole("dialog", { name: "Edit listing" })).toBeVisible();
    await expect(page.getByText("Business name (shown as heading on all pages)")).toBeVisible();
    await expect(page.locator(".e4s-edit-field input").first()).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.body.classList.contains("drawer-open"))).toBe(true);

    await page.getByRole("button", { name: "Close" }).click();
    await expect(page.getByRole("dialog", { name: "Edit listing" })).toBeHidden();
    await expect.poll(() => page.evaluate(() => document.body.classList.contains("drawer-open"))).toBe(false);

    const scrollY = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 800);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(scrollY);
  });
});
