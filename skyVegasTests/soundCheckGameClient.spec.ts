import { test, type Page } from "@playwright/test";
import { launchGame, validateConsoleMessages, login } from "./utilities";
import * as fs from "fs";
import { messageExists } from "./utilities/validateConsoleMessagesHelper";
import { startEventListener } from "./utilities/starteventListenerHelper";

test.describe.configure({ mode: "serial" });
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
      const soundToggleGameWindow = page.frameLocator("#root iframe").locator("i").nth(2)
      startEventListener(page, consoleMessages);
      await launchGame(page, game, consoleMessages);
      if (messageExists(consoleMessages, expectedMessages.soundCheckMessageToolBarOn)) {
        await soundToggleGameWindow.click();
        await validateConsoleMessages(
          expectedMessages.soundCheckMessageToolBarOff,
          consoleMessages
        );
      } else if (messageExists(consoleMessages, expectedMessages.soundCheckMessageToolBarOff)) {
        await soundToggleGameWindow.click();
        await validateConsoleMessages(
          expectedMessages.soundCheckMessageToolBarOn,
          consoleMessages
        );
      }
    });
  });
});
