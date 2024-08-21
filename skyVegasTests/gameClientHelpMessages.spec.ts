import { test, expect, type Page } from "@playwright/test";
import { launchGame, validateConsoleMessages, login } from "./utilities";
import * as fs from "fs";
import { startEventListener } from "./utilities/starteventListenerHelper";

test.describe.configure({ mode: "serial" });
const consoleMessages: string[] = [];
let jsonObject;
let page: Page;
const games = JSON.parse(fs.readFileSync("games.json", "utf-8"));
games.forEach((game) => {
  test.describe(`Testing with text: ${game}`, () => {
    test.beforeAll(async ({ browser }) => {
      const data = fs.readFileSync("ExpectedSlotConsoleMessages.json", "utf-8");
      jsonObject = JSON.parse(data);
      page = await browser.newPage();
      await login(page);
    });

    test.afterAll(async () => {
      await page.close();
    });
    // Iterate over the array and create a test for each value

    test("Test game menu open", async () => {
      startEventListener(page, consoleMessages);
      await launchGame(page, game, consoleMessages);
      await expect(
        page
          .frameLocator("#root iframe")
          .getByText("MenuOpen the menu to access")
      ).toBeAttached();
      await page
        .frameLocator("#root iframe")
        .getByText("MenuOpen the menu to access")
        .click();
      await validateConsoleMessages(
        jsonObject.gameHelpMenuOpen,
        consoleMessages
      );
    });

    test("Test help menu open", async () => {
      await page
        .frameLocator("#root iframe")
        .getByRole("link", { name: "Game Help" })
        .waitFor();
      await page
        .frameLocator("#root iframe")
        .getByRole("link", { name: "Game Help" })
        .click();
      await validateConsoleMessages(
        jsonObject.gameHelpMessage,
        consoleMessages
      );
    });

    test("Test game menu closed", async () => {
      await page
        .frameLocator("#root iframe")
        .getByText("MenuOpen the menu to access")
        .click();

      await validateConsoleMessages(
        jsonObject.gameHelpMenuClose,
        consoleMessages
      );
    });

    test("Test paytable open", async () => {
      await page
        .frameLocator("#root iframe")
        .getByRole("link", { name: "Game Help" })
        .waitFor();
      await page
        .frameLocator("#root iframe")
        .getByRole("link", { name: "Paytable" })
        .click();
      await validateConsoleMessages(
        jsonObject.payTableMessage,
        consoleMessages
      );
    });
  });
});
