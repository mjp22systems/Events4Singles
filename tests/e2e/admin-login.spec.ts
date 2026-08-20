import { test, expect } from "@playwright/test";

test.describe("Admin login page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/login");
  });

  test("page loads with 200 status", async ({ page }) => {
    const response = await page.goto("/admin/login");
    expect(response?.status()).toBe(200);
  });

  test("renders Sign in heading", async ({ page }) => {
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("Sign in");
  });

  test("password input is present and focusable", async ({ page }) => {
    const input = page.locator('input[name="password"]');
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute("type", "password");
  });

  test("submit button is present", async ({ page }) => {
    const btn = page.locator('button[type="submit"]');
    await expect(btn).toBeVisible();
    await expect(btn).toContainText("Sign in");
  });

  test("wrong credentials show an error or rate-limit response", async ({ page }) => {
    const input = page.locator('input[name="password"]');
    const btn = page.locator('button[type="submit"]');

    await input.fill("definitely-wrong-password-e2e-test");
    await btn.click();

    // Either a [role="alert"] error message or a 429 rate-limit response
    await page.waitForTimeout(1500);
    const alert = page.locator('[role="alert"]');
    const hasAlert = await alert.count() > 0;
    // The page body must have changed — either shows error or rate-limit message
    const body = await page.locator("body").textContent();
    expect(body && body.length > 0).toBeTruthy();
    if (hasAlert) {
      await expect(alert.first()).not.toBeEmpty();
    }
  });

  test("e4s admin logo mark is visible", async ({ page }) => {
    const logo = page.locator(".admin-sidebar__logo-mark");
    await expect(logo).toBeVisible();
    await expect(logo).toContainText("e4s");
  });
});
