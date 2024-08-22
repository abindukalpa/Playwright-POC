import { test, type Page } from "@playwright/test";
import { launchGame, validateConsoleMessages, login, startEventListener, makeSpin, readGames } from "./utilities";
import { ExpectedMessage } from "../types/expectedMessage";



readGames().forEach((game) => {
    let page: Page;
    const consoleMessages: string[] = [];
    test.describe(`Testing with text: ${game}`, () => {
      test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        await login(page);
      });
  
      test.afterAll(async () => {
        await page.close();
      });
  
      test("realityCheck", async () => {
      startEventListener(page, consoleMessages);

    await launchGame(page, game, consoleMessages);

    await makeSpin(page, consoleMessages);

    await page.waitForTimeout(60000)

    await makeSpin(page, consoleMessages);

    await validateConsoleMessages(
        ExpectedMessage.REALITY_CHECK,
        consoleMessages,
        [65_000, 70_000, 75_000],
        120_000
    )
      });
    });
  });