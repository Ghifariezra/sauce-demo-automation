import { Browser } from "selenium-webdriver";
process.env.BROWSER = Browser.FIREFOX;
await import("../specs/Login.spec.js");