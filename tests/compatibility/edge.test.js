import { Browser } from "selenium-webdriver";
process.env.BROWSER = Browser.EDGE;
await import("../specs/Login.spec.js");