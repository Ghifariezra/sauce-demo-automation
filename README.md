# Homework QA Automation - SauceDemo Login

This document is prepared as a homework report for login automation on SauceDemo using the Page Object Model (POM), functional assertions in every test case, and visual regression checks.

## 1) Homework Objectives

- Build login automation for https://www.saucedemo.com/
- Implement POM for maintainable and reusable test code
- Cover positive and negative login scenarios
- Add assertions in every test case
- Add visual regression checks in every test case
- Prepare the project for GitHub/GitLab submission and LMS upload

## 2) Test Scope

Current execution scope in npm scripts is login-focused (tests/specs/login.spec.js).

### Positive Test

- Successful login with valid credentials

### Negative Tests

- Invalid username
- Wrong password
- locked_out_user

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

data/
	user.data.js
	checkout.data.js
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
		login.page.js
		inventorys/
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
	visualRegression.js

screenshots/
	baseline/
	current/
	diff/

reports/
	compatibility-report.html
```

## 5) POM Design

- Locators are centralized in tests/locators for cleaner selector management.
- Page actions are separated into tests/pages for better readability and reuse.
- Test scenarios are placed in tests/specs.
- Browser-specific compatibility entry points are in tests/compatibility.
- Runtime settings and browser/env handling are centralized in config and utilities.

Benefits:

- Reduced code duplication
- Easier maintenance when selectors change
- Clear separation between page behavior and test scenarios

## 6) Test Case Matrix and Assertions

| ID | Scenario | Test Data | Expected Result | Main Assertions |
|---|---|---|---|---|
| TC-LOGIN-001 | Login success | standard_user / secret_sauce | User is redirected to inventory page | Assert inventory URL, header/title visibility, and product list visibility |
| TC-LOGIN-002 | Invalid username | invalid_user / secret_sauce | Login fails and error is shown | Assert error message visibility and exact error text |
| TC-LOGIN-003 | Wrong password | standard_user / wrong_password | Login fails and error is shown | Assert error message visibility and user remains on login page |
| TC-LOGIN-004 | locked_out_user | locked_out_user / secret_sauce | Login fails due to locked account | Assert locked-out error message text |

Note:

- Every test case should include at least one functional assertion and one visual regression assertion.

## 7) Visual Regression Workflow

Each scenario follows this flow:

1. Capture the latest screenshot as current.
2. Check whether a baseline screenshot already exists.
3. If no baseline exists, save current as the first baseline.
4. If baseline exists, compare baseline vs current using pixelmatch.
5. Save the diff image and assert the match threshold (for example, >= 99%).

Generated artifacts:

- baseline: accepted reference image
- current: latest test run image
- diff: highlighted visual differences

## 8) How to Run

### Install Dependencies

```bash
npm install
```

### Run Test Suites

Run tests using the npm scripts from package.json:

```bash
npm run test:chrome
npm run test:firefox
npm run test:edge
```

These scripts currently execute login scenarios from tests/specs/login.spec.js.

Run cross-browser tests in parallel (HEADLESS mode enabled):

```bash
npm run test:parallel
```

Notes:

- test:chrome, test:firefox, and test:edge run tests/specs/login.spec.js in headed mode.
- Browser selection is passed from script env vars (BROWSER=chrome, firefox, MicrosoftEdge).
- test:parallel runs tests/compatibility/*.test.js with MODE=headless.
- pretest:parallel automatically removes the reports folder before the parallel run.
- Mochawesome reports are generated in the reports folder.

### First Baseline Setup

- Run the scenarios once to generate the initial baseline images.
- On the next run, the framework will compare current images against baseline images.

## 9) Homework Submission Checklist

- Login automation on SauceDemo is implemented
- Positive login test is implemented
- Negative tests for invalid username, wrong password, and locked_out_user are implemented
- Assertions are present in every test case
- Visual regression is present in every test case
- Npm scripts are aligned for login-focused execution across Chrome, Firefox, Edge, and parallel mode
- Code is pushed to GitHub/GitLab
- Repository link is submitted to Digital Skola LMS

<!-- ## 10) Suggested Commit Messages

- feat: add POM structure for login and inventory pages
- test: add positive login success scenario with assertions
- test: add negative login scenarios (invalid username, wrong password, locked_out_user)
- test: add visual regression helper and screenshot comparison
- docs: update homework README in English

## 11) Reviewer Notes

- Main evaluation points are locator stability, assertion quality, and visual baseline consistency.
- If the UI changes, baseline images should be updated to keep visual checks relevant. -->
