import { Key, until } from "selenium-webdriver";

export class BasePage {
    #TIMEOUT = 5000;

    constructor(driver) {
        this.driver = driver;
    }

    async open(url, title, timeout = this.#TIMEOUT) {
        await this.driver.get(url);
        await this.driver.wait(until.titleIs(title), timeout);
    }

    async quit(delay = 0) {
        if (this.driver) {
            if (delay > 0) {
                await this.driver.sleep(delay);
            }
            await this.driver.quit();
        }
    }

    async getTitle() {
        return await this.driver.getTitle();
    }

    async getCurrentUrl() {
        return await this.driver.getCurrentUrl();
    }

    async waitForUrl(expectedUrl, timeout = this.#TIMEOUT) {
        await this.driver.wait(
            until.urlIs(expectedUrl),
            timeout,
            `Expected URL to be ${expectedUrl}, but it was not.`
        );
    }

    async getText(locator, timeout = this.#TIMEOUT) {
        const element = await this.find(locator, timeout);
        return await element.getText();
    }

    async clearInput(locator, timeout = this.#TIMEOUT) {
        const element = await this.find(locator, timeout);
        const modifierKey = this.#modifierKey();

        await this.driver.actions()
            .click(element)
            .keyDown(modifierKey)
            .sendKeys("a")
            .keyUp(modifierKey)
            .sendKeys(Key.BACK_SPACE)
            .perform();
    }

    async inputText(locator, text, timeout = this.#TIMEOUT) {
        // await this.clearInput(locator, timeout);
        const element = await this.find(locator, timeout);
        await element.sendKeys(text);
    }

    async click(locator, timeout = this.#TIMEOUT) {
        const element = await this.find(locator, timeout);
        await element.click();
    }

    async find(locator, timeout = this.#TIMEOUT) {
        await this.driver.wait(until.elementLocated(locator), timeout);
        const element = await this.driver.findElement(locator);

        await this.driver.wait(until.elementIsVisible(element), timeout);
        return element;
    }

    #modifierKey() {
        return process.platform === "darwin" ? Key.COMMAND : Key.CONTROL;
    }
}