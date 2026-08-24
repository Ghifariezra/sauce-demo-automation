import { Builder } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome.js";
import * as firefox from "selenium-webdriver/firefox.js";
import * as edge from "selenium-webdriver/edge.js";
import { BROWSER_CONFIG } from "../config/index.js";

export async function buildDriver(browserName, mode) {
    const browserConfig = BROWSER_CONFIG[mode];
    const [CHROME, EDGE, FIREFOX] = Object.keys(browserConfig).filter(key => key !== "isHeadless" && key !== "isMaximized");

    const builder = new Builder().forBrowser(browserName);

    let options;
    if (browserName === CHROME) options = new chrome.Options();
    else if (browserName === EDGE) options = new edge.Options();
    else if (browserName === FIREFOX) options = new firefox.Options();

    if (browserConfig.isHeadless) {
        if (options instanceof firefox.Options) {
            options.addArguments("-headless");
        } else {
            options.addArguments("--headless=new");
        }
    }

    if (options instanceof chrome.Options) {
        options.setUserPreferences(browserConfig[browserName].preferences);
        options.addArguments(...browserConfig[browserName].args);
        builder.setChromeOptions(options);
    } else if (options instanceof edge.Options) {
        options.setUserPreferences(browserConfig[browserName].preferences);
        options.addArguments(...browserConfig[browserName].args);
        builder.setEdgeOptions(options);
    } else if (options instanceof firefox.Options) {
        Object.entries(browserConfig[browserName].preferences).forEach(([key, value]) => {
            options.setPreference(key, value);
        });

        builder.setFirefoxOptions(options);
    }

    return builder.build();
}