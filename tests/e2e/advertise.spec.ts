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

for (const width of [390, 768, 1280]) {
  test(`advertise page layout is stable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/advertise", { waitUntil: "domcontentloaded" });

    await expect(page.locator("main#site-content")).toHaveCount(1);
    await expect(page.locator(".e4s-advertise-pro-hero")).toBeVisible();
    await expect(page.locator(".e4s-advertise-pro-hero__actions a").first()).toBeVisible();
    await expect(page.locator(".e4s-advertise-inventory__grid")).toBeVisible();
    await expect(page.locator(".e4s-advertise-placement-map")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
}
