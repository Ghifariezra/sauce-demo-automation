export const createLoginLocators = (By) => Object.freeze({
    loginLogo: {
        logo: By.css('.login_logo'),
    },
    loginBox: {
        box: By.css('.login-box'),
        usernameInput: By.css('input[data-test="username"]'),
        passwordInput: By.css('input[data-test="password"]'),
        loginButton: By.css('input[data-test="login-button"]'),
    },
    loginCredentials: {
        users: By.css('div[data-test="login-credentials"]'),
        password: By.css('div[data-test="login-password"]'),
    }
});