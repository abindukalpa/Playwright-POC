import { test, type Page } from "@playwright/test";
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
  test.describe(`Testing with text: ${game}`, () => {
    test.beforeAll(async ({ browser }) => {
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
        ExpectedMessage.SOUND_CHECK_GAME_ON,
        consoleMessages
      );
      await soundToggleIcon.click();
      await validateConsoleMessages(
        ExpectedMessage.SOUND_CHECK_GAME_OFF,
        consoleMessages
      );
    });
  });
});
