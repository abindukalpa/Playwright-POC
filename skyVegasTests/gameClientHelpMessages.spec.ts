import { test, expect, type Page } from "@playwright/test";
import { launchGame, validateConsoleMessages, login } from "./utilities";
import * as fs from "fs";

test.describe.configure({ mode: "serial" });
const consoleMessages: string[] = [];
let jsonObject;
let page: Page;

test.beforeAll(async ({ browser }) => {
  const data = fs.readFileSync("ExpectedSlotConsoleMessages.json", "utf-8");
  jsonObject = JSON.parse(data);
  page = await browser.newPage();
  await login(page);
});

test.afterAll(async () => {
  await page.close();
});

test("Test game menu open", async ({}) => {
  await launchGame(page, "Big Bass Splash");
  page.on("console", (msg) => {
    consoleMessages.push(msg.text());
  });
  await expect(
    page.frameLocator("#root iframe").getByText("MenuOpen the menu to access")
  ).toBeAttached();
  await page
    .frameLocator("#root iframe")
    .getByText("MenuOpen the menu to access")
    .click();
  validateConsoleMessages(page, jsonObject.gameHelpMenuOpen, consoleMessages);
});

test("Test help menu open", async ({}) => {
  await page
    .frameLocator("#root iframe")
    .getByRole("link", { name: "Game Help" })
    .waitFor();
  await page
    .frameLocator("#root iframe")
    .getByRole("link", { name: "Game Help" })
    .click();
  validateConsoleMessages(page, jsonObject.gameHelpMessage, consoleMessages);
});

test("Test game menu closed", async ({}) => {
  await page
    .frameLocator("#root iframe")
    .getByText("MenuOpen the menu to access")
    .click();

  validateConsoleMessages(page, jsonObject.gameHelpMenuClose, consoleMessages);
});

test("Test paytable open", async ({}) => {
  await page
    .frameLocator("#root iframe")
    .getByRole("link", { name: "Game Help" })
    .waitFor();
  await page
    .frameLocator("#root iframe")
    .getByRole("link", { name: "Paytable" })
    .click();
  validateConsoleMessages(page, jsonObject.payTableMessage, consoleMessages);
});
