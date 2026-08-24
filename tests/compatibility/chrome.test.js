import { Browser } from "selenium-webdriver";
process.env.BROWSER = Browser.CHROME;
await import("../specs/Login.spec.js");