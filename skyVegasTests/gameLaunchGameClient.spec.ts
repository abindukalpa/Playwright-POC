import { test, type Page } from "@playwright/test";
import { launchGame, validateConsoleMessages, login, startEventListener, readGames } from "./utilities";
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

    test("gameLaunch", async () => {
        startEventListener(page, consoleMessages);
        await launchGame(page, game, consoleMessages);
        await validateConsoleMessages(
          ExpectedMessage.GAME_LOAD_COMPLETE,
          consoleMessages
        );
    })
  });
});