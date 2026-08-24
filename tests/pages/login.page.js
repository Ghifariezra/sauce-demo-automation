import { BasePage } from "./base.page.js";
import { SauceDemoLocators } from "../locators/index.js";

export class LoginPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.locators = SauceDemoLocators.login;
    }
    
    async getCurrentUrl(expectedUrl) {
        if (expectedUrl) {
            await this.waitForUrl(expectedUrl);
        }
        return await super.getCurrentUrl();
    }

    async openBrowser(url, title) {
        await this.open(url, title);
    }

    async quitBrowser(delay = 1000) {
        await this.quit(delay);
    }

    async getTitleBrowser() {
        return await this.getTitle();
    }

    async getErrorMessage() {
        return await this.getText(SauceDemoLocators.errorMessage);
    }

    async clickErrorButton() {
        await this.click(SauceDemoLocators.errorButton);
    }

    async login(username, password) {
        await this.inputText(this.locators.loginBox.usernameInput, username);
        await this.inputText(this.locators.loginBox.passwordInput, password);
        await this.click(this.locators.loginBox.loginButton);
    }

    async clearInput() {
        await this.clearInput(this.locators.loginBox.usernameInput);
        await this.clearInput(this.locators.loginBox.passwordInput);
    }

    async getLogoutButtonText() {
        await this.click(SauceDemoLocators.header.menuButton);
        return await this.getText(SauceDemoLocators.sidebar.logout);
    }

    async logout() {
        await this.click(SauceDemoLocators.sidebar.logout);
    }

    async getCredentialsText() {
        const usersText = await this.getText(this.locators.loginCredentials.users);
        const passwordText = await this.getText(this.locators.loginCredentials.password);

        return { usersText, passwordText };
    }
}