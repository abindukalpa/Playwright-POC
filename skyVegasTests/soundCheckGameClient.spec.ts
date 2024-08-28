import { test, type Page, expect } from "@playwright/test";
import {
  launchGame,
  validateConsoleMessages,
  login,
  startEventListener,
  messageExists,
  readGames,
} from "./utilities";
import { ExpectedMessage } from "../types/expectedMessage";

readGames().forEach((game) => {
  const consoleMessages: string[] = [];
  let page: Page;
  let classAttribute: string;
  test.describe(`Testing with text: ${game}`, () => {
    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await login(page);
    });

    test.afterAll(async () => {
      await page.close();
    });

    test("Test sound toggle", async () => {
      startEventListener(page, consoleMessages);
      await launchGame(page, game, consoleMessages);
      const soundToggleIcon = page
        .frameLocator("#root iframe")
        .locator("i")
        .nth(2);

      classAttribute = (await soundToggleIcon.getAttribute("class")) as string;
      if (classAttribute == "icon icon-volume") {
        //If sound is on, turn it off
        await soundToggleIcon.click();
      }
      await soundToggleIcon.click();
      expect(await soundToggleIcon.getAttribute("class")).toEqual(
        "icon icon-volume"
      );
      await validateConsoleMessages(
        ExpectedMessage.SOUND_CHECK_GAME_ON,
        consoleMessages
      );
      await soundToggleIcon.click();
      expect(await soundToggleIcon.getAttribute("class")).toEqual(
        "icon icon-volume muted"
      );
      await validateConsoleMessages(
        ExpectedMessage.SOUND_CHECK_GAME_OFF,
        consoleMessages
      );
    });
  });
});
