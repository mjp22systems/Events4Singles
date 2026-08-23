import { expect, test, type Page } from "@playwright/test";

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    return {
      bodyScrollWidth: body.scrollWidth,
      bodyClientWidth: body.clientWidth,
      docScrollWidth: root.scrollWidth,
      docClientWidth: root.clientWidth,
    };
  });

  expect(overflow.bodyScrollWidth, JSON.stringify(overflow)).toBeLessThanOrEqual(
    overflow.bodyClientWidth + 1,
  );
  expect(overflow.docScrollWidth, JSON.stringify(overflow)).toBeLessThanOrEqual(
    overflow.docClientWidth + 1,
  );
}

test.describe("responsive CSS", () => {
  const publicRoutes = [
    "/",
    "/advertise",
    "/businesses",
    "/categories",
    "/cities",
    "/dating-resources",
    "/events",
  ];

  test("mobile header exposes the menu and opens navigation", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const menuButton = page.locator(".e4s-header__menu-btn");
    await page.waitForLoadState("load");
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await expect(page.locator(".e4s-nav")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  for (const route of publicRoutes) {
    test(`${route} does not overflow mobile width`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 900 });
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page.locator("main#site-content")).toHaveCount(1);
      await expectNoHorizontalOverflow(page);
    });
  }

  for (const width of [768, 1280]) {
    test(`business directory does not overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/businesses", { waitUntil: "domcontentloaded" });
      await expectNoHorizontalOverflow(page);
    });
  }

  test("category promo banners do not overflow tablet width", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 });
    await page.goto("/social-clubs/sydney", { waitUntil: "domcontentloaded" });
    await expectNoHorizontalOverflow(page);
  });

  for (const width of [768, 1280]) {
    test(`newsletter honeypot stays out of layout at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await expectNoHorizontalOverflow(page);
    });
  }
});
