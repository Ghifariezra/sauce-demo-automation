import { BasePage } from "../base.page.js";
import { SauceDemoLocators } from "../../locators/index.js";

export class InventoryPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.locators = SauceDemoLocators.inventory;
    }

    async waitAllElementsVisible(timeout) {
        await this.find(this.locators.pageWrapper, timeout);
        await this.waitUntilAllChildElementsLoaded(
            this.locators.inventoryItem, 
            SauceDemoLocators.allChildElements,
            timeout
        );
        await this.waitForImagesLoaded(timeout);
    }
}