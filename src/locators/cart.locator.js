export const createCartLocators = (By) => Object.freeze({
    cartList: {
        quantityLabel: By.css('div[data-test="cart-quantity-label"]'),
        descriptionLabel: By.css('div[data-test="cart-desc-label"]'),
        cartItem: By.css('div[class="cart_item_label"]'),
        productName: By.css('div[data-test="inventory-item-name"]'),
        productDescription: By.css('div[data-test="inventory-item-desc"]'),
        productPrice: By.css('div[data-test="inventory-item-price"]'),
        removeCartButton: (productItem) => By.css(`button[data-test="remove-${productItem}"]`),
    },
    cartFooter: {
        continueShoppingButton: By.css('button[data-test="continue-shopping"]'),
        checkoutButton: By.css('button[data-test="checkout"]'),
    }
});