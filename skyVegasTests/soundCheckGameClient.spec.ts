import { test, type Page } from "@playwright/test";
import {
  launchGame,
  validateConsoleMessages,
  login,
  startEventListener,
  messageExists,
} from "./utilities";
import * as fs from "fs";

const consoleMessages: string[] = [];
let expectedMessages;
let page: Page;
const games = JSON.parse(fs.readFileSync("games.json", "utf-8"));
games.forEach((game) => {
  test.describe(`Testing with text: ${game}`, () => {
    test.beforeAll(async ({ browser }) => {
      const data = fs.readFileSync("ExpectedSlotConsoleMessages.json", "utf-8");
      expectedMessages = JSON.parse(data);
      page = await browser.newPage();
      await login(page);
    });

    test.afterAll(async () => {
      await page.close();
    });

    test("Test sound toggle", async () => {
      const soundToggleIcon = page
        .frameLocator("#root iframe")
        .locator("i")
        .nth(2);
      startEventListener(page, consoleMessages);
      await launchGame(page, game, consoleMessages);
      await soundToggleIcon.click();
      await soundToggleIcon.click();
      await validateConsoleMessages(
        expectedMessages.soundCheckMessageGameOn,
        consoleMessages
      );
      await soundToggleIcon.click();
      await validateConsoleMessages(
        expectedMessages.soundCheckMessageGameOff,
        consoleMessages
      );
    });
  });
});
