import { test, type Page } from "@playwright/test";
import { launchGame, validateConsoleMessages, login, startEventListener, messageExists, readGames } from "./utilities";
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
      const soundToggleGameWindow = page.frameLocator("#root iframe").locator("i").nth(2)
      startEventListener(page, consoleMessages);
      await launchGame(page, game, consoleMessages);
      if (messageExists(consoleMessages, ExpectedMessage.SOUND_CHECK_TOOL_BAR_ON)) {
        await soundToggleGameWindow.click();
        await validateConsoleMessages(
          ExpectedMessage.SOUND_CHECK_TOOL_BAR_OFF,
          consoleMessages
        );
      } else if (messageExists(consoleMessages, ExpectedMessage.SOUND_CHECK_TOOL_BAR_OFF)) {
        await soundToggleGameWindow.click();
        await validateConsoleMessages(
          ExpectedMessage.SOUND_CHECK_TOOL_BAR_ON,
          consoleMessages
        );
      }
    });
  });
});
