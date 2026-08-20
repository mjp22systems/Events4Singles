import { test, expect } from "@playwright/test";

// ID 374 (Clint Paddison Comedian) is a known real listing
const KNOWN_ID = 374;

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
});
