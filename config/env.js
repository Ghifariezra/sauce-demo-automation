const EPIC_SAD_FACE = "Epic sadface:";
const BASE_URL = new URL("https://www.saucedemo.com/");

const urls = Object.freeze({
    baseUrl: BASE_URL.href,
    inventoryUrl: new URL("inventory.html", BASE_URL).href,
    cartUrl: new URL("cart.html", BASE_URL).href,
    inventoryDetailUrl: (productId) => new URL(`inventory-item.html?id=${productId}`, BASE_URL).href,
});
const userData = Object.freeze({
    users: {
        standard: "standard_user",
        locked: "locked_out_user",
        problem: "problem_user",
        performance: "performance_glitch_user",
        error: "error_user",
        visual: "visual_user"
    },
    password: "secret_sauce",
    expectedMessages: {
        usernameRequired: `${EPIC_SAD_FACE} Username is required`,
        passwordRequired: `${EPIC_SAD_FACE} Password is required`,
        invalidCredentials: `${EPIC_SAD_FACE} Username and password do not match any user in this service`,
        lockedOut: `${EPIC_SAD_FACE} Sorry, this user has been locked out.`,
    }
});
const checkoutData = Object.freeze({
    firstName: "John",
    lastName: "Doe",
    postalCode: "12345"
});

export const ENV = Object.freeze({
    title: "Swag Labs",

    // URLs
    urls: urls,

    // Data
    user: userData,
    checkout: checkoutData
});