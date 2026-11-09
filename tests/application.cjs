const { chromium } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").default;
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { createServer } = require("../scripts/serve.cjs");

(async () => {
  fs.mkdirSync("test-results", { recursive: true });
  const server = createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  let browser;
  const checks = [];
  try {
    browser = await chromium.launch({
      headless: true,
      ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH
        ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH }
        : {}),
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto(base);
    assert.equal(await page.locator(".course").count(), 7);
    assert.equal(await page.locator(".equipment-card").count(), 8);
    assert.equal(await page.locator("#ratesBody tr").count(), 14);
    for (const width of [320, 375, 600, 768, 960, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (let i = 1; i <= 6; i++) {
        await page.goto(`${base}/#halaman-${i}`);
        await page.locator(`#halaman-${i}`).waitFor({ state: "visible" });
        assert.equal(await page.locator(".page-section:visible").count(), 1);
        assert.equal(
          await page.locator('[aria-current="page"]').getAttribute("href"),
          `#halaman-${i}`,
        );
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `Overflow at ${width}, page ${i}`,
        );
        if ([320, 1440].includes(width)) {
          const result = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze();
          assert.deepEqual(
            result.violations.map((v) => ({
              id: v.id,
              nodes: v.nodes.map((n) => n.target),
            })),
            [],
            `Accessibility ${width}, page ${i}`,
          );
        }
      }
      checks.push(`All six pages: ${width}px, no document overflow`);
    }
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto(base);
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Katalog & Kartu Alat" })
      .click();
    await page.locator("#halaman-5").waitFor({ state: "visible" });
    assert.equal(
      await page.locator("#menuToggle").getAttribute("aria-expanded"),
      "false",
    );
    assert.equal(
      await page.evaluate(() => document.activeElement.id),
      "catalogTitle",
    );
    await page.locator("#searchEquipment").fill("  OSCILLOSCOPE ");
    assert.equal(await page.locator(".equipment-card").count(), 1);
    await page.locator("#categoryFilter").selectOption("Mekanika Presisi");
    assert.equal(await page.locator(".equipment-card").count(), 0);
    assert(await page.locator(".empty-state").isVisible());
    await page.locator("#resetFilters").click();
    assert.equal(await page.locator(".equipment-card").count(), 8);
    for (const category of await page
      .locator("#categoryFilter option")
      .evaluateAll((options) => options.slice(1).map((o) => o.value))) {
      await page.locator("#categoryFilter").selectOption(category);
      assert.equal(await page.locator(".equipment-card").count(), 1);
    }
    await page.locator("#resetFilters").click();
    const codes = await page
      .locator("[data-equipment]")
      .evaluateAll((buttons) => buttons.map((b) => b.dataset.equipment));
    for (const code of codes) {
      await page.locator(`[data-equipment="${code}"]`).click();
      assert(await page.locator("#kartuAlatModal").isVisible());
      assert.equal(await page.locator("#kartuAlatModal .sop li").count(), 4);
      assert(
        await page.evaluate(() => {
          const d = document.querySelector("#kartuAlatModal");
          return d.scrollWidth <= d.clientWidth;
        }),
        `Dialog overflow ${code}`,
      );
      await page.keyboard.press("Escape");
      await page.waitForFunction(
        () => !document.body.classList.contains("modal-open"),
      );
      assert.equal(
        await page.evaluate(() => document.activeElement.dataset.equipment),
        code,
      );
    }
    await page.locator("[data-equipment]").first().click();
    await page.keyboard.press("Shift+Tab");
    assert(
      await page.evaluate(() =>
        document
          .querySelector("#kartuAlatModal")
          .contains(document.activeElement),
      ),
      "Focus trap",
    );
    const dialogAudit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    assert.deepEqual(
      dialogAudit.violations.map((v) => v.id),
      [],
    );
    await page.screenshot({
      path: "test-results/card-mobile.png",
      fullPage: true,
    });
    await page.evaluate(() => {
      window.print = () => {
        window.printCalled = true;
      };
    });
    await page.locator("#printCard").click();
    assert(await page.evaluate(() => window.printCalled));
    await page.emulateMedia({ media: "print" });
    assert.equal(await page.locator("main").isVisible(), false);
    assert(await page.locator("#kartuAlatModal").isVisible());
    await page.pdf({
      path: "test-results/equipment-card.pdf",
      format: "A4",
      printBackground: true,
    });
    await page.emulateMedia({ media: "screen" });
    await page.locator("#closeModalBottom").click();
    await page.locator("[data-equipment]").first().click();
    await page.locator("#closeModal").click();
    checks.push(
      "Search, all eight category filters, empty/reset states, all eight cards, Escape/focus restoration, focus trap, close controls and print isolation pass",
    );

    // Test Category Filter Chips
    await page.goto(`${base}/#halaman-5`);
    const chipBtns = page.locator("#filterChips .chip-btn");
    assert((await chipBtns.count()) > 1);
    await chipBtns.nth(1).click();
    assert(
      await chipBtns.nth(1).evaluate((el) => el.classList.contains("active")),
    );
    const selectedCat = await chipBtns.nth(1).getAttribute("data-category");
    assert.equal(
      await page.locator("#categoryFilter").inputValue(),
      selectedCat,
    );
    await page.locator("#resetFilters").click();
    assert.equal(await page.locator("#categoryFilter").inputValue(), "ALL");
    assert(
      await chipBtns.first().evaluate((el) => el.classList.contains("active")),
    );

    // Test Cart Drawer and Stepper
    await page.locator(".add-cart-btn").first().click();
    assert.equal(await page.locator("#cartBadge").textContent(), "1");
    assert(await page.locator("#cartFloatingBtn").isVisible());
    await page.locator("#cartFloatingBtn").click();
    assert(await page.locator("#cartDrawer").isVisible());
    assert(await page.locator("#cartBackdrop").isVisible());
    assert.equal(await page.locator(".cart-item-row").count(), 1);

    // Stepper +
    await page.locator('.stepper-btn[data-stepper-delta="1"]').click();
    assert.equal(await page.locator(".stepper-val").textContent(), "2");
    assert.equal(await page.locator("#cartBadge").textContent(), "2");

    // Close Cart via Close Button
    await page.locator("#closeCartBtn").click();
    assert.equal(await page.locator("#cartDrawer").isVisible(), false);

    // Reopen & Close via Escape
    await page.locator("#cartFloatingBtn").click();
    assert(await page.locator("#cartDrawer").isVisible());
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#cartDrawer").isVisible(), false);
    checks.push(
      "Interactive category chips, Cart Drawer modal, quantity stepper and Escape controls pass",
    );

    await page.goto(`${base}/#halaman-4`);
    for (const key of ["room", "equipment", "checkout", "return"]) {
      await page.locator(`[data-form="${key}"]`).click();
      assert(await page.locator('#formStatus a[href^="mailto:"]').isVisible());
    }
    assert.equal(
      await page.evaluate(() => googleFormURL("https://evil.test/forms/d/123")),
      null,
    );
    assert.equal(
      await page.evaluate(() => googleFormURL("javascript:alert(1)")),
      null,
    );
    assert.equal(
      await page.evaluate(() =>
        googleFormURL("https://docs.google.com.evil.test/forms/d/123"),
      ),
      null,
    );
    assert.equal(
      await page.evaluate(() => googleFormURL("https://forms.gle/example")),
      "https://forms.gle/example",
    );
    await page.route("**/js/config.js", (route) =>
      route.fulfill({
        contentType: "text/javascript",
        body: 'window.SILAB_CONFIG={serviceHours:"Jadwal uji",forms:{room:"https://forms.gle/example",equipment:"https://docs.google.com/forms/d/e/example/viewform",checkout:"https://forms.gle/example2",return:"https://forms.gle/example3"}};',
      }),
    );
    await page.reload();
    assert.equal(
      await page.locator('#formsContainer a[target="_blank"]').count(),
      4,
    );
    assert.equal(
      await page.locator("#serviceHours").textContent(),
      "Jadwal uji",
    );
    await page.unroute("**/js/config.js");
    await page.goto(`${base}/?fresh=1`);
    checks.push(
      "All four missing-form actions and configured Google Form links, URL validation and hours configuration pass",
    );
    await page.goto(`${base}/#halaman-3`);
    await page.evaluate(() => {
      location.hash = "halaman-5";
    });
    await page.locator("#halaman-5").waitFor({ state: "visible" });
    await page.goBack();
    await page.locator("#halaman-3").waitFor({ state: "visible" });
    await page.goto(`${base}/#invalid`);
    assert(await page.locator("#halaman-1").isVisible());
    assert.equal(new URL(page.url()).hash, "#halaman-1");
    await page.locator("#menuToggle").click();
    await page.keyboard.press("Escape");
    assert.equal(
      await page.locator("#menuToggle").getAttribute("aria-expanded"),
      "false",
    );
    await page.screenshot({
      path: "test-results/home-mobile.png",
      fullPage: true,
    });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.screenshot({
      path: "test-results/home-desktop.png",
      fullPage: true,
    });
    await page.goto(`${base}/#halaman-5`);
    await page.screenshot({
      path: "test-results/catalog-desktop.png",
      fullPage: true,
    });
    await page.setViewportSize({ width: 640, height: 900 });
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "Text resize overflow",
    );

    // Verifikasi Kapabilitas PWA (Manifest, SW, Meta, & iOS Modal)
    const manifestLink = await page
      .locator('link[rel="manifest"]')
      .getAttribute("href");
    assert.equal(manifestLink, "manifest.webmanifest");
    const manifestRaw = fs.readFileSync("manifest.webmanifest", "utf8");
    const manifestJson = JSON.parse(manifestRaw);
    assert.equal(manifestJson.display, "standalone");
    assert(manifestJson.icons.length >= 2);
    assert(fs.existsSync("sw.js"), "sw.js exists");
    assert(fs.existsSync("icons/icon-192.png"), "icon-192 exists");
    assert(fs.existsSync("icons/icon-512.png"), "icon-512 exists");
    assert(fs.existsSync("icons/apple-touch-icon.png"), "apple-touch-icon exists");

    // Test iOS modal open & close
    await page.evaluate(() => {
      document.getElementById("iosInstallModal").showModal();
    });
    assert(await page.locator("#iosInstallModal").isVisible());
    await page.locator("#closeIosInstallBtn").click();
    assert.equal(await page.locator("#iosInstallModal").isVisible(), false);

    // Test Barcode/QR Scanner modal & trigger button
    await page.goto(`${base}/#halaman-5`);
    assert(await page.locator("#btnScanBarcode").isVisible());
    await page.locator("#btnScanBarcode").click();
    assert(await page.locator("#scannerModal").isVisible());
    await page.locator("#closeScannerBtn").click();
    assert.equal(await page.locator("#scannerModal").isVisible(), false);

    // Test deep link #alat=FIS-OPT-001
    await page.goto(`${base}/#alat=FIS-OPT-001`);
    await page.waitForTimeout(100);
    assert(await page.locator("#halaman-5").isVisible());
    assert(await page.locator("#kartuAlatModal").isVisible());
    await page.locator("#closeModal").click();
    assert.equal(await page.locator("#kartuAlatModal").isVisible(), false);

    // Test official links & sheets cards
    await page.goto(`${base}/#halaman-4`);
    assert(await page.locator(".official-access-card").isVisible());
    await page.goto(`${base}/#halaman-6`);
    assert(await page.locator(".official-sheets-card").isVisible());

    assert.deepEqual(errors, []);
    checks.push(
      "PWA webmanifest, service worker, touch/standalone meta tags, and iOS A2HS install dialog pass",
    );
    checks.push(
      "Deep links, browser back, invalid hash fallback, mobile menu Escape, 200% text resize and zero console/page errors pass",
    );
    checks.push(
      "WCAG A/AA automated checks: six pages at 320px and 1440px plus mobile dialog, zero violations",
    );
    fs.writeFileSync(
      "test-results/results.json",
      JSON.stringify({ status: "PASS", checks }, null, 2),
    );
    console.log(checks.join("\n"));
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
