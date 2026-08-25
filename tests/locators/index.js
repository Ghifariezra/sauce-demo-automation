import { By } from "selenium-webdriver";
import { createLoginLocators } from "./login.locator.js";
import { createSidebarLocators } from "./sidebar.locator.js";
import { createInventoryLocators } from "./inventory-locators/inventory.locator.js";
import { createInventoryDetailLocators } from "./inventory-locators/inventoryDetail.locator.js";
import { createCartLocators } from "./cart.locator.js";

export const SauceDemoLocators = Object.freeze({
    login: createLoginLocators(By),
    sidebar: createSidebarLocators(By),
    inventory: createInventoryLocators(By),
    inventoryDetail: createInventoryDetailLocators(By),
    cart: createCartLocators(By),

    allChildElements: By.css('*'),

    // Header & Navigation global
    header: {
        logo: By.css('.app_logo'),
        shoppingCart: By.css('a[data-test="shopping-cart-link"]'),
        menuButton: By.css('#react-burger-menu-btn'),
        title: By.css('span[data-test="title"]'),
        filterDropdown: By.css('select[data-test="product-sort-container"]'),
    },

    errorMessage: By.css('h3[data-test="error"]'),
    errorButton: By.css('button[data-test="error-button"]'),
});