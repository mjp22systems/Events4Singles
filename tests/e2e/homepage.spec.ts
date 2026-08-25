import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
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

  test("homepage CTA buttons keep component styling", async ({ page }) => {
    const intentBrowse = page.locator(".e4s-home-intent-tile__browse").first();
    const advertiserCta = page.locator(".e4s-home-advertise-cta__btn");

    await expect(intentBrowse).toBeVisible();
    await expect(advertiserCta).toBeVisible();

    const styles = await page.evaluate(() => {
      const intent = document.querySelector(".e4s-home-intent-tile__browse") as HTMLElement;
      const advertiser = document.querySelector(".e4s-home-advertise-cta__btn") as HTMLElement;
      const intentStyle = getComputedStyle(intent);
      const advertiserStyle = getComputedStyle(advertiser);

      return {
        intentDisplay: intentStyle.display,
        intentJustify: intentStyle.justifyContent,
        intentHeight: intent.getBoundingClientRect().height,
        intentColor: intentStyle.color,
        advertiserDisplay: advertiserStyle.display,
        advertiserJustify: advertiserStyle.justifyContent,
        advertiserColor: advertiserStyle.color,
      };
    });

    expect(styles.intentDisplay).toBe("flex");
    expect(styles.intentJustify).toBe("center");
    expect(styles.intentHeight).toBeGreaterThanOrEqual(46);
    expect(styles.intentColor).toBe("rgb(139, 47, 67)");
    expect(styles.advertiserDisplay).toBe("inline-flex");
    expect(styles.advertiserJustify).toBe("center");
    expect(styles.advertiserColor).toBe("rgb(255, 255, 255)");
  });

  test("preloads the italic hero font", async ({ page }) => {
    const italicPreload = page.locator('link[rel="preload"][href="/fonts/source-serif-4-italic-latin.woff2"]');
    await expect(italicPreload).toHaveAttribute("as", "font");
  });

  test("header is present", async ({ page }) => {
    await expect(page.locator('[role="banner"]')).toBeVisible();
  });

  test("restores open header menu before React hydration", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => {
      window.localStorage.setItem("e4s-nav-open", "1");
    });
    await page.route("**/_next/static/**/*.js", (route) => route.abort());

    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator("body")).toHaveClass(/e4s-nav-open/);
    await expect(page.getByRole("navigation", { name: "Site navigation" })).toBeVisible();
  });

  test("keeps open header menu layout stable through hydration", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => {
      window.localStorage.setItem("e4s-nav-open", "1");
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toHaveClass(/e4s-nav-open/);
    await expect(page.getByRole("navigation", { name: "Site navigation" })).toBeVisible();

    const initialPadding = await page.evaluate(() => parseFloat(getComputedStyle(document.body).paddingTop));
    await page.waitForLoadState("load");
    await page.waitForTimeout(500);
    const hydratedPadding = await page.evaluate(() => parseFloat(getComputedStyle(document.body).paddingTop));

    expect(Math.abs(hydratedPadding - initialPadding)).toBeLessThanOrEqual(2);
  });

  test("footer is present", async ({ page }) => {
    await expect(page.locator("footer")).toBeVisible();
  });
});
