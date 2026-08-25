# SauceDemo E2E Automation

End-to-end test automation for https://www.saucedemo.com/, built with Selenium WebDriver and the Page Object Model (POM). The suite covers login flows with functional assertions and visual regression checks, runs across Chrome, Firefox, and Edge, and is set up to grow into inventory and cart coverage next.

## 1) Project Goals

- Automate login (and, going forward, inventory/cart) flows on SauceDemo
- Keep the codebase maintainable with a clean POM structure (locators / pages / specs)
- Cover both positive and negative scenarios with explicit functional assertions
- Catch unintended UI changes with visual regression snapshots on every login scenario
- Run consistently across Chrome, Firefox, and Edge, headed and headless

## 2) Current Test Scope

Active coverage lives in `tests/specs/login.spec.js` and is exercised per-browser through `tests/compatibility/*.test.js`.

### Regression

- Successful login for every non-locked user (`standard`, `problem`, `performance`, `error`, `visual`), asserting redirect to the inventory URL
- Locked-out user shows the correct error message
- Empty username, empty password, empty username+password all show the correct error message
- Invalid credentials show the correct error message

### Smoke

- Login and logout for every non-locked user, asserting the inventory URL and the "Logout" button text

### Visual Regression

- Login for every non-locked user, wait for the inventory page (wrapper, all child elements, and images) to finish rendering, then compare a full-page screenshot against the stored baseline for that browser

### Planned next

- `tests/specs/inventory/inventory.spec.js` and `inventoryDetail.spec.js` — inventory listing and detail page flows
- `tests/specs/cart.spec.js` — cart flow
- Corresponding locators already scaffolded in `tests/locators/inventory-locators/` and `tests/locators/cart.locator.js`; page objects scaffolded in `tests/pages/inventory/`

## 3) Tech Stack

- Language: JavaScript (ESM)
- Automation: Selenium WebDriver
- Test Runner: Mocha
- Reporter: Mochawesome
- Visual Regression: canvas + pixelmatch
- Browser Compatibility: Chrome, Firefox, Edge

## 4) Project Structure

```text
config/
    browser.js
    env.js
    index.js

tests/
    compatibility/
        chrome.test.js
        firefox.test.js
        edge.test.js
    locators/
        index.js
        login.locator.js
        sidebar.locator.js
        cart.locator.js
        inventory-locators/
            inventory.locator.js
            inventoryDetail.locator.js
    pages/
        base.page.js
        commonPage.js
        index.js
        login.page.js
        inventory/
            inventory.page.js
            inventoryDetail.page.js
    specs/
        login.spec.js
        cart.spec.js
        inventory/
            inventory.spec.js
            inventoryDetail.spec.js

utilities/
    buildDriver.js
    index.js
    visualRegression.js

screenshots/
    chrome/
    firefox/
    MicrosoftEdge/

snapshots/
    visual-baseline/
        chrome/
        firefox/
        MicrosoftEdge/
    visual-current/
        chrome/
        firefox/
        MicrosoftEdge/
    visual-diff/
        chrome/
        firefox/
        MicrosoftEdge/

reports/
    compatibility-report.html
```

`data/` (previously `user.data.js`, `checkout.data.js`, `data/index.js`) has been folded directly into `config/env.js` — user credentials, expected error messages, and checkout data now live under `ENV.user` and `ENV.checkout`, with all URLs grouped under `ENV.urls` (`ENV.urls.baseUrl`, `ENV.urls.inventoryUrl`, `ENV.urls.cartUrl`, `ENV.urls.inventoryDetailUrl(productId)`). One less file to keep in sync, one source of truth for runtime config.

## 5) POM Design

- Locators are centralized in `tests/locators` for cleaner selector management.
- Page actions live in `tests/pages`, each page object extending a shared `BasePage`.
- Test scenarios live in `tests/specs`.
- Browser-specific compatibility entry points live in `tests/compatibility`.
- Runtime settings, URLs, and test data are centralized in `config/env.js`.
- `tests/pages/index.js` and `utilities/index.js` are barrel files — pages and utilities are imported from one place (`import { LoginPage, InventoryPage } from "../pages/index.js"`) instead of deep-linking individual files.

### BasePage helpers

`BasePage` now handles page-readiness beyond simple element waits:

- `waitForPageLoad(timeout)` — waits for `document.readyState === "complete"`; called automatically inside `open()` before checking the title.
- `waitUntilAllChildElementsLoaded(parentLocator, childCssSelector, timeout)` — waits for every visible child under a parent element to become visible; used before taking a screenshot so partially-rendered UI doesn't produce a false visual diff.
- `waitForImagesLoaded(timeout)` — waits for every `<img>` on the page to finish loading (`complete && naturalWidth !== 0`).

`InventoryPage.waitAllElementsVisible()` chains these three checks against the inventory page wrapper before a screenshot is taken.

### CommonPage

`CommonPage` now takes a `browserName` in its constructor and writes screenshots into `screenshots/<browserName>/`, returning the saved file path so callers (like the visual regression check) don't have to reconstruct it.

## 6) Visual Regression Workflow

Each visual regression scenario follows this flow:

1. Log in and wait for the inventory page to fully render (wrapper → child elements → images).
2. Capture a full-page screenshot via `CommonPage.fullScreenShot()`, saved to `screenshots/<browser>/`.
3. Feed that screenshot to `VisualRegressionHelper` (constructed per-browser) as the "current" image.
4. If no baseline exists yet for that browser, save the current screenshot as the baseline and fail the test on purpose so the new baseline gets reviewed.
5. If a baseline exists, compare it against the current screenshot with pixelmatch, save the diff image, and assert the match percentage is **>= 95%**.

Generated artifacts, organized per browser:

- `screenshots/<browser>/` — raw screenshots captured during the run
- `snapshots/visual-baseline/<browser>/` — accepted reference images
- `snapshots/visual-current/<browser>/` — latest run images
- `snapshots/visual-diff/<browser>/` — highlighted visual differences

## 7) How to Run

### Install Dependencies

```bash
npm install
```

### Run Test Suites

```bash
npm run test:chrome
npm run test:firefox
npm run test:edge
```

These scripts run `tests/specs/login.spec.js` in headed mode for the given browser (`BROWSER=chrome|firefox|MicrosoftEdge`), covering Regression, Smoke, and Visual Regression together.

Run all three browsers in parallel, headless:

```bash
npm run test:parallel
```

Notes:

- `test:parallel` runs `tests/compatibility/*.test.js` with `MODE=headless`.
- `pretest:parallel` clears the `reports` folder before each parallel run.
- Mochawesome HTML reports land in `reports/`.

### First Baseline Run

The first time a browser runs the Visual Regression suite, there's no baseline yet — the test saves the current screenshot as the baseline and fails intentionally so it gets reviewed. Re-run after reviewing to confirm it now passes against that baseline.

## 8) Current Status

**Done**

- Login POM (locators, page object, spec) for Regression, Smoke, and Visual Regression
- Cross-browser runs (Chrome, Firefox, Edge), headed and headless
- Per-browser visual regression pipeline with baseline/current/diff snapshots and a 95% match threshold
- Config consolidated into `config/env.js`; barrel exports for pages and utilities

**In progress / next up**

- Inventory spec (`inventory.spec.js`, `inventoryDetail.spec.js`) — locators and page objects already scaffolded, specs not yet written
- Cart spec (`cart.spec.js`) — locator scaffolded, spec not yet written
- Extend `waitAllElementsVisible`-style readiness checks to the inventory/cart pages once those specs exist

## 9) Development Notes

- Keep locators centralized — if SauceDemo markup changes, the fix should only touch `tests/locators`.
- When the UI legitimately changes, delete the stale image under `snapshots/visual-baseline/<browser>/` and re-run so the suite regenerates it, rather than editing the PNG by hand.
- The 95% match threshold is intentionally tolerant of minor rendering noise (font anti-aliasing, animation timing) across headless runs; tighten it if flakiness proves to be a bigger risk than false negatives.
- Every new spec should follow the existing pattern: assertion(s) tied to the scenario, plus a Visual Regression case where a rendered page is involved.