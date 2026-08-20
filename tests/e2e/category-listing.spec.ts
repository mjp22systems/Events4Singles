import { test, expect } from "@playwright/test";

test.describe("Category listing page", () => {
  test("social-clubs/sydney renders without error", async ({ page }) => {
    const response = await page.goto("/social-clubs/sydney");
    expect(response?.status()).toBeLessThan(400);
  });

  test("category page has a heading", async ({ page }) => {
    await page.goto("/social-clubs/sydney");
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible({ timeout: 10000 });
  });

  test("category page includes site header", async ({ page }) => {
    await page.goto("/social-clubs/sydney");
    await expect(page.locator('[role="banner"]')).toBeVisible({ timeout: 10000 });
  });
});
