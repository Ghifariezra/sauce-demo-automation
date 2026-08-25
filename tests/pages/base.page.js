import { Key, until } from "selenium-webdriver";

export class BasePage {
    #TIMEOUT = 5000;

    constructor(driver) {
        this.driver = driver;
    }

    async open(url, title, timeout = this.#TIMEOUT) {
        await this.driver.get(url);
        await this.waitForPageLoad(timeout);
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

    async waitForPageLoad(timeout = this.#TIMEOUT) {
        await this.driver.wait(async () => {
            const readyState = await this.driver.executeScript("return document.readyState");
            return readyState === "complete";
        }, timeout, "Page load timed out waiting for readyState complete");
    }

    async waitUntilAllChildElementsLoaded(parentLocator, childCssSelector = '*', timeout = this.#TIMEOUT) {
        await this.waitForPageLoad(timeout);

        const parentElement = await this.find(parentLocator, timeout);
        const children = await parentElement.findElements(childCssSelector);

        for (const child of children) {
            try {
                const isDisplayed = await child.isDisplayed();
                if (isDisplayed) {
                    await this.driver.wait(until.elementIsVisible(child), timeout);
                }
            } catch (error) {
                // Ignore errors for elements that are not displayed or not found
            }
        }

        return children;
    }

    async waitForImagesLoaded(timeout = this.#TIMEOUT) {
        await this.driver.wait(async () => {
            return await this.driver.executeScript(`
            const images = Array.from(document.querySelectorAll('img'));
            return images.every(img => img.complete && img.naturalWidth !== 0);
        `);
        }, timeout, "Timed out waiting for all images to completely load.");
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