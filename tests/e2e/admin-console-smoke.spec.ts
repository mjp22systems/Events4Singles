import { expect, test } from "@playwright/test";
import { SignJWT } from "jose";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const SESSION_COOKIE = "e4s_admin_session";
const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:10400";

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

const ADMIN_ROUTES = [
  { path: "/admin/dashboard", heading: "Dashboard" },
  { path: "/admin/activity", heading: "Activity Log" },
  { path: "/admin/business-requests", heading: "Business Requests" },
  { path: "/admin/users", heading: "Users" },
  { path: "/admin/businesses", heading: "Businesses" },
  { path: "/admin/listings", heading: "Listings" },
  { path: "/admin/events", heading: "Events" },
  { path: "/admin/banners", heading: "Banners" },
  { path: "/admin/categories", heading: "Categories" },
  { path: "/admin/cities", heading: "Cities" },
  { path: "/admin/integrations", heading: "Integrations" },
  { path: "/admin/payments", heading: "Payments" },
  { path: "/admin/seo", heading: "Redirects" },
  { path: "/admin/analytics", heading: "Analytics" },
  { path: "/admin/tools", heading: "Listing Review" },
  { path: "/admin/settings", heading: "Settings" },
  { path: "/admin/profile", heading: "Admin Profile" },
];

test.describe("Admin console smoke", () => {
  test.describe.configure({ mode: "serial" });
  test.setTimeout(45_000);

  test.beforeEach(async ({ page }) => {
    const password = process.env.ADMIN_SMOKE_PASSWORD;
    const sessionSecret = loadLocalEnv("ADMIN_SESSION_SECRET");

    if (password) {
      const response = await page.request.post("/admin/api/login", {
        data: { password },
      });
      expect(response.ok()).toBeTruthy();
      return;
    }

    if (!sessionSecret) {
      throw new Error("ADMIN_SMOKE_PASSWORD or ADMIN_SESSION_SECRET is required for admin smoke tests.");
    }

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
  });

  for (const route of ADMIN_ROUTES) {
    test(`${route.path} loads`, async ({ page }) => {
      const response = await page.goto(route.path, { waitUntil: "domcontentloaded", timeout: 30_000 });
      expect(response?.status(), `${route.path} should not error`).toBeLessThan(400);
      await expect(page.locator("h1").first()).toContainText(route.heading, { timeout: 10000 });
      await expect(page.locator("body")).not.toContainText(/Application error|Internal Server Error|Unhandled Runtime Error/i);
    });
  }

  test("customer nav order stays consistent", async ({ page }) => {
    await page.goto("/admin/users", { waitUntil: "domcontentloaded", timeout: 30_000 });
    await expect(page.locator("h1").first()).toContainText("Users", { timeout: 10000 });
    await expect(page.locator(".admin-sidebar__logo-sub")).toContainText("Admin Console");
    await expect(page.locator(".admin-topbar")).not.toContainText("Admin Console");
    await expect(page.locator(".admin-user-chip")).toBeVisible();
    await expect(page.locator("th", { hasText: "Presence" })).toBeVisible();
    const labels = await page.locator(".admin-nav-item").evaluateAll((items) =>
      items.map((item) => item.textContent?.trim()).filter(Boolean)
    );

    const expectedOrder = ["Users", "Businesses", "Requests", "Listings", "Listing Review", "Events", "Banners"];
    const positions = expectedOrder.map((label) => labels.indexOf(label));
    expect(positions.every((position) => position >= 0)).toBeTruthy();
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  test("add modals open on data pages", async ({ page }) => {
    const addModals = [
      { path: "/admin/users?add=1", text: "Add user" },
      { path: "/admin/businesses?add=1", text: "Add business" },
      { path: "/admin/listings?add=1", text: "Add listing" },
      { path: "/admin/events?add=1", text: "Add event" },
      { path: "/admin/banners?add=1", text: "Add banner" },
      { path: "/admin/categories?add=1", text: "Add category" },
      { path: "/admin/cities?add=1", text: "Add city" },
    ];

    for (const modal of addModals) {
      await page.goto(modal.path, { waitUntil: "domcontentloaded", timeout: 30_000 });
      await expect(page.locator(".admin-modal__title", { hasText: modal.text }).first()).toBeVisible({ timeout: 10_000 });
      await expect(page.locator(".admin-modal").first()).toBeVisible();
    }
  });

  test("admin theme choice persists across pages", async ({ page }) => {
    await page.goto("/admin/users", { waitUntil: "domcontentloaded", timeout: 30_000 });
    await page.evaluate(() => window.localStorage.setItem("e4s-admin-theme", "light"));
    await page.goto("/admin/businesses", { waitUntil: "domcontentloaded", timeout: 30_000 });
    await expect(page.locator("html")).toHaveAttribute("data-admin-theme", "light");
  });

  test("admin bulk controls are wired to real actions", async ({ page }) => {
    const bulkPages = [
      "/admin/business-requests",
      "/admin/users",
      "/admin/businesses",
      "/admin/listings",
      "/admin/tools",
      "/admin/events",
      "/admin/banners",
      "/admin/integrations",
      "/admin/categories",
      "/admin/cities",
    ];

    for (const path of bulkPages) {
      await page.goto(path, { waitUntil: "domcontentloaded", timeout: 30_000 });
      await expect(page.locator("script").filter({ hasText: "bulk-check" })).toHaveCount(0);

      const selectAll = page.locator("#bulk-select-all");
      const rowChecks = page.locator(".bulk-check");
      await expect(page.locator('[data-admin-bulk-select-ready="true"]')).toBeAttached();
      await expect(selectAll).toBeVisible();

      if (await rowChecks.count()) {
        await selectAll.check();
        await expect(rowChecks.first()).toBeChecked();
      }
    }
  });

  test("admin table content is centered", async ({ page }) => {
    await page.goto("/admin/listings", { waitUntil: "domcontentloaded", timeout: 30_000 });
    await expect(page.locator(".a-table th").first()).toBeVisible();

    const headerAlign = await page.locator(".a-table th").first().evaluate((el) => getComputedStyle(el).textAlign);
    const cellAlign = await page.locator(".a-table td").first().evaluate((el) => getComputedStyle(el).textAlign);

    expect(headerAlign).toBe("center");
    expect(cellAlign).toBe("center");
  });

  test("admin tables stay inside the viewport", async ({ page }) => {
    const paths = [
      "/admin/users",
      "/admin/businesses",
      "/admin/listings",
      "/admin/events",
      "/admin/banners",
      "/admin/integrations",
      "/admin/categories",
      "/admin/cities",
    ];

    for (const path of paths) {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(path, { waitUntil: "domcontentloaded", timeout: 30_000 });
      await expect(page.locator(".a-table-wrap").first()).toBeVisible({ timeout: 10_000 });

      const hasPageOverflow = await page.evaluate(() =>
        document.documentElement.scrollWidth > document.documentElement.clientWidth
      );

      expect(hasPageOverflow, `${path} should not create page-level horizontal overflow`).toBeFalsy();
    }
  });

  test("taxonomy bulk menus only show supported actions", async ({ page }) => {
    for (const path of ["/admin/categories", "/admin/cities"]) {
      await page.goto(path, { waitUntil: "domcontentloaded", timeout: 30_000 });
      const options = await page.locator('select[name="action"] option').evaluateAll((items) =>
        items.map((item) => item.textContent?.trim())
      );

      expect(options).toContain("Delete");
      expect(options).not.toContain("Approve");
      expect(options).not.toContain("Reject");
    }
  });
});
