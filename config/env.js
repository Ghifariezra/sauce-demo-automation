import { UserData, CheckoutData } from "../data/index.js";
const BASE_URL = new URL("https://www.saucedemo.com/");

export const ENV = Object.freeze({
    title: "Swag Labs",

    // URLs
    baseUrl: BASE_URL.href,
    inventoryUrl: new URL("inventory.html", BASE_URL).href,
    cartUrl: new URL("cart.html", BASE_URL).href,
    inventoryDetailUrl: (productId) => new URL(`inventory-item.html?id=${productId}`, BASE_URL).href,

    // Data
    user: UserData,
    checkout: CheckoutData
});