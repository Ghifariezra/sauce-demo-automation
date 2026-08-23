export const createInventoryLocators = (By) => Object.freeze({
    inventoryList: By.css('div[data-test="inventory-list"]'),
    inventoryItem: By.css('div[data-test="inventory-item"]'),
    productName: By.css('div[data-test="inventory-item-name"]'),
    productDescription: By.css('div[data-test="inventory-item-desc"]'),
    productPrice: By.css('div[data-test="inventory-item-price"]'),

    // Dynamic Locators
    addToCartButtonItem: (productItem) => By.css(`button[data-test="add-to-cart-${productItem}"]`),
    removeCartButtonItem: (productItem) => By.css(`button[data-test="remove-${productItem}"]`),
});