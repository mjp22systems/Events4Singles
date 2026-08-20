import { test, expect } from "@playwright/test";

test.describe("Footer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("footer contains Business Directory link", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    const bizLink = footer.locator('a[href="/businesses"]');
    await expect(bizLink).toBeVisible();
    await expect(bizLink).toContainText("Business Directory");
  });

  test("Business Directory link navigates to businesses page", async ({ page }) => {
    const footer = page.locator("footer");
    const bizLink = footer.locator('a[href="/businesses"]');
    await bizLink.click();
    await expect(page).toHaveURL(/\/businesses/);
    await expect(page.locator("h1").first()).toContainText("Business Directory");
  });
});
