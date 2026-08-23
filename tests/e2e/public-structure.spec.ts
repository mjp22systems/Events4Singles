import { expect, test } from "@playwright/test";

const PUBLIC_ROUTES = [
  "/",
  "/advertise",
  "/businesses",
  "/categories",
  "/cities",
  "/contact",
  "/dating-resources",
  "/find-a-partner",
  "/events",
];

test.describe("public page structure", () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route} has one main content landmark`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });

      const siteContent = page.locator("main#site-content");
      await expect(siteContent).toHaveCount(1);
      await expect(page.locator("#site-content")).toHaveCount(1);
    });
  }

  test("public routes load the public stylesheet only once", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator('link[rel="stylesheet"][href="/site.css"]')).toHaveCount(1);
  });
});
