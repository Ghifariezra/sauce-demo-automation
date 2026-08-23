export const createInventoryDetailLocators = (By) => Object.freeze({
    backButton: By.css('button[data-test="back-to-products"]'),
    productDetail: {
        productImage: (productItem) => By.css(`img[data-test="inventory-item-${productItem}-img"]`),
        productName: By.css('div[data-test="inventory-item-name"]'),
        productDescription: By.css('div[data-test="inventory-item-desc"]'),
        productPrice: By.css('div[data-test="inventory-item-price"]'),
        addToCartButton: By.css('button[data-test="add-to-cart"]'),
        removeCartButton: By.css('button[data-test="remove"]'),
    }
});