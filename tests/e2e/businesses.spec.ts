import { test, expect } from "@playwright/test";

test.describe("Businesses directory page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/businesses");
  });

  test("page loads with 200 status", async ({ page }) => {
    const response = await page.goto("/businesses");
    expect(response?.status()).toBe(200);
  });

  test("page title contains Business Directory", async ({ page }) => {
    await expect(page).toHaveTitle(/Business Directory/i);
  });

  test("h1 reads Business Directory", async ({ page }) => {
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("Business Directory");
  });

  test("A-Z index grid is visible", async ({ page }) => {
    // The index letters render inside .e4s-businesses__index
    const index = page.locator(".e4s-businesses__index");
    await expect(index).toBeVisible({ timeout: 10000 });
    // At least one letter link should be present
    const letters = index.locator("a");
    await expect(letters.first()).toBeVisible();
  });

  test("search input is present", async ({ page }) => {
    const search = page.locator("#biz-search");
    await expect(search).toBeVisible();
  });

  test("at least one business group is rendered", async ({ page }) => {
    const groups = page.locator(".e4s-businesses__group");
    await expect(groups.first()).toBeVisible({ timeout: 10000 });
  });
});
