import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/Events4Singles/i);
  });

  test("hero section is visible with heading", async ({ page }) => {
    const hero = page.locator(".e4s-home-hero");
    await expect(hero).toBeVisible({ timeout: 10000 });
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
  });

  test("hero has primary CTA link", async ({ page }) => {
    const cta = page.locator(".e4s-home-hero__cta--primary");
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", /events|cities|categories/);
  });

  test("header is present", async ({ page }) => {
    await expect(page.locator('[role="banner"]')).toBeVisible();
  });

  test("footer is present", async ({ page }) => {
    await expect(page.locator("footer")).toBeVisible();
  });
});
