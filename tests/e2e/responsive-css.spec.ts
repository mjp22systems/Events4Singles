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
  const baseUrl =
    process.env.E2E_BASE_URL ?? `http://localhost:${process.env.E2E_LOCAL_PORT ?? "10400"}`;
  const stylesheetHref = `${baseUrl}/site.css`;
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

  for (const viewport of [
    { width: 844, height: 390 },
    { width: 932, height: 430 },
  ]) {
    test(`landscape header menu quick links do not overlap selects at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.locator(".e4s-header__menu-btn").click();

      const bounds = await page.evaluate(() => {
        const box = (selector: string) => {
          const element = document.querySelector(selector);
          const rect = element?.getBoundingClientRect();
          return rect
            ? { left: rect.left, right: rect.right, width: rect.width }
            : null;
        };

        return {
          information: box(".e4s-nav label:nth-of-type(3)"),
          eventsCell: box(".e4s-nav__events-cell"),
          dating: box(".e4s-nav__dating-btn"),
          events: box(".e4s-nav__events-btn"),
        };
      });

      expect(bounds.information).not.toBeNull();
      expect(bounds.eventsCell).not.toBeNull();
      expect(bounds.dating).not.toBeNull();
      expect(bounds.events).not.toBeNull();
      expect((bounds.eventsCell?.left ?? 0) - (bounds.information?.right ?? 0)).toBeGreaterThanOrEqual(8);
      expect(bounds.dating?.left).toBeGreaterThanOrEqual((bounds.information?.right ?? 0) + 8);
      expect(bounds.dating?.left).toBeGreaterThanOrEqual(bounds.eventsCell?.left ?? 0);
      expect(bounds.events?.right).toBeLessThanOrEqual(bounds.eventsCell?.right ?? 0);
      await expectNoHorizontalOverflow(page);
    });
  }

  for (const route of publicRoutes) {
    test(`${route} does not overflow mobile width`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 900 });
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page.locator("main#site-content")).toHaveCount(1);
      await expectNoHorizontalOverflow(page);
    });
  }

  test("homepage hero image fills the mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const bounds = await page.evaluate(() => {
      const pageEl = document.querySelector("#site-content.e4s-home-page");
      const hero = document.querySelector(".e4s-home-hero");
      const bg = document.querySelector(".e4s-home-hero__bg");

      const rect = (element: Element | null) => {
        const box = element?.getBoundingClientRect();
        return box ? { left: box.left, right: box.right, width: box.width } : null;
      };

      return {
        viewport: document.body.clientWidth,
        backgroundImage: getComputedStyle(bg as Element).backgroundImage,
        page: rect(pageEl),
        hero: rect(hero),
        bg: rect(bg),
      };
    });

    expect(bounds.backgroundImage).toContain("/images/optimized/home-cat-mixers.webp");

    for (const box of [bounds.page, bounds.hero, bounds.bg]) {
      expect(box?.left, JSON.stringify(bounds)).toBeLessThanOrEqual(1);
      expect(
        Math.abs((box?.right ?? 0) - bounds.viewport),
        JSON.stringify(bounds),
      ).toBeLessThanOrEqual(1);
      expect(
        Math.abs((box?.width ?? 0) - bounds.viewport),
        JSON.stringify(bounds),
      ).toBeLessThanOrEqual(1);
    }
  });

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

  for (const viewport of [
    { width: 844, height: 390 },
    { width: 932, height: 430 },
  ]) {
    test(`category promo banners fit six wide on landscape phones at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.setContent(`
        <!doctype html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" href="${stylesheetHref}">
          </head>
          <body class="e4s-page-category">
            <section class="e4s-promo-banners e4s-promo-banners--one-row">
              ${Array.from({ length: 6 }, (_, index) => `
                <a href="/advertise"><img alt="Ad ${index + 1}" src="/images/advertise-here-180x120.svg"></a>
              `).join("")}
            </section>
          </body>
        </html>
      `);

      const boxes = await page.locator(".e4s-promo-banners > *").evaluateAll((items) =>
        items.map((item) => {
          const rect = item.getBoundingClientRect();
          return { top: Math.round(rect.top), width: rect.width };
        }),
      );

      expect(new Set(boxes.map((box) => box.top)).size, JSON.stringify(boxes)).toBe(1);
      expect(Math.max(...boxes.map((box) => box.width)), JSON.stringify(boxes)).toBeLessThanOrEqual(150);
      await expectNoHorizontalOverflow(page);
    });
  }

  test("portrait listing toolbar stacks controls cleanly", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.setContent(`
      <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="${stylesheetHref}">
        </head>
        <body class="e4s-page-category">
          <main class="e4s-category-template" id="site-content">
            <div class="e4s-toolbar-shield">
              <div class="e4s-listings-toolbar">
                <span class="e4s-listings-toolbar__title">Speed Dating</span>
                <label class="e4s-listings-sort"><span>Sort:</span><select><option>A-Z</option></select></label>
                <div class="e4s-listings-filter-group">
                  <details class="e4s-listings-filter">
                    <summary><span>Filter: Cities</span><em>17/17</em></summary>
                    <div class="e4s-listings-filter__panel"></div>
                  </details>
                  <button type="button" class="e4s-listings-filter-clear">Clear</button>
                </div>
              </div>
            </div>
          </main>
        </body>
      </html>
    `);

    const layout = await page.evaluate(() => {
      const toolbar = document.querySelector(".e4s-listings-toolbar")!.getBoundingClientRect();
      const title = document.querySelector(".e4s-listings-toolbar__title")!.getBoundingClientRect();
      const sort = document.querySelector(".e4s-listings-sort")!.getBoundingClientRect();
      const filter = document.querySelector(".e4s-listings-filter-group")!.getBoundingClientRect();
      return {
        toolbar: { width: toolbar.width, height: toolbar.height },
        title: { top: title.top, bottom: title.bottom },
        sort: { top: sort.top, bottom: sort.bottom },
        filter: { top: filter.top, bottom: filter.bottom, width: filter.width },
      };
    });

    expect(layout.sort.top, JSON.stringify(layout)).toBeGreaterThanOrEqual(layout.title.bottom);
    expect(layout.filter.top, JSON.stringify(layout)).toBeGreaterThanOrEqual(layout.sort.bottom);
    expect(layout.filter.width, JSON.stringify(layout)).toBeGreaterThan(290);
    await expectNoHorizontalOverflow(page);
  });

  test("category support copy has readable mobile contrast", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.setContent(`
      <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="${stylesheetHref}">
        </head>
        <body class="e4s-page-category">
          <section class="e4s-shell e4s-seo-support">
            <h2>Finding Speed Dating for Singles</h2>
            <p>This category page is designed as a stable guide to speed dating options.</p>
          </section>
        </body>
      </html>
    `);

    const styles = await page.evaluate(() => {
      const support = document.querySelector(".e4s-seo-support")!;
      const paragraph = document.querySelector(".e4s-seo-support p")!;
      return {
        supportBackground: getComputedStyle(support).backgroundColor,
        paragraphColor: getComputedStyle(paragraph).color,
      };
    });

    expect(styles.supportBackground).toBe("rgba(255, 255, 255, 0.94)");
    expect(styles.paragraphColor).toBe("rgb(65, 81, 95)");
  });

  for (const width of [768, 1280]) {
    test(`newsletter honeypot stays out of layout at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await expectNoHorizontalOverflow(page);
    });
  }
});
