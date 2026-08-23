export const createSidebarLocators = (By) => Object.freeze({
    closeButton: By.css('button[id="react-burger-cross-btn"]'),
    allItems: By.css('a[data-test="inventory-sidebar-link"]'),
    about: By.css('a[data-test="about-sidebar-link"]'),
    logout: By.css('a[data-test="logout-sidebar-link"]'),
    resetAppState: By.css('a[data-test="reset-sidebar-link"]'),
});