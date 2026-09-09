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

  test("type, category, and location filters fit in the filter bar", async ({ page }) => {
    await page.setViewportSize({ width: 1180, height: 820 });
    await page.reload();

    await expect(page.locator("#biz-search")).toBeVisible();
    await expect(page.locator("#biz-type-filter")).toBeVisible();
    await expect(page.locator("#biz-category-filter")).toBeVisible();
    await expect(page.locator("#biz-location-filter")).toBeVisible();
    await expect(page.locator("#biz-type-filter option").first()).toHaveText("All types");
    await expect(page.locator("#biz-category-filter option").first()).toHaveText("All categories");
    await expect(page.locator("#biz-location-filter option").first()).toHaveText("All locations");

    const layout = await page.locator(".e4s-businesses__filters").evaluate((filters) => {
      const filterRect = filters.getBoundingClientRect();
      const controls = Array.from(filters.querySelectorAll("input, select")).map((control) => {
        const rect = control.getBoundingClientRect();
        return {
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
          scrollWidth: (control as HTMLElement).scrollWidth,
          clientWidth: (control as HTMLElement).clientWidth,
        };
      });
      return {
        filterLeft: filterRect.left,
        filterRight: filterRect.right,
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        controls,
      };
    });

    expect(layout.controls).toHaveLength(4);
    expect(layout.scrollWidth, JSON.stringify(layout)).toBeLessThanOrEqual(layout.viewportWidth + 1);
    for (const control of layout.controls) {
      expect(control.left, JSON.stringify(layout)).toBeGreaterThanOrEqual(layout.filterLeft - 1);
      expect(control.right, JSON.stringify(layout)).toBeLessThanOrEqual(layout.filterRight + 1);
      expect(control.scrollWidth, JSON.stringify(layout)).toBeLessThanOrEqual(control.clientWidth + 24);
      expect(Math.abs(control.top - layout.controls[0].top), JSON.stringify(layout)).toBeLessThanOrEqual(2);
    }
  });

  test("at least one business group is rendered", async ({ page }) => {
    const groups = page.locator(".e4s-businesses__group");
    await expect(groups.first()).toBeVisible({ timeout: 10000 });
  });

  test("back navigation restores directory scroll position", async ({ page }) => {
    const links = page.locator(".e4s-businesses__link");
    const linkCount = await links.count();
    test.skip(linkCount < 8, "Local smoke data is too small to test scroll restoration on the business directory.");

    await links.nth(linkCount - 1).scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => window.scrollY);
    expect(before).toBeGreaterThan(100);

    await links.nth(linkCount - 1).click();
    await expect(page).toHaveURL(/\/profile\//);

    await page.goBack();
    await expect(page).toHaveURL(/\/businesses$/);
    await page.waitForTimeout(500);

    const after = await page.evaluate(() => window.scrollY);
    expect(after).toBeGreaterThan(100);
  });
});
