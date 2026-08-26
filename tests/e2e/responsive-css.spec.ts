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
  const typographyHref = `${baseUrl}/typography.css?e2e=responsive-css`;
  const stylesheetHref = `${baseUrl}/site.css?e2e=responsive-css`;
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

  test("header dropdown placeholders reflect all and nested route state", async ({ page }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width: 1280, height: 900 });

    await page.goto("/cities", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".e4s-nav select").nth(0).locator("option").first()).toHaveText("All Cities");

    await page.goto("/categories", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".e4s-nav select").nth(1).locator("option").first()).toHaveText("All Categories");

    await page.goto("/dance-classes/salsa/sydney", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".e4s-nav select").nth(0).locator("option").first()).toHaveText("Sydney");
  });

  test("secondary side pagers stack below primary side pagers", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.setContent(`
      <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="${typographyHref}">
          <link rel="stylesheet" href="${stylesheetHref}">
        </head>
        <body>
          <a class="e4s-location-pager e4s-location-pager--prev" href="#"><span class="e4s-location-pager__icon"></span><span class="e4s-location-pager__label">Melbourne</span></a>
          <a class="e4s-location-pager e4s-location-pager--next" href="#"><span class="e4s-location-pager__icon"></span><span class="e4s-location-pager__label">Brisbane</span></a>
          <a class="e4s-location-pager e4s-location-pager--prev e4s-location-pager--secondary" href="#"><span class="e4s-location-pager__icon"></span><span class="e4s-location-pager__label">Ceroc</span></a>
          <a class="e4s-location-pager e4s-location-pager--next e4s-location-pager--secondary" href="#"><span class="e4s-location-pager__icon"></span><span class="e4s-location-pager__label">Tango</span></a>
          <aside>
            <nav aria-label="Other Styles"><a href="#">Tango</a></nav>
            <nav aria-label="Other Cities"><a href="#">Brisbane</a></nav>
          </aside>
        </body>
      </html>
    `);

    await expect(page.locator(".e4s-location-pager--prev").first()).toBeVisible();
    await expect(page.locator(".e4s-location-pager--next").first()).toBeVisible();
    await expect(page.locator(".e4s-location-pager--secondary.e4s-location-pager--prev")).toHaveCount(1);
    await expect(page.locator(".e4s-location-pager--secondary.e4s-location-pager--next")).toHaveCount(1);
    await expect(page.getByRole("navigation", { name: "Other Styles" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Other Cities" })).toBeVisible();

    const offsets = await page.evaluate(() => {
      const primary = document.querySelector(".e4s-location-pager--prev:not(.e4s-location-pager--secondary)")!.getBoundingClientRect();
      const secondary = document.querySelector(".e4s-location-pager--prev.e4s-location-pager--secondary")!.getBoundingClientRect();
      return {
        primaryTop: Math.round(primary.top),
        secondaryTop: Math.round(secondary.top),
      };
    });
    expect(offsets.secondaryTop - offsets.primaryTop, JSON.stringify(offsets)).toBe(72);
  });

  for (const viewport of [
    { width: 844, height: 390 },
    { width: 932, height: 430 },
  ]) {
    test(`landscape header menu quick links do not overlap selects at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/", { waitUntil: "domcontentloaded" });
      const menuButton = page.locator(".e4s-header__menu-btn");
      const eventsCell = page.locator(".e4s-nav__events-cell");
      await page.waitForLoadState("load");
      if (!(await eventsCell.isVisible())) {
        await menuButton.click();
      }
      await expect(page.locator(".e4s-nav__events-cell")).toBeVisible();
      await page.waitForTimeout(150);

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
            <link rel="stylesheet" href="${typographyHref}">
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

  test("portrait promo banners preserve advertiser image ratio", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.setContent(`
      <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="${typographyHref}">
          <link rel="stylesheet" href="${stylesheetHref}">
        </head>
        <body class="e4s-page-category">
          <main class="e4s-category-template" id="site-content">
            <section class="e4s-promo-banners e4s-promo-banners--one-row">
              <a href="/advertise"><img alt="Wide advertiser" src="/images/advertise-here-180x120.svg"></a>
              <a href="/advertise"><img alt="Wide advertiser 2" src="/images/advertise-here-180x120.svg"></a>
            </section>
          </main>
        </body>
      </html>
    `);

    const boxes = await page.locator(".e4s-promo-banners > *").evaluateAll((items) =>
      items.map((item) => {
        const rect = item.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      }),
    );

    for (const box of boxes) {
      expect(box.width / box.height, JSON.stringify(boxes)).toBeCloseTo(1.5, 1);
    }
    await expectNoHorizontalOverflow(page);
  });

  test("portrait listing toolbar keeps controls on second row", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.setContent(`
      <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="${typographyHref}">
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
      const filterSummary = document.querySelector(".e4s-listings-filter summary")!.getBoundingClientRect();
      const filterTextElement = document.querySelector(".e4s-listings-filter summary span")!;
      const filterText = filterTextElement.getBoundingClientRect();
      const filterCount = document.querySelector(".e4s-listings-filter summary em")!.getBoundingClientRect();
      return {
        toolbar: { width: toolbar.width, height: toolbar.height },
        title: { top: title.top, bottom: title.bottom },
        sort: { top: sort.top, bottom: sort.bottom },
        filter: { top: filter.top, bottom: filter.bottom, width: filter.width },
        filterSummary: { height: filterSummary.height },
        filterText: {
          right: filterText.right,
          height: filterText.height,
          clientWidth: filterTextElement.clientWidth,
          scrollWidth: filterTextElement.scrollWidth,
        },
        filterCount: { left: filterCount.left },
      };
    });

    expect(layout.sort.top, JSON.stringify(layout)).toBeGreaterThanOrEqual(layout.title.bottom);
    expect(Math.abs(layout.filter.top - layout.sort.top), JSON.stringify(layout)).toBeLessThanOrEqual(4);
    expect(layout.filter.width, JSON.stringify(layout)).toBeGreaterThan(190);
    expect(layout.filterText.right, JSON.stringify(layout)).toBeLessThanOrEqual(layout.filterCount.left - 6);
    expect(layout.filterText.scrollWidth, JSON.stringify(layout)).toBeLessThanOrEqual(layout.filterText.clientWidth + 1);
    expect(layout.filterSummary.height, JSON.stringify(layout)).toBeLessThanOrEqual(32);
    expect(layout.filterText.height, JSON.stringify(layout)).toBeLessThanOrEqual(20);
    await expectNoHorizontalOverflow(page);
  });

  test("portrait listing toolbar stays sticky while scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.setContent(`
      <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="${typographyHref}">
          <link rel="stylesheet" href="${stylesheetHref}">
        </head>
        <body class="e4s-page-category" style="--e4s-sticky-top: 72px;">
          <main class="e4s-category-template" id="site-content">
            <div style="height: 240px;"></div>
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
            <div style="height: 1400px;"></div>
          </main>
        </body>
      </html>
    `);

    await page.waitForFunction(() => {
      const shield = document.querySelector(".e4s-toolbar-shield");
      return shield && getComputedStyle(shield).position === "sticky";
    });

    const sticky = await page.evaluate(async () => {
      const shield = document.querySelector(".e4s-toolbar-shield")!;
      const position = getComputedStyle(shield).position;
      window.scrollTo(0, 520);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const rect = shield.getBoundingClientRect();
      return { position, top: Math.round(rect.top) };
    });

    expect(sticky.position).toBe("sticky");
    expect(sticky.top, JSON.stringify(sticky)).toBeGreaterThanOrEqual(70);
    expect(sticky.top, JSON.stringify(sticky)).toBeLessThanOrEqual(76);
    await expectNoHorizontalOverflow(page);
  });

  test("portrait category subnav keeps sticky toolbar below it", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.setContent(`
      <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="${typographyHref}">
          <link rel="stylesheet" href="${stylesheetHref}">
        </head>
        <body class="e4s-page-category" style="--e4s-sticky-top: 84px;">
          <nav class="e4s-category-child-nav e4s-category-child-nav--category-mobile">
            <a class="e4s-category-child-nav__back" href="/categories">All Categories</a>
            <label class="e4s-category-child-nav__control">
              <span>View city</span>
              <select><option>Select city</option></select>
            </label>
          </nav>
          <main class="e4s-category-template" id="site-content">
            <div style="height: 280px;"></div>
            <div class="e4s-toolbar-shield">
              <div class="e4s-listings-toolbar">
                <span class="e4s-listings-toolbar__title">Dance Party Clubs</span>
                <label class="e4s-listings-sort"><span>Sort:</span><select><option>A-Z</option></select></label>
                <div class="e4s-listings-filter-group">
                  <details class="e4s-listings-filter">
                    <summary><span>Filter: Cities</span><em>4/4</em></summary>
                    <div class="e4s-listings-filter__panel"></div>
                  </details>
                  <button type="button" class="e4s-listings-filter-clear">Clear</button>
                </div>
              </div>
            </div>
            <div style="height: 1400px;"></div>
          </main>
        </body>
      </html>
    `);

    const layout = await page.evaluate(async () => {
      window.scrollTo(0, 500);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const nav = document.querySelector(".e4s-category-child-nav")!.getBoundingClientRect();
      const shield = document.querySelector(".e4s-toolbar-shield")!.getBoundingClientRect();
      return {
        nav: { top: Math.round(nav.top), bottom: Math.round(nav.bottom), height: Math.round(nav.height) },
        shield: { top: Math.round(shield.top), bottom: Math.round(shield.bottom) },
      };
    });

    expect(layout.nav.top, JSON.stringify(layout)).toBeGreaterThanOrEqual(82);
    expect(layout.shield.top, JSON.stringify(layout)).toBeGreaterThanOrEqual(layout.nav.bottom - 1);
    await expectNoHorizontalOverflow(page);
  });

  test("portrait child category subnav keeps city select readable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.setContent(`
      <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="${typographyHref}">
          <link rel="stylesheet" href="${stylesheetHref}">
        </head>
        <body class="e4s-page-category e4s-page-child" style="--e4s-sticky-top: 84px;">
          <nav class="e4s-category-child-nav e4s-category-child-nav--has-sidebar">
            <a class="e4s-category-child-nav__back" href="/dance-classes">Back to Dance Classes</a>
            <label class="e4s-category-child-nav__control">
              <span>View another city</span>
              <select><option>Canberra (10)</option></select>
            </label>
          </nav>
          <main class="e4s-category-template" id="site-content">
            <div style="height: 280px;"></div>
            <div class="e4s-toolbar-shield">
              <div class="e4s-listings-toolbar">
                <span class="e4s-listings-toolbar__title">Dance Classes - Canberra</span>
                <label class="e4s-listings-sort"><span>Sort:</span><select><option>A-Z</option></select></label>
              </div>
            </div>
            <div style="height: 1400px;"></div>
          </main>
        </body>
      </html>
    `);

    const layout = await page.evaluate(async () => {
      window.scrollTo(0, 500);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const nav = document.querySelector(".e4s-category-child-nav")!.getBoundingClientRect();
      const select = document.querySelector(".e4s-category-child-nav__control select")!.getBoundingClientRect();
      const shield = document.querySelector(".e4s-toolbar-shield")!.getBoundingClientRect();
      return {
        nav: { top: Math.round(nav.top), bottom: Math.round(nav.bottom), height: Math.round(nav.height) },
        select: { width: Math.round(select.width) },
        shield: { top: Math.round(shield.top) },
      };
    });

    expect(layout.nav.height, JSON.stringify(layout)).toBeGreaterThanOrEqual(100);
    expect(layout.select.width, JSON.stringify(layout)).toBeGreaterThanOrEqual(160);
    expect(layout.shield.top, JSON.stringify(layout)).toBeGreaterThanOrEqual(layout.nav.bottom - 1);
    await expectNoHorizontalOverflow(page);
  });

  test("portrait deep category subnav fits city and style controls above toolbar", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.setContent(`
      <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="${typographyHref}">
          <link rel="stylesheet" href="${stylesheetHref}">
        </head>
        <body class="e4s-page-category e4s-page-child e4s-page-deep-child" style="--e4s-sticky-top: 84px;">
          <nav class="e4s-category-child-nav e4s-category-child-nav--has-sidebar e4s-category-child-nav--multi">
            <a class="e4s-category-child-nav__back" href="/dance-classes">Back to Dance Classes</a>
            <label class="e4s-category-child-nav__control">
              <span>View another style</span>
              <select><option>Tango</option></select>
            </label>
            <label class="e4s-category-child-nav__control">
              <span>View another city</span>
              <select><option>Gold Coast (7)</option></select>
            </label>
          </nav>
          <main class="e4s-category-template" id="site-content">
            <div style="height: 280px;"></div>
            <div class="e4s-toolbar-shield">
              <div class="e4s-listings-toolbar">
                <span class="e4s-listings-toolbar__title">Tango - Gold Coast</span>
                <label class="e4s-listings-sort"><span>Sort:</span><select><option>A-Z</option></select></label>
              </div>
            </div>
            <div style="height: 1400px;"></div>
          </main>
        </body>
      </html>
    `);

    const layout = await page.evaluate(async () => {
      window.scrollTo(0, 500);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const nav = document.querySelector(".e4s-category-child-nav")!.getBoundingClientRect();
      const shield = document.querySelector(".e4s-toolbar-shield")!.getBoundingClientRect();
      const controls = Array.from(document.querySelectorAll(".e4s-category-child-nav__control")).map((node) => {
        const rect = node.getBoundingClientRect();
        return { width: Math.round(rect.width), top: Math.round(rect.top), bottom: Math.round(rect.bottom) };
      });
      return {
        nav: { top: Math.round(nav.top), bottom: Math.round(nav.bottom), height: Math.round(nav.height) },
        shield: { top: Math.round(shield.top) },
        controls,
      };
    });

    expect(layout.nav.height, JSON.stringify(layout)).toBeGreaterThanOrEqual(100);
    expect(layout.controls, JSON.stringify(layout)).toHaveLength(2);
    expect(layout.controls[1].top, JSON.stringify(layout)).toBeGreaterThanOrEqual(layout.controls[0].bottom);
    expect(layout.shield.top, JSON.stringify(layout)).toBeGreaterThanOrEqual(layout.nav.bottom - 1);
    await expectNoHorizontalOverflow(page);
  });

  test("landscape homepage experiences keep all three tiles in one row", async ({ page }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await page.setContent(`
      <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="${typographyHref}">
          <link rel="stylesheet" href="${stylesheetHref}">
        </head>
        <body class="e4s-page-home">
          <main class="e4s-home-page" id="site-content">
            <div class="e4s-shell e4s-home-exp-grid">
              <a class="e4s-home-exp-tile" href="#"><span class="e4s-home-exp-tile__img-wrap"></span><span class="e4s-home-exp-tile__body"><h3>Elegant Dinner Parties</h3><p>Copy</p></span></a>
              <a class="e4s-home-exp-tile" href="#"><span class="e4s-home-exp-tile__img-wrap"></span><span class="e4s-home-exp-tile__body"><h3>Dance & Connect</h3><p>Copy</p></span></a>
              <a class="e4s-home-exp-tile" href="#"><span class="e4s-home-exp-tile__img-wrap"></span><span class="e4s-home-exp-tile__body"><h3>Singles Travel</h3><p>Copy</p></span></a>
            </div>
          </main>
        </body>
      </html>
    `);

    await page.waitForFunction(() => {
      const grid = document.querySelector(".e4s-home-exp-grid");
      return grid && getComputedStyle(grid).gridTemplateColumns.split(" ").length === 3;
    });

    const boxes = await page.locator(".e4s-home-exp-tile").evaluateAll((items) =>
      items.map((item) => {
        const rect = item.getBoundingClientRect();
        return { top: Math.round(rect.top), width: rect.width, height: rect.height };
      }),
    );

    expect(boxes).toHaveLength(3);
    expect(new Set(boxes.map((box) => box.top)).size, JSON.stringify(boxes)).toBe(1);
    expect(Math.min(...boxes.map((box) => box.width)), JSON.stringify(boxes)).toBeGreaterThan(190);
    await expectNoHorizontalOverflow(page);
  });

  test("mobile featured sponsored tiles remain available below listings", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.setContent(`
      <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="${typographyHref}">
          <link rel="stylesheet" href="${stylesheetHref}">
        </head>
        <body class="e4s-page-home">
          <main class="e4s-home-page" id="site-content">
            <div class="e4s-home-featured-layout">
              <div class="e4s-home-featured__listings"></div>
              <aside class="e4s-home-featured__sidebar">
                ${Array.from({ length: 7 }, (_, index) => `
                  <a class="e4s-home-featured__sponsored" href="/advertise">
                    <span class="e4s-home-featured__sponsored-img"></span>
                    <span class="e4s-home-featured__sponsored-overlay">
                      <span class="e4s-home-featured__sponsored-title">Sponsored ${index + 1}</span>
                    </span>
                  </a>
                `).join("")}
              </aside>
            </div>
          </main>
        </body>
      </html>
    `);

    await page.waitForFunction(() => {
      const sidebar = document.querySelector(".e4s-home-featured__sidebar");
      return sidebar && getComputedStyle(sidebar).display === "block";
    });

    const layout = await page.evaluate(() => {
      const sidebar = document.querySelector(".e4s-home-featured__sidebar")!;
      const sponsored = Array.from(document.querySelectorAll(".e4s-home-featured__sponsored"));
      const sidebarRect = sidebar.getBoundingClientRect();
      return {
        sidebarDisplay: getComputedStyle(sidebar).display,
        sidebarHeight: sidebarRect.height,
        sponsoredCount: sponsored.length,
        visibleSponsored: sponsored.filter((item) => {
          const style = getComputedStyle(item);
          return style.visibility !== "hidden" && Number(style.opacity) > 0.5;
        }).length,
      };
    });

    expect(layout.sidebarDisplay).toBe("block");
    expect(layout.sidebarHeight, JSON.stringify(layout)).toBeGreaterThan(100);
    expect(layout.sponsoredCount).toBe(7);
    expect(layout.visibleSponsored, JSON.stringify(layout)).toBeGreaterThanOrEqual(2);
    await expectNoHorizontalOverflow(page);
  });

  test("portrait listing contact buttons stretch evenly", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.setContent(`
      <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="${typographyHref}">
          <link rel="stylesheet" href="${stylesheetHref}">
        </head>
        <body class="e4s-page-category">
          <main class="e4s-category-template" id="site-content">
            <article class="e4s-listing-card">
              <header class="e4s-listing-card__header">
                <div class="e4s-listing-card__identity">
                  <div class="e4s-listing-card__title-row">
                    <h2 class="e4s-listing-card__title">Short Title</h2>
                    <span class="e4s-listing-card__unclaimed">Unclaimed</span>
                    <span class="e4s-listing-card__location-badge">Sydney</span>
                  </div>
                </div>
                <div class="e4s-listing-card__actions">
                  <span class="e4s-listing-card__action e4s-listing-card__action--person e4s-listing-card__action--disabled"></span>
                  <span class="e4s-listing-card__action e4s-listing-card__action--phone"></span>
                  <span class="e4s-listing-card__action e4s-listing-card__action--email"></span>
                  <span class="e4s-listing-card__action e4s-listing-card__action--web"></span>
                  <span class="e4s-listing-card__action e4s-listing-card__action--address"></span>
                </div>
              </header>
            </article>
            <article class="e4s-listing-card">
              <header class="e4s-listing-card__header">
                <div class="e4s-listing-card__identity">
                  <div class="e4s-listing-card__title-row">
                    <h2 class="e4s-listing-card__title">A Much Longer Listing Title That Needs To Truncate</h2>
                    <span class="e4s-listing-card__unclaimed">Unclaimed</span>
                    <span class="e4s-listing-card__location-badge">Sydney</span>
                  </div>
                </div>
                <div class="e4s-listing-card__actions">
                  <span class="e4s-listing-card__action e4s-listing-card__action--person e4s-listing-card__action--disabled"></span>
                  <span class="e4s-listing-card__action e4s-listing-card__action--phone"></span>
                  <span class="e4s-listing-card__action e4s-listing-card__action--email e4s-listing-card__action--disabled"></span>
                  <span class="e4s-listing-card__action e4s-listing-card__action--web"></span>
                  <span class="e4s-listing-card__action e4s-listing-card__action--address"></span>
                </div>
              </header>
            </article>
          </main>
        </body>
      </html>
    `);

    const rows = await page.evaluate(() =>
      [...document.querySelectorAll(".e4s-listing-card__actions")].map((row) => {
        const rowRect = row.getBoundingClientRect();
        const buttons = [...row.querySelectorAll(".e4s-listing-card__action")].map((button) => {
          const rect = button.getBoundingClientRect();
          return { left: rect.left, width: rect.width };
        });
        return { left: rowRect.left, width: rowRect.width, buttons };
      }),
    );

    expect(rows, JSON.stringify(rows)).toHaveLength(2);
    expect(Math.abs(rows[0].width - rows[1].width), JSON.stringify(rows)).toBeLessThanOrEqual(1);
    for (const row of rows) {
      expect(row.width, JSON.stringify(rows)).toBeGreaterThanOrEqual(300);
      expect(row.buttons, JSON.stringify(rows)).toHaveLength(5);
      for (const button of row.buttons) {
        expect(Math.abs(button.width - row.buttons[0].width), JSON.stringify(row)).toBeLessThanOrEqual(1);
      }
    }
    await expectNoHorizontalOverflow(page);
  });

  test("wide portrait listing toolbar gives filters their own row", async ({ page }) => {
    await page.setViewportSize({ width: 590, height: 844 });
    await page.setContent(`
      <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="${typographyHref}">
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
      const title = document.querySelector(".e4s-listings-toolbar__title")!.getBoundingClientRect();
      const sort = document.querySelector(".e4s-listings-sort")!.getBoundingClientRect();
      const filter = document.querySelector(".e4s-listings-filter-group")!.getBoundingClientRect();
      const filterText = document.querySelector(".e4s-listings-filter summary span")!.getBoundingClientRect();
      const filterCount = document.querySelector(".e4s-listings-filter summary em")!.getBoundingClientRect();
      return {
        title: { top: title.top, bottom: title.bottom },
        sort: { top: sort.top, bottom: sort.bottom },
        filter: { top: filter.top, bottom: filter.bottom, width: filter.width },
        filterText: { right: filterText.right },
        filterCount: { left: filterCount.left },
      };
    });

    expect(layout.sort.top, JSON.stringify(layout)).toBeGreaterThanOrEqual(layout.title.bottom);
    expect(Math.abs(layout.filter.top - layout.sort.top), JSON.stringify(layout)).toBeLessThanOrEqual(4);
    expect(layout.filter.width, JSON.stringify(layout)).toBeGreaterThan(360);
    expect(layout.filterText.right, JSON.stringify(layout)).toBeLessThanOrEqual(layout.filterCount.left - 6);
    await expectNoHorizontalOverflow(page);
  });

  test("category support copy has readable mobile contrast", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.setContent(`
      <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="${typographyHref}">
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
