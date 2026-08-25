import { describe, it, afterEach, beforeEach } from "mocha";
import assert from "assert";
import { ENV } from "../../config/index.js";
import { CommonPage } from "../pages/commonPage.js";
import { LoginPage, InventoryPage } from "../pages/index.js";
import { buildDriver, VisualRegressionHelper } from "../../utilities/index.js";

const title = "Sauce Demo";
const titleLogin = "Login";

const mode = process.env.MODE;
const browserName = process.env.BROWSER;

describe(`[${mode.toUpperCase()} - ${browserName.toUpperCase()}] - [${title}] - ${titleLogin} Page`, () => {
    let driver;
    let commonPage;
    let loginPage;
    let inventoryPage;
    let visualRegressionHelper;

    // Data
    const users = ENV.user.users;
    const password = ENV.user.password;
    const expectedMessages = ENV.user.expectedMessages;
    const { standard, locked } = users;
    const { usernameRequired, passwordRequired, invalidCredentials, lockedOut } = expectedMessages;
    const negativeTestCases = [
        { name: "locked out user", user: locked, pass: password, expected: lockedOut },
        { name: "empty username and password", user: "", pass: "", expected: usernameRequired },
        { name: "empty username", user: "", pass: password, expected: usernameRequired },
        { name: "empty password", user: standard, pass: "", expected: passwordRequired },
        { name: "invalid credentials", user: "invalid", pass: "invalid", expected: invalidCredentials }
    ];

    beforeEach(async () => {
        driver = await buildDriver(browserName, mode);

        if (mode === "headed") await driver.manage().window().maximize();

        commonPage = new CommonPage(driver, browserName);
        visualRegressionHelper = new VisualRegressionHelper(browserName);
        loginPage = new LoginPage(driver);
        inventoryPage = new InventoryPage(driver);

        await loginPage.openBrowser(ENV.urls.baseUrl, ENV.title);

        const currentTitle = await loginPage.getTitleBrowser();
        assert.strictEqual(currentTitle, ENV.title, `Expected title to be "${ENV.title}" but got "${currentTitle}"`);
    });

    afterEach(async function () {
        if (!this.currentTest) return;

        // const { state, err, title } = this.currentTest;

        // if (state === "failed" && err) {
        //     console.error(`Test "${title}" failed with error: ${err.message}`);
        // } else if (state === "passed") {
        //     const fileName = generateScreenshotName(
        //         browserName,
        //         mode,
        //         title
        //     );
        //     await commonPage.fullScreenShot(fileName, browserName);
        // }

        if (loginPage) {
            await loginPage.quitBrowser(mode === "headed" ? 1000 : 0);
        }
    });

    // Regression Tests - Happy Flows
    for (const [userType, username] of Object.entries(users)) {
        if (userType === "locked") continue;

        it(`[Regression][${title}] - Should login successfully with "${username}"`, async () => {
            await loginPage.login(username, password);

            const currentUrl = await loginPage.getCurrentUrl(ENV.urls.inventoryUrl);
            assert.strictEqual(currentUrl, ENV.urls.inventoryUrl, `Expected "${ENV.urls.inventoryUrl}" but got "${currentUrl}"`);
        })
    }

    // Regression Tests - Negative Flows
    negativeTestCases.forEach(({ name, user, pass, expected }) => {
        it(`[Regression][${title}] - Should display error message for ${name}`, async () => {
            await loginPage.login(user, pass);
            const errorMessage = await loginPage.getErrorMessage();
            assert.strictEqual(errorMessage, expected, `Expected "${expected}" but got "${errorMessage}"`);
        });
    });

    // Smoke Tests
    for (const [userType, username] of Object.entries(users)) {
        if (userType === "locked") continue;

        it(`[Smoke][${title}] - Should login and logout successfully with "${username}"`, async () => {
            await loginPage.login(username, password);

            const currentUrl = await loginPage.getCurrentUrl(ENV.urls.inventoryUrl);
            assert.strictEqual(currentUrl, ENV.urls.inventoryUrl, `Expected "${ENV.urls.inventoryUrl}" but got "${currentUrl}"`);

            const logoutButtonText = await loginPage.getLogoutButtonText();
            assert.strictEqual(logoutButtonText, "Logout", `Expected "Logout" but got "${logoutButtonText}"`);

            await loginPage.logout();
        });
    }

    // Visual Regression Tests
    for (const [userType, username] of Object.entries(users)) {
        if (userType === "locked") continue;

        it(`[Visual Regression][${title}] - Should login with "${username}" and pass visual snapshot check`, async () => {
            await loginPage.login(username, password);

            const currentUrl = await loginPage.getCurrentUrl(ENV.urls.inventoryUrl);
            assert.strictEqual(currentUrl, ENV.urls.inventoryUrl, `Expected "${ENV.urls.inventoryUrl}" but got "${currentUrl}"`);

            // By default wait until 5 seconds for all child elements to be loaded and visible
            await inventoryPage.waitAllElementsVisible();

            const fileName = `Login_Success_${userType}.png`;
            const sourcePath = await commonPage.fullScreenShot(fileName);

            visualRegressionHelper.saveCurrentScreenshot(sourcePath, fileName);
            const comparisonResult = await visualRegressionHelper.compareImages(fileName);

            if (!comparisonResult.hasBaseline) {
                visualRegressionHelper.saveAsBaseline(fileName);

                assert.fail(`No baseline found for ${fileName}. Baseline has been created. Please review the baseline image.`);
            } else {
                assert.strictEqual(
                    comparisonResult.match,
                    true,
                    `Visual Regression Mismatch for ${fileName}: ${comparisonResult.message}`
                )
            }
        })
    }
});