import fs from "fs";
import path from "path";
import { BasePage } from "./base.page.js";

export class CommonPage extends BasePage {
    #FOLDER_PATH = "screenshots";

    constructor(driver) {
        super(driver);
    }

    async fullScreenShot(filePath, folderPath = this.#FOLDER_PATH) {
        const pageScreen = await this.driver.takeScreenshot();

        this.#writeScreenshotToFile(pageScreen, folderPath, filePath);
    }

    async elementScreenshot(element, filePath, folderPath = this.#FOLDER_PATH) {
        const elementScreen = await this.find(element).takeScreenshot();

        this.#writeScreenshotToFile(elementScreen, folderPath, filePath);
    }

    #writeScreenshotToFile(screenshot, folderPath, filePath) {
        const screenshotPath = path.join(folderPath, filePath);

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        fs.writeFileSync(screenshotPath, screenshot, "base64");
    }
}