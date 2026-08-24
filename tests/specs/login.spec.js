import { describe, before, after, it, afterEach, beforeEach } from "mocha";
import assert from "assert";
import { ENV } from "../../config/index.js";
import { CommonPage } from "../pages/commonPage.js";
import { LoginPage } from "../pages/login.page.js";
import { buildDriver } from "../../utilities/buildDriver.js";

const title = "Sauce Demo";
const titleLogin = "Login";

const mode = process.env.MODE;
const browserName = process.env.BROWSER;

describe(`[${mode.toUpperCase()} - ${browserName.toUpperCase()}] - [${title}] - ${titleLogin} Page`, () => {
    let driver;
    let commonPage;
    let loginPage;

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

        commonPage = new CommonPage(driver);
        loginPage = new LoginPage(driver);

        await loginPage.openBrowser(ENV.baseUrl, ENV.title);

        const currentTitle = await loginPage.getTitleBrowser();
        assert.strictEqual(currentTitle, ENV.title, `Expected title to be "${ENV.title}" but got "${currentTitle}"`);
    });

    afterEach(async function () {
        if (!this.currentTest) return;

        // const { state, err, title } = this.currentTest;

        // const testState = state ? state.toUpperCase() : "PASSED";

        // if (err) {
        //     console.error(`Error: ${err.message}`);
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

            const currentUrl = await loginPage.getCurrentUrl(ENV.inventoryUrl);
            assert.strictEqual(currentUrl, ENV.inventoryUrl, `Expected "${ENV.inventoryUrl}" but got "${currentUrl}"`);

            const logoutButtonText = await loginPage.getLogoutButtonText();
            assert.strictEqual(logoutButtonText, "Logout", `Expected "Logout" but got "${logoutButtonText}"`);

            await loginPage.logout();
        });
    }

    // TODO: Visual Regression Tests
});