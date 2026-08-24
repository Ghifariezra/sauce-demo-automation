import { Browser } from "selenium-webdriver";

// Argumen umum Chromium (Chrome & Edge)
const commonChromiumArgs = [
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--disable-extensions",
    "--no-sandbox",
    "--disable-smooth-scrolling",
    "--disable-background-networking",
    "--mute-audio",
    "--log-level=3",
];
const commonChromiumPrefs = {
    'profile.password_manager_leak_detection': false, // Disables data breach popup
    'credentials_enable_service': false,             // Disables save password prompts
    'profile.password_manager_enabled': false         // Shuts off password manager entirely
}

// Preferensi umum Firefox
const commonFirefoxPrefs = {
    "browser.cache.disk.enable": false,
    "browser.cache.memory.enable": false,
    "browser.cache.offline.enable": false,
    "network.http.use-cache": false,
    "toolkit.telemetry.reportingpolicy.firstRun": false,
    "toolkit.telemetry.enabled": false,
    "toolkit.telemetry.unified": false,
    "datareporting.healthreport.uploadEnabled": false,
    "datareporting.policy.dataSubmissionEnabled": false,
    "app.update.auto": false,
    "app.update.enabled": false,
    "dom.ipc.processCount": 1
};

const BROWSERS = Object.freeze({
    [Browser.CHROME]: {
        args: commonChromiumArgs,
        preferences: commonChromiumPrefs
    },
    [Browser.EDGE]: {
        args: commonChromiumArgs,
        preferences: commonChromiumPrefs
    },
    [Browser.FIREFOX]: {
        preferences: commonFirefoxPrefs
    }
});

export const BROWSER_CONFIG = Object.freeze({
    headless: {
        isHeadless: true,
        ...BROWSERS
    },
    headed: {
        isHeadless: false,
        ...BROWSERS
    }
});